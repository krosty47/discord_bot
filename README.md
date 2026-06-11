# Discord Local Music Bot

Bot de Discord para reproducir canciones `.mp3` locales desde una carpeta `music/`. No usa YouTube, Spotify, descargas ni streaming externo.

## Requisitos

- Windows.
- Node.js 22 o superior: <https://nodejs.org/>.
- pnpm 10.12.1 o superior. Si no lo tenés, Node incluye Corepack para habilitarlo.
- Git para clonar el proyecto: <https://git-scm.com/download/win>.
- Una cuenta de Discord.
- Permisos para invitar bots al servidor.

## Instalar herramientas en Windows

Antes de usar el bot en otra computadora, instalá estas herramientas:

### 1. Instalar Node.js

1. Abrí <https://nodejs.org/>.
2. Descargá la versión **LTS** si es Node.js 22 o superior.
3. Instalá Node.js con las opciones por defecto.
4. Abrí **PowerShell** o **Command Prompt** y verificá:

```bat
node -v
```

Debe mostrar una versión `22.x` o superior.

### 2. Habilitar pnpm

Node.js incluye Corepack, que permite usar pnpm. En PowerShell o Command Prompt ejecutá:

```bat
corepack enable
pnpm -v
```

Si `pnpm -v` muestra una versión, ya está listo.

### 3. Instalar Git

1. Abrí <https://git-scm.com/download/win>.
2. Descargá e instalá Git para Windows.
3. Podés dejar las opciones por defecto.
4. Cerrá y volvé a abrir PowerShell o Command Prompt.
5. Verificá:

```bat
git --version
```

## Descargar el bot en Windows

Elegí una carpeta donde guardar el bot, por ejemplo `Documents`, y ejecutá:

```bat
cd %USERPROFILE%\Documents
git clone https://github.com/krosty47/discord_bot.git
cd discord_bot
```

Después seguí con la configuración del archivo `.env`, la instalación de dependencias y el registro de comandos.

## Qué hace

La persona que usa el bot solo necesita:

1. Copiar canciones `.mp3` dentro de `music/`.
2. Completar el archivo `.env`.
3. Ejecutar scripts `.bat` o comandos `pnpm`.
4. Usar comandos slash en Discord.

## Crear el bot en Discord Developer Portal

1. Abrí <https://discord.com/developers/applications>.
2. Hacé clic en **New Application**.
3. Elegí un nombre para el bot.
4. Entrá a **Bot** en el menú lateral.
5. Hacé clic en **Add Bot** si todavía no existe.

## Obtener Bot Token

1. En **Bot**, buscá la sección **Token**.
2. Hacé clic en **Reset Token** o **Copy Token**.
3. Copiá el valor en `DISCORD_TOKEN` dentro de `.env`.

No compartas este token con nadie.

## Obtener Client ID

1. En el Developer Portal, entrá a **OAuth2**.
2. Copiá el valor **Client ID**.
3. Pegalo en `DISCORD_CLIENT_ID` dentro de `.env`.

## Obtener Guild ID

1. En Discord, activá **Developer Mode**:
   - User Settings → Advanced → Developer Mode.
2. Hacé clic derecho sobre tu servidor.
3. Elegí **Copy Server ID**.
4. Pegalo en `DISCORD_GUILD_ID` dentro de `.env`.

`DISCORD_GUILD_ID` registra comandos solo en ese servidor para que aparezcan rápido.

## Invitar el bot al servidor

1. En el Developer Portal, entrá a **OAuth2 → URL Generator**.
2. En **Scopes**, marcá:
   - `bot`
   - `applications.commands`
3. En **Bot Permissions**, marcá:
   - View Channels
   - Send Messages
   - Connect
   - Speak
4. Copiá la URL generada.
5. Abrila en el navegador e invitá el bot a tu servidor.

No hace falta usar permisos de Administrator.

## Configurar `.env`

Copiá `.env.example` como `.env` y completá los valores:

