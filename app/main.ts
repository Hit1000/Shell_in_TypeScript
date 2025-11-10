import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function exit(command: string): void {
  if (command.trim() === "exit 0") {
    process.exit(0);
  }
}

function echo(command: string): void {
  if(command.substring(0, 4) == "echo"){
    console.log(command.substring(5));
  }
}

function stepRun() {
  rl.question("$ ", (command) => {
    exit(command);
    echo(command);

    console.log(`${command}: command not found`);
    stepRun();
  });
}

function main() {
  stepRun();
}

main();
