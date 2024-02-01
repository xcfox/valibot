import type {
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';

/**
 * String schema async type.
 */
export type StringSchemaAsync<TOutput = string> = BaseSchemaAsync<
  string,
  TOutput
> & {
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
  pipe: PipeAsync<string> | undefined;
};

/**
 * Creates an async string schema.
 *
 * @param pipe A validation and transformation pipe.
 * @param metadata The schema metadata.
 *
 * @returns An async string schema.
 */
export function stringAsync(
  pipe?: PipeAsync<string>,
  metadata?: SchemaMetadata<string>
): StringSchemaAsync;

/**
 * Creates an async string schema.
 *
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 * @param metadata The schema metadata.
 *
 * @returns An async string schema.
 */
export function stringAsync(
  message?: ErrorMessage,
  pipe?: PipeAsync<string>,
  metadata?: SchemaMetadata<string>
): StringSchemaAsync;

/**
 * Creates an async string schema.
 *
 * @param metadata The schema metadata.
 *
 * @returns An async string schema.
 */
export function stringAsync(
  metadata?: SchemaMetadata<string>
): StringSchemaAsync;

export function stringAsync(
  arg1?: SchemaMetadata<string> | PipeAsync<string> | ErrorMessage,
  arg2?: SchemaMetadata<string> | PipeAsync<string>,
  arg3?: SchemaMetadata<string>
): StringSchemaAsync {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(
    arg1,
    arg2,
    arg3
  );

  // Create and return async string schema
  return {
    type: 'string',
    async: true,
    message,
    pipe,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        return schemaIssue(info, 'type', 'string', this.message, input);
      }

      // Execute pipe and return result
      return pipeResultAsync(input, this.pipe, info, 'string');
    },
  };
}
