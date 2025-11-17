import { existsSync, accessSync, constants } from "fs";

const paths = process.env["PATH"]?.split(":") || [];

export function equalsIgnoreCase(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

export function findExecutableInPath(filename: string): string | null {
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

export function checkRouteExists(route: string): void {
  if (existsSync(route)) {
    process.chdir(route);
  } else if (route === "~") {process.chdir(process.env.HOME || "");
    process.chdir(process.env.HOME || "");
  } else {
    console.log(`cd: ${route}: No such file or directory`);
  }
}

export function parseCommand(command: string): string[] {
  const args: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    if (char === "'" && !inDoubleQuote) {
      // toggle single-quote state when not inside double quotes
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      // toggle double-quote state when not inside single quotes
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    // Backslash escapes are only honored when NOT inside single or double quotes
    if (char === "\\" && !inSingleQuote && !inDoubleQuote) {
      // If there's a next character, append it literally (escape)
      if (i + 1 < command.length) {
        i += 1;
        current += command[i];
        continue;
      } else {
        // Trailing backslash - treat it as a literal backslash
        current += "\\";
        continue;
      }
    }
    if (/\s/.test(char) && !inSingleQuote && !inDoubleQuote) {
      // split on whitespace only when not inside any quotes
      if (current !== "") {
        args.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current !== "") args.push(current);
  return args;
}
