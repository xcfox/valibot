import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Pipe,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';
import { defaultArgs } from '../defaultArgs/index.ts';

/**
 * Returns rest, error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 * @param arg3 Third argument.
 * @param arg4 Fourth argument.
 *
 * @returns The tuple arguments.
 */
export function restAndDefaultArgs<
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
  TPipe extends Pipe<any> | PipeAsync<any>
>(
  arg1: SchemaMetadata | TPipe | ErrorMessage | TRest | undefined,
  arg2: SchemaMetadata | TPipe | ErrorMessage | undefined,
  arg3: SchemaMetadata | TPipe | undefined,
  arg4?: SchemaMetadata | undefined
): [
  TRest,
  ErrorMessage | undefined,
  TPipe | undefined,
  SchemaMetadata | undefined
] {
  if (!arg1 || (typeof arg1 === 'object' && !Array.isArray(arg1))) {
    const [error, pipe, metadata] = defaultArgs(arg2, arg3, arg4);
    return [arg1 as TRest, error, pipe, metadata];
  }
  const [error, pipe, metadata] = defaultArgs<TPipe>(
    arg1 as SchemaMetadata | TPipe | ErrorMessage | undefined,
    arg2 as SchemaMetadata | TPipe | undefined,
    arg3 as SchemaMetadata | undefined
  );
  return [undefined as TRest, error, pipe, metadata];
}
