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
  const input = command.slice(5).trim();

  // Split by single quotes, alternating between quoted and unquoted sections
  const parts = input.split(/'/);

  let result = "";
  let inQuotes = false;

  for (const part of parts) {
    if (inQuotes) {
      // Inside quotes → preserve exactly as-is
      result += part;
    } else {
      // Outside quotes → collapse multiple spaces
      result += part.trim().replace(/\s+/g, " ");
    }
    inQuotes = !inQuotes; // flip quote state each time
  }

  console.log(result.trim());
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
      const [part, ...part2] = trimmed.split(/\s+/);
      if (equalsIgnoreCase(part, "exit")) {
        exit(part2[0]);
      } else if (equalsIgnoreCase(part, "echo")) {
        echo(trimmed);
      } else if (equalsIgnoreCase(part, "type")) {
        type(part2[0]);
      } else if (equalsIgnoreCase(part, "pwd")) {
        console.log(process.cwd());
      } else if ((execPath = findExecutableInPath(part))) {
        exec.execSync(command, { stdio: "inherit" });
      } else if (equalsIgnoreCase(part, "cd")) {
        checkRouteExists(part2[0]);
      } else {
        console.log(`${part}: command not found`);
      }
    }
    stepRun();
  });
}

function main() {
  stepRun();
}

main();
