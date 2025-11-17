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

    // Backslash handling:
    // - Inside single quotes: backslash is literal (no special handling)
    // - Inside double quotes: backslash escapes only: ", \\, $, `, or newline
    // - Outside any quotes: backslash escapes the next character literally
    if (char === "\\" && !inSingleQuote) {
      // inside double quotes: only a few characters are escaped
      if (inDoubleQuote) {
        if (i + 1 < command.length) {
          const next = command[i + 1];
          if (next === '"' || next === '\\' || next === '$' || next === '`' || next === '\n') {
            // consume the escaped character and append it (or drop it for backslash+newline)
            i += 1;
            if (next === '\n') {
              // backslash-newline: line continuation, remove both (append nothing)
            } else {
              current += next;
            }
            continue;
          } else {
            // backslash before other chars inside double quotes stays literal
            current += "\\";
            continue;
          }
        } else {
          // trailing backslash inside double quotes -> literal backslash
          current += "\\";
          continue;
        }
      }

      // outside quotes: escape next character literally (including spaces)
      if (i + 1 < command.length) {
        i += 1;
        current += command[i];
        continue;
      } else {
        // trailing backslash -> literal
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
