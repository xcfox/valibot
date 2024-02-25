import {
  object,
  type ObjectEntries,
  type ObjectOutput,
  type ObjectSchema,
  optional,
  type OptionalSchema,
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { restAndDefaultArgs } from '../../utils/index.ts';

/**
 * Partial object entries type.
 */
export type PartialObjectEntries<TEntries extends ObjectEntries> = {
  [TKey in keyof TEntries]: OptionalSchema<TEntries[TKey]>;
};

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<TSchema extends ObjectSchema<any, any>>(
  schema: TSchema,
  pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, undefined>>
): ObjectSchema<PartialObjectEntries<TSchema['entries']>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<TSchema extends ObjectSchema<any, any>>(
  schema: TSchema,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, undefined>>
): ObjectSchema<PartialObjectEntries<TSchema['entries']>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<
  TSchema extends ObjectSchema<any, any>,
  TRest extends BaseSchema | undefined,
>(
  schema: TSchema,
  rest: TRest,
  pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>
): ObjectSchema<PartialObjectEntries<TSchema['entries']>, TRest>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<
  TSchema extends ObjectSchema<any, any>,
  TRest extends BaseSchema | undefined,
>(
  schema: TSchema,
  rest: TRest,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>
): ObjectSchema<PartialObjectEntries<TSchema['entries']>, TRest>;

export function partial<
  TSchema extends ObjectSchema<any, any>,
  TRest extends BaseSchema | undefined = undefined,
>(
  schema: TSchema,
  arg2?:
    | Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>
    | ErrorMessageOrMetadata
    | TRest,
  arg3?:
    | Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>
    | ErrorMessageOrMetadata,
  arg4?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>
): ObjectSchema<PartialObjectEntries<TSchema['entries']>, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe, metadata] = restAndDefaultArgs<
    TRest,
    Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>
  >(arg2, arg3, arg4);

  // Create and return object schema
  return object(
    Object.entries(schema.entries).reduce(
      (entries, [key, schema]) => ({
        ...entries,
        [key]: optional(schema as BaseSchema),
      }),
      {}
    ) as PartialObjectEntries<TSchema['entries']>,
    rest,
    metadata === undefined ? message : { message, ...metadata },
    pipe
  );
}
