import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Special schema type.
 */
export type SpecialSchema<TInput, TOutput = TInput> = BaseSchema<
  TInput,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'special';
  /**
   * The type check function.
   */
  check: (input: unknown) => boolean;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<TInput> | undefined;
};

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

export function special<TInput>(
  check: (input: unknown) => boolean,
  arg2?: Pipe<TInput> | ErrorMessageOrMetadata,
  arg3?: Pipe<TInput>
): SpecialSchema<TInput> {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'special',
    expects: 'unknown',
    async: false,
    check,
    message,
    pipe,
    metadata,
    _parse(input, config) {
      // If check is fulfilled, return pipe output
      if (this.check(input)) {
        return pipeResult(this, input as TInput, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, special, input, config);
    },
  };
}
