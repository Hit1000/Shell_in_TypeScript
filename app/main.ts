import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function stepRun() {
  rl.question("$ ", (answer) => {
    if(answer.trim() === "exit 0"){
      process.exit(0);
    } 
    console.log(`${answer}: command not found`)
    stepRun()
  });
}

function main() {
  stepRun()
}

main()