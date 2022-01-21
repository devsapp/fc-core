export { formatterOutput } from "./formatter-output";
export { CatchableError } from "./errors";
export * from "./interface";

import { sync as commandExistsSync } from 'command-exists';

export function commandExists(command) {
  try {
    return commandExistsSync(command);
  } catch (_ex) {
    return false;
  }
}