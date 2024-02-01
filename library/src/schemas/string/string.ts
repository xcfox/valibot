import type {
  BaseSchema,
  ErrorMessage,
  Pipe,
  SchemaMetadata,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * String schema type.
 */
export type StringSchema<TOutput = string> = BaseSchema<string, TOutput> & {
  /**
   * The schema type.
   */
  type: 'string';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<string> | undefined;
};

/**
 * Creates a string schema.
 *
 * @param pipe A validation and transformation pipe.
 * @param metadata The schema metadata.
 *
 * @returns A string schema.
 */
export function string(
  pipe?: Pipe<string>,
  metadata?: SchemaMetadata<string>
): StringSchema;

/**
 * Creates a string schema.
 *
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 * @param metadata The schema metadata.
 *
 * @returns A string schema.
 */
export function string(
  message?: ErrorMessage,
  pipe?: Pipe<string>,
  metadata?: SchemaMetadata<string>
): StringSchema;

/**
 * Creates a string schema.
 *
 * @param metadata The schema metadata.
 *
 * @returns A string schema.
 */
export function string(metadata?: SchemaMetadata<string>): StringSchema;

export function string(
  arg1?: SchemaMetadata<string> | Pipe<string> | ErrorMessage,
  arg2?: SchemaMetadata<string> | Pipe<string>,
  arg3?: SchemaMetadata<string>
): StringSchema {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(
    arg1,
    arg2,
    arg3
  );

  // Create and return string schema
  return {
    type: 'string',
    async: false,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        return schemaIssue(info, 'type', 'string', this.message, input);
      }

      // Execute pipe and return result
      return pipeResult(input, this.pipe, info, 'string');
    },
  };
}
