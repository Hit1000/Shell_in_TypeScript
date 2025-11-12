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
