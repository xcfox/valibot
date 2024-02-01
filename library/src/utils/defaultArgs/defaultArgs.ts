import type {
  ErrorMessage,
  Pipe,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';

/**
 * Returns message and pipe from dynamic arguments.
 *
 * @param args The arguments.
 *
 * @returns The default arguments.
 */
export function defaultArgs<TPipe extends Pipe<any> | PipeAsync<any>>(
  ...args: (SchemaMetadata | TPipe | ErrorMessage | undefined)[]
): [ErrorMessage | undefined, TPipe | undefined, SchemaMetadata | undefined] {
  let message: ErrorMessage | undefined;
  let pipe: TPipe | undefined;
  let metadata: SchemaMetadata | undefined;

  for (const arg of args) {
    if (typeof arg === 'string' || typeof arg === 'function') {
      message = arg;
    } else if (Array.isArray(arg)) {
      pipe = arg;
    } else if (typeof arg === 'object') {
      metadata = arg;
    }
  }

  return [message, pipe, metadata];
}
