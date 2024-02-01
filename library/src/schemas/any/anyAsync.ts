import type {
  BaseSchemaAsync,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';
import { defaultArgs, pipeResultAsync } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchemaAsync<TOutput = any> = BaseSchemaAsync<any, TOutput> & {
  /**
   * The schema type.
   */
  type: 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<any> | undefined;
};

/**
 * Creates an async any schema.
 *
 * @param pipe A validation and transformation pipe.
 * @param metadata The schema metadata.
 *
 * @returns An async any schema.
 */
export function anyAsync(
  pipe?: PipeAsync<any>,
  metadata?: SchemaMetadata
): AnySchemaAsync;
/**
 * Creates an async any schema.
 *
 * @param metadata The schema metadata.
 *
 * @returns An async any schema.
 */
export function anyAsync(metadata?: SchemaMetadata): AnySchemaAsync;

export function anyAsync(
  arg1?: SchemaMetadata | PipeAsync<any>,
  arg2?: SchemaMetadata
): AnySchemaAsync {
  const [, pipe, metadata] = defaultArgs(arg1, arg2);
  return {
    type: 'any',
    async: true,
    metadata,
    pipe,
    async _parse(input, info) {
      return pipeResultAsync(input, this.pipe, info, 'any');
    },
  };
}
