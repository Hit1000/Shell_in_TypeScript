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

function echo(command: string): void {
  console.log(command.substring(5).replace(/'/g, ""));
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
      } else if (equalsIgnoreCase(parts[0], "pwd")) {
        console.log(process.cwd());
      } else if ((execPath = findExecutableInPath(parts[0]))) {
        exec.execSync(command, { stdio: "inherit" });
      } else if (equalsIgnoreCase(parts[0], "cd")) {
        checkRouteExists(parts[1])
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