```env
DISCORD_TOKEN=tu_token
DISCORD_CLIENT_ID=tu_client_id
DISCORD_GUILD_ID=tu_server_id
MUSIC_DIR=./music
DEFAULT_VOLUME=0.5
```

`DEFAULT_VOLUME` acepta valores entre `0` y `1`.

## Agregar canciones

Copiá archivos `.mp3` dentro de la carpeta `music/`. También podés organizarlos en subcarpetas:

```txt
music/
  mi-cancion.mp3
  Rock/
    Queen/
      bohemian-rhapsody.mp3
  Cumbia/
    tema.mp3
```

El bot busca `.mp3` dentro de `music/` y sus subcarpetas. En Discord los muestra con ruta relativa, por ejemplo `Rock/Queen/bohemian-rhapsody.mp3`.

## Instalar dependencias

Si `pnpm` no está disponible, ejecutá una vez:

```bash
corepack enable
```

Opción Windows:

```txt
scripts/install.bat
```

Opción terminal:

```bash
pnpm install
```

## Registrar comandos slash

Después de configurar `.env`, ejecutá:

```txt
scripts/deploy-commands.bat
```

O con terminal:

```bash
pnpm run deploy:commands
```

## Iniciar el bot

Opción Windows:

```txt
scripts/start.bat
```

Opción terminal:

```bash
pnpm run build
pnpm start
```

Para desarrollo:

```bash
pnpm run dev
```

## Comandos disponibles

- `/list`: muestra las canciones `.mp3` disponibles, incluyendo subcarpetas.
- `/play song:<archivo.mp3>`: reproduce una canción o la agrega a la cola. Si está en subcarpeta, usá la ruta relativa, por ejemplo `Rock/Queen/bohemian-rhapsody.mp3`.
- `/pause`: pausa la canción actual.
- `/resume`: reanuda la canción pausada.
- `/skip`: salta a la siguiente canción.
- `/stop`: detiene la reproducción, limpia la cola y desconecta el bot.
- `/help`: muestra ayuda breve.

## Uso esperado

```bash
pnpm install
pnpm run deploy:commands
pnpm run build
pnpm start
```

En Discord:

```txt
/list
/play song:mi-cancion.mp3
/play song:Rock/Queen/bohemian-rhapsody.mp3
/pause
/resume
/skip
/stop
```

## Problemas comunes

### El bot no aparece online

- Revisá que `DISCORD_TOKEN` esté bien copiado.
- Ejecutá `pnpm start` y mirá el error en la consola.
- Confirmá que el bot fue invitado al servidor correcto.

### Los comandos no aparecen

- Ejecutá `pnpm run deploy:commands` o `scripts/deploy-commands.bat`.
- Revisá que `DISCORD_CLIENT_ID` y `DISCORD_GUILD_ID` sean correctos.
- Confirmá que invitaste el bot con el scope `applications.commands`.

### El bot entra pero no reproduce

- Confirmá que el archivo sea `.mp3` válido.
- Revisá que el bot tenga permisos `Connect` y `Speak`.
- Mirá la consola por errores de audio.
- Este proyecto incluye `ffmpeg-static` para no instalar FFmpeg manualmente.

### No encuentra canciones

- Poné los archivos dentro de `music/` o alguna subcarpeta de `music/`.
- Usá extensión `.mp3`.
- Ejecutá `/list` para ver los nombres exactos.
- Si cambiaste `MUSIC_DIR`, revisá que apunte a la carpeta correcta.

### Error de permisos

El bot necesita estos permisos en el canal de texto y voz:

- View Channels
- Send Messages
- Connect
- Speak

### Token inválido

- Volvé a copiar el token desde Developer Portal → Bot.
- Pegalo en `.env` sin comillas ni espacios extras.
- No pegues el Client Secret: debe ser el Bot Token.

## Seguridad

- No compartas el token.
- No subas `.env` a GitHub.
- Usá solo música que tengas permiso de reproducir.
- El bot valida las rutas y solo reproduce `.mp3` encontrados dentro de `MUSIC_DIR` o sus subcarpetas.
