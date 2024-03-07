import { promisify } from 'util';
import { execFile } from 'child_process';

const exec = promisify(execFile);
