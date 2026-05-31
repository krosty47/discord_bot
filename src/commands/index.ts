import { helpCommand } from './help.js';
import { listCommand } from './list.js';
import { pauseCommand } from './pause.js';
import { playCommand } from './play.js';
import { resumeCommand } from './resume.js';
import { skipCommand } from './skip.js';
import { stopCommand } from './stop.js';
import type { BotCommand } from './types.js';

export const commands: BotCommand[] = [listCommand, playCommand, stopCommand, pauseCommand, resumeCommand, skipCommand, helpCommand];
