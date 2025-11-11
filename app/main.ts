import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
  if (equalsIgnoreCase(filename, "echo")) {
    console.log("echo is a shell builtin");
  } else if (equalsIgnoreCase(filename, "exit")) {
    console.log("exit is a shell builtin");
  } else if (equalsIgnoreCase(filename, "type")) {
    console.log("type is a shell builtin");
  } else {
    console.log(`${filename}: not found`);
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
