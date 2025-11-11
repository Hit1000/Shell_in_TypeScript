import { createInterface } from "readline";
import { existsSync, accessSync, constants } from "fs";

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

function type(filename: string): void {
  if (types.includes(filename.toLowerCase())) {
    rl.write(`${filename} is a shell builtin\n`);
  } else {
    for (const path of paths) {
      const fullPath = `${path}/${filename}`;
      if (existsSync(fullPath)) {
        rl.write(`${filename} is ${fullPath}\n`);
        // try {
        //   accessSync(fullPath, constants.X_OK);
        //   return;
        // } catch {}
      }
    }
    rl.write(`${filename}: not found\n`);
  }
}

function stepRun() {
  rl.question("$ ", (command) => {
    const trimmed = command.trim();
    if (trimmed) {
      const parts = trimmed.split(/\s+/);
      if (equalsIgnoreCase(parts[0], "exit")) {
        exit(parts[1]);
      } else if (equalsIgnoreCase(parts[0], "echo")) {
        echo(trimmed);
      } else if (equalsIgnoreCase(parts[0], "type")) {
        type(parts[1]);
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
