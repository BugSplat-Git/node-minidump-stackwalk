import path from "path";
import { Platform, minidumpStackwalk, minidumpStackwalkSync } from "../src/minidump-stackwalk";

const platform = process.platform === 'darwin' ? Platform.darwin : Platform.bullseye;
const minidumpPath = path.join(__dirname, 'support', 'minidump', 'minidump.dmp');
const symbolsPath = path.join(__dirname, 'support', 'symbols');

describe('lib', () => {
    describe('minidumpStackwalk', () => {
        it('should output symbolicated minidump on macos', async () => {
            const { stdout, stderr } = await minidumpStackwalk(minidumpPath, [symbolsPath], platform);
            
            expect(stderr).toBeTruthy();
            expect(stdout).toContain('mainwindow.cpp : 18');
        });
    });

    describe('minidumpStackwalkSync', () => {
        it('should output symbolicated minidump on macos', async () => {
            const result = minidumpStackwalkSync(minidumpPath, [symbolsPath], platform);
            
            expect(result.toString()).toContain('mainwindow.cpp : 18');    
        });
    });
});