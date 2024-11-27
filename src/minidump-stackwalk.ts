import { spawnSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

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

export async function minidumpStackwalk(
    minidumpPath: string,
    symbolPaths: Array<string>,
    platform: Platform = Platform.bullseye,
    options: MinidumpStackwalkOptions = {}
): Promise<{ stdout: string; stderr: string }> {
    const { command, args } = createCommandArgs(minidumpPath, symbolPaths, platform, options);

    return new Promise((resolve, reject) => {
        const process = spawn(command, args);
        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Process exited with code ${code}\n${stderr}`));
            }
        });

        process.on('error', (err) => {
            reject(err);
        });
    });
}

export function minidumpStackwalkSync(
    minidumpPath: string,
    symbolPaths: Array<string>,
    platform: Platform = Platform.bullseye,
    options: MinidumpStackwalkOptions = {}
): Buffer {
    const { command, args } = createCommandArgs(minidumpPath, symbolPaths, platform, options);
    const result = spawnSync(command, args);

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`Process exited with code ${result.status}\n${result.stderr}`);
    }

    return result.stdout;
}

function createCommandArgs(
    minidumpPath: string,
    symbolPaths: Array<string>,
    platform: Platform = Platform.bullseye,
    options: MinidumpStackwalkOptions
): { command: string; args: string[] } {
    const minidumpStackwalkFileName = platform === Platform.win32 ? 'minidump_stackwalk.exe' : 'minidump_stackwalk';
    const minidumpStackwalkPath = path.join(__dirname, `../bin/${platform}/${minidumpStackwalkFileName}`);

    if (!existsSync(minidumpStackwalkPath)) {
        throw new Error(`Platform: ${platform} is not supported`);
    }

    const args: string[] = [];

    if (options.machineReadable) {
        args.push('-m');
    }
    if (options.stackContents) {
        args.push('-s');
    }
    if (options.dumpingThreadOnly) {
        args.push('-c');
    }
    if (options.threadBrief) {
        args.push('-b');
    }

    // Add the minidump path and symbol paths as separate arguments
    args.push(minidumpPath);
    args.push(...symbolPaths);

    return {
        command: minidumpStackwalkPath,
        args
    };
}