#! /usr/bin/env node
import { Platform, minidumpStackwalk } from "../src/minidump-stackwalk";
import fs from 'fs';

const { argv } = process;
const availablePlatforms = Object.keys(Platform).join(', ');
const minidumpFilePath = argv.find(arg => arg.endsWith('.dmp'))!;
const minidumpIndex = argv.indexOf(minidumpFilePath);
const symbolPaths = argv.slice(minidumpIndex + 1, argv.length);
const platformIndex = argv.indexOf('-p') + 1;
const platform = argv.at(platformIndex) as Platform || Platform.bullseye;
const verbose = argv.includes('-v');

if (!minidumpFilePath) {
    logErrorAndExit(`Please specify a minidump file`);
}

if (!fs.existsSync(minidumpFilePath)) {
    logErrorAndExit(`File doesn't exist at path ${minidumpFilePath}`);
}

if (!symbolPaths.length) {
    logErrorAndExit(`Please specify at least one symbol path`);
}

if (!validPlatform(platform)) {
    logErrorAndExit(`Please specify a platform, valid platforms: ${availablePlatforms}`);
}

(async () => {
    const options = {
        machineReadable: argv.includes('-m'),
        stackContents: argv.includes('-s'),
        dumpingThreadOnly: argv.includes('-c'),
        threadBrief: argv.includes('-b'),
    };
    const { stdout, stderr } = await minidumpStackwalk(minidumpFilePath, symbolPaths, platform, options); 
    console.log(stdout);

    if (verbose) {
        console.error(stderr);
    }
})();

function logErrorAndExit(message: string) {
    console.error(message);
    console.log('Usage: node-minidump-stackwalk <minidump-file-path> <symbol-paths> [-p <platform>] [-m] [-s] [-c] [-b] [-v]');
    process.exit(-1);
}

function validPlatform(platform: string): platform is Platform {
    return Boolean(platform && Object.keys(Platform).includes(platform as Platform));
}