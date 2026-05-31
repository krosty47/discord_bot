import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  type AudioPlayer,
  type VoiceConnection,
} from '@discordjs/voice';
import { ChannelType, ChatInputCommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import ffmpegPath from 'ffmpeg-static';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { MusicLibraryService } from './music.service.js';
import { MusicQueue } from './music.queue.js';
import type { MusicTrack, QueuedTrack } from './types.js';

interface GuildMusicSession {
  guildId: string;
  queue: MusicQueue;
  player: AudioPlayer;
  connection: VoiceConnection;
  stopping: boolean;
}

export class VoiceMusicService {
  private readonly sessions = new Map<string, GuildMusicSession>();

  constructor(private readonly library: MusicLibraryService) {
    if (!ffmpegPath) {
      logger.warn('No se encontró ffmpeg-static. La reproducción de MP3 puede fallar.');
    }
  }

  async play(interaction: ChatInputCommandInteraction, song: string): Promise<string> {
    if (!interaction.guild) {
      return 'Este comando solo funciona dentro de un servidor de Discord.';
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return 'Tenés que estar dentro de un canal de voz para usar `/play`.';
    }

    if (voiceChannel.type !== ChannelType.GuildVoice && voiceChannel.type !== ChannelType.GuildStageVoice) {
      return 'Ese canal de voz no es compatible.';
    }

    const me = interaction.guild.members.me ?? (await interaction.guild.members.fetchMe());
    const permissions = voiceChannel.permissionsFor(me);

    if (!permissions?.has(PermissionFlagsBits.Connect)) {
      return 'No tengo permiso para entrar a tu canal de voz. Necesito `Connect`.';
    }

    if (!permissions.has(PermissionFlagsBits.Speak)) {
      return 'No tengo permiso para hablar en tu canal de voz. Necesito `Speak`.';
    }

    const track = await this.library.findTrack(song);
    if (!track) {
      return 'No encontré esa canción en la carpeta `music/`. Usá `/list` para ver las canciones disponibles.';
    }

    const session = await this.getOrCreateSession(interaction.guild.id, voiceChannel.id, interaction.guild.voiceAdapterCreator);
    const queuedTrack: QueuedTrack = { track, requestedBy: interaction.user.id };

    if (session.queue.current || session.player.state.status !== AudioPlayerStatus.Idle) {
      const position = session.queue.enqueue(queuedTrack);
      return `Agregué **${track.fileName}** a la cola. Posición: ${position}.`;
    }

    session.queue.enqueue(queuedTrack);
    this.playNext(session);
    return `Reproduciendo **${track.fileName}**.`;
  }

  stop(guildId: string): string {
    const session = this.sessions.get(guildId) ?? this.getExistingConnectionSession(guildId);
    if (!session) return 'No hay música reproduciéndose ahora.';

    this.destroySession(session);
    return 'Detuve la música, limpié la cola y me desconecté.';
  }

  pause(guildId: string): string {
    const session = this.sessions.get(guildId);
    if (!session || session.player.state.status !== AudioPlayerStatus.Playing) {
      return 'No hay una canción reproduciéndose para pausar.';
    }

    session.player.pause(true);
    return 'Pausé la canción actual.';
  }

  resume(guildId: string): string {
    const session = this.sessions.get(guildId);
    if (!session || session.player.state.status !== AudioPlayerStatus.Paused) {
      return 'No hay una canción pausada para reanudar.';
    }

    session.player.unpause();
    return 'Reanudé la canción.';
  }

  skip(guildId: string): string {
    const session = this.sessions.get(guildId);
    if (!session || !session.queue.current) {
      return 'No hay una canción reproduciéndose para saltar.';
    }

    const skipped = session.queue.current.track.fileName;

    if (!session.queue.hasPending()) {
      this.destroySession(session);
      return `Salté **${skipped}**. No había más canciones en cola, así que me desconecté.`;
    }

    session.player.stop(true);
    return `Salté **${skipped}**. Reproduciendo la siguiente canción.`;
  }

  private async getOrCreateSession(
    guildId: string,
    channelId: string,
    adapterCreator: Parameters<typeof joinVoiceChannel>[0]['adapterCreator'],
  ): Promise<GuildMusicSession> {
    const existing = this.sessions.get(guildId);
    if (existing) return existing;

    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
      selfDeaf: false,
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    const session: GuildMusicSession = {
      guildId,
      queue: new MusicQueue(),
      player,
      connection,
      stopping: false,
    };

    player.on(AudioPlayerStatus.Idle, () => {
      if (!session.stopping) this.playNext(session);
    });

    player.on('error', (error) => {
      const current = session.queue.current?.track.fileName ?? 'desconocida';
      logger.error(`Error reproduciendo ${current}`, error);
      this.playNext(session);
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch {
        this.destroySession(session);
      }
    });

    connection.subscribe(player);
    this.sessions.set(guildId, session);
    return session;
  }

  private playNext(session: GuildMusicSession): void {
    const next = session.queue.next();

    if (!next) {
      this.destroySession(session);
      return;
    }

    this.playTrack(session, next.track);
  }

  private playTrack(session: GuildMusicSession, track: MusicTrack): void {
    const resource = createAudioResource(track.absolutePath, { inlineVolume: true });
    resource.volume?.setVolume(config.defaultVolume);
    session.player.play(resource);
    logger.info(`Reproduciendo ${track.fileName}`);
  }

  private destroySession(session: GuildMusicSession): void {
    session.stopping = true;
    session.queue.clear();
    session.player.stop(true);
    session.connection.destroy();
    this.sessions.delete(session.guildId);
  }

  private getExistingConnectionSession(guildId: string): GuildMusicSession | null {
    const connection = getVoiceConnection(guildId);
    if (!connection) return null;

    const player = createAudioPlayer();
    const session: GuildMusicSession = {
      guildId,
      queue: new MusicQueue(),
      player,
      connection,
      stopping: false,
    };

    return session;
  }
}
