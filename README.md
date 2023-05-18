[![bugsplat-github-banner-basic-outline](https://user-images.githubusercontent.com/20464226/149019306-3186103c-5315-4dad-a499-4fd1df408475.png)](https://bugsplat.com)
<br/>
# <div align="center">BugSplat</div> 
### **<div align="center">Crash and error reporting built for busy developers.</div>**
<div align="center">
    <a href="https://twitter.com/BugSplatCo">
        <img alt="Follow @bugsplatco on Twitter" src="https://img.shields.io/twitter/follow/bugsplatco?label=Follow%20BugSplat&style=social">
    </a>
    <a href="https://discord.gg/K4KjjRV5ve">
        <img alt="Join BugSplat on Discord" src="https://img.shields.io/discord/664965194799251487?label=Join%20Discord&logo=Discord&style=social">
    </a>
</div>

## 👋 Introduction

node-minidump-stackwalk is a thin wrapper around the [Breakpad](https://chromium.googlesource.com/breakpad/breakpad/) minidump_stackwalk utility that allows minidump_stackwalk to be added to your project via [npm](https://www.npmjs.com/). This package can be invoked via the `node-minidump-stackwalk` command-line command, or used as a library by importing `minidumpStackwalk`.

## 🏗️ Installation

Install `node-minidump-stackwalk` as a package dependency.

```sh
npm i node-minidump-stackwalk
```

Or install `node-minidump-stackwalk` globally as a command-line tool.

```sh
npm i -g node-minidump-stackwalk
```

## 🧑‍💻 Command

If you installed `node-minidump-stackwalk` globally you can invoke it in via a terminal window.

```sh
node-minidump-stackwalk <minidump-file-path> <symbol-paths> [-p <platform>] [-m] [-s] [-c] [-b] [-v]
```

The first argument is the path to your minidump file. The second argument is a path or array of paths to search for sym files. Specify a platform with `-p <platform>`. Valid platforms are `darwin`, and `bullseye`. You can also specify the `-m`, `-s`, `-c`, and `-b` minidump_stackwalk arguments. The `-v` argument will print stderr to the terminal.

For additional platform support, please [open an issue](https://github.com/BugSplat-Git/node-minidump-stackwalk/issues/new).

## 📚 Library

Import or require `minidumpStackwalk`.

```ts
import { minidumpStackwalk, minidumpStackwalkSync } from 'node-minidump-stackwalk'
```

Await a call to `minidumpStackwalk`, providing it a path to your minidump file, and an array of symbol folder paths, and optionally the platform you're running on as well as options to forward to the minidump_stackwalk executable.

```ts
const options: MinidumpStackwalkOptions = {
  machineReadable: true,
  stackContents: false,
  dumpingThreadOnly: false,
  threadBrief: falst
};

await minidumpStackwalk('/path/to/minidump.dmp', ['/path/to/symbols'], 'darwin', options);
```

You can also call `minidumpStackwalkSync` to perform the same operation synchronously.

```ts
minidumpStackwalkSync('/path/to/minidump.dmp', ['/path/to/symbols'], 'darwin', options);
```

## 🐛 About

[BugSplat](https://bugsplat.com) is a software crash and error reporting service with support for [Qt](https://docs.bugsplat.com/introduction/getting-started/integrations/cross-platform/qt), [Linux](https://docs.bugsplat.com/introduction/getting-started/integrations/desktop/linux), [Android](https://docs.bugsplat.com/introduction/getting-started/integrations/mobile/android) and [many more](https://docs.bugsplat.com/introduction/getting-started/integrations). BugSplat automatically captures critical diagnostic data such as stack traces, log files, and other runtime information. BugSplat also provides automated incident notifications, a convenient dashboard for monitoring trends and prioritizing engineering efforts, and integrations with popular development tools to maximize productivity and ship more profitable software.