import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function exit(command: string): void {
  process.exit(parseInt(command, 10));
}

function echo(command: string): void {
  console.log(command.substring(5));
}

function stepRun() {
  rl.question("$ ", (command) => {
    const trimmed = command.trim();
    if(trimmed){
      const parts = trimmed.split(/\s+/);
      if(parts[0] === "exit"){
        exit(parts[1]);
      }
      else if(parts[0] === "echo"){  
        echo(trimmed);
      }
      else{
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
