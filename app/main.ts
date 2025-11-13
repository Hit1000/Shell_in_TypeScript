import { createInterface } from "readline";
import {
  equalsIgnoreCase,
  findExecutableInPath,
  checkRouteExists,
} from "./utils.js";
import exec from "child_process";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const types = ["echo", "exit", "type", "pwd", "cd"];

function exit(command: string): void {
  process.exit(parseInt(command, 10));
}

function echo(command: string[]): void {
  process.stdout.write(`${command.join(" ")}\n`);
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

function parseCommand(command: string): string[] {
  const args = [];
  let current = "";
  let inQuote = null;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if ((char === "'" || char === '"') && inQuote === null) {
      inQuote = char;
    } else if (char === inQuote) {
      inQuote = null;
    } else if (/\s/.test(char) && inQuote === null) {
      if (current !== "") {
        args.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current !== "") args.push(current);
  return args;
}

function stepRun() {
  rl.question("$ ", (command) => {
    const trimmed = command.trim();
    const tokens = parseCommand(command);
    let execPath: string | null = null;
    if (trimmed) {
      // const [part, ...part2] = trimmed.split(/\s+/);
      const [command, ...args] = tokens;
      if (equalsIgnoreCase(command, "exit")) {
        exit(args[0]);
      } else if (equalsIgnoreCase(command , "echo")) {
        echo(args);
      } else if (equalsIgnoreCase(command, "type")) {
        type(args[0]);
      } else if (equalsIgnoreCase(command, "pwd")) {
        console.log(process.cwd());
      } else if ((execPath = findExecutableInPath(command))) {
        exec.execSync(command, { stdio: "inherit" });
      } else if (equalsIgnoreCase(command, "cd")) {
        checkRouteExists(args[0]);
      } else {
        console.log(`${command}: command not found`);
      }
    }
    stepRun();
  });
}

function main() {
  stepRun();
}

main();
