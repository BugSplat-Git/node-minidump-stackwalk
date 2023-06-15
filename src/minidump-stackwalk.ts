import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
const execAsync = util.promisify(exec);

export interface MinidumpStackwalkOptions {
    // -m Output in machine-readable format
    machineReadable?: boolean;

    // -s Output stack contents
    stackContents?: boolean;

    // -c Output thread that causes crash or dump only
    dumpingThreadOnly?: boolean;

    // -b Brief of the thread that causes crash or dump
    threadBrief?: boolean;
}

export enum Platform {
    darwin = 'darwin',
    bullseye = 'bullseye',
    win32 = 'win32',
}

export async function minidumpStackwalk(minidumpPath: string, symbolPaths: Array<string>, platform: Platform = Platform.bullseye, options: MinidumpStackwalkOptions = {}): Promise<{ stdout: string, stderr: string }> {
    return execAsync(createCommand(minidumpPath, symbolPaths, platform, options));
}

export function minidumpStackwalkSync(minidumpPath: string, symbolPaths: Array<string>, platform: Platform = Platform.bullseye, options: MinidumpStackwalkOptions = {}): Buffer {
    return execSync(createCommand(minidumpPath, symbolPaths, platform, options));
}

function createCommand(minidumpPaths: string, symbolPaths: Array<string>, platform: Platform = Platform.bullseye, options: MinidumpStackwalkOptions): string {
    const minidumpStackwalkFileName = platform === Platform.win32 ? 'minidump_stackwalk.exe' : 'minidump_stackwalk';
    const minidumpStackwalkPath = path.join(__dirname, `../bin/${platform}/${minidumpStackwalkFileName}`);
    const supported = fs.existsSync(minidumpStackwalkPath);
    const opts = [];

    if (!supported) {
        throw new Error(`Platform: ${platform} is not supported`);
    }

    if (options.machineReadable) {
        opts.push(['-m']);
    }

    if (options.stackContents) {
        opts.push(['-s']);
    }

    if (options.dumpingThreadOnly) {
        opts.push(['-c']);
    }

    if (options.threadBrief) {
        opts.push(['-b']);
    }

    return `${minidumpStackwalkPath} ${opts.join(' ')} ${minidumpPaths} ${symbolPaths.join(' ')}`;
}

