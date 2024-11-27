import * as child_process from 'child_process';
import path from 'path';
import util from 'util';
import { Platform } from '../src/minidump-stackwalk';
const exec = util.promisify(child_process.exec);
const testScript = path.join(__dirname, '..', 'bin', 'index.ts');
const platform = process.platform as Platform;
const minidumpPath = path.join(__dirname, 'support', 'minidump', 'minidump.dmp');
const symbolsPath = path.join(__dirname, 'support', 'symbols');

describe('command line', () => {
    it('should output symbolicated minidump', async () => {
        const { stdout, stderr } = await exec(`npx ts-node ${testScript} -m -p ${platform} ${minidumpPath} ${symbolsPath}`);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('mainwindow.cpp|18');
    });
});