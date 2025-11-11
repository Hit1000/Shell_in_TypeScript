import { createInterface } from "readline";
import { existsSync, accessSync, constants } from "fs";
import exec from "child_process";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const paths = process.env["PATH"]?.split(":") || [];
const types = ["echo", "exit", "type"];

function equalsIgnoreCase(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase();
}

function exit(command: string): void {
  process.exit(parseInt(command, 10));
}

function echo(command: string): void {
  console.log(command.substring(5));
}

function findExecutableInPath(filename: string): string | null {
  for (const path of paths) {
    const fullPath = `${path}/${filename}`;
    if (existsSync(fullPath)) {
      try {
        accessSync(fullPath, constants.X_OK);
        return fullPath;
      } catch {}
    }
  }
  return null;
}

function type(filename: string): void {
  let fullPath: string | null = null;
  if (types.includes(filename.toLowerCase())) {
    rl.write(`${filename} is a shell builtin\n`);
  } else if ((fullPath = findExecutableInPath(filename))) {
    rl.write(`${filename} is ${fullPath}\n`);
  } else {
    rl.write(`${filename}: not found\n`);
  }
}

function stepRun() {
  rl.question("$ ", (command) => {
    const trimmed = command.trim();
    let execPath: string | null = null;
    if (trimmed) {
      const parts = trimmed.split(/\s+/);
      if (equalsIgnoreCase(parts[0], "exit")) {
        exit(parts[1]);
      } else if (equalsIgnoreCase(parts[0], "echo")) {
        echo(trimmed);
      } else if (equalsIgnoreCase(parts[0], "type")) {
        type(parts[1]);
      } else if( execPath = findExecutableInPath(parts[0])) {
        exec.execSync(command, { stdio: "inherit" });
      } else {
        console.log(`${parts[0]}: command not found`);
      }
    }
    stepRun();
  });
}

function main() {
  stepRun();
}

main();
