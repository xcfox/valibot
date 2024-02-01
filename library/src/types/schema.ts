import type { Issue, Issues } from './issues.ts';

/**
 * Parse info type.
 */
export type ParseInfo = Partial<
  Pick<Issue, 'origin' | 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>
>;

/**
 * Typed schema result type.
 */
export type TypedSchemaResult<TOutput> = {
  /**
   * Whether is's typed.
   */
  typed: true;
  /**
   * The parse output.
   */
  output: TOutput;
  /**
   * The parse issues.
   */
  issues?: Issues;
};

/**
 * Untyped parse result type.
 */
export type UntypedSchemaResult = {
  /**
   * Whether is's typed.
   */
  typed: false;
  /**
   * The parse output.
   */
  output: unknown;
  /**
   * The parse issues.
   */
  issues: Issues;
};

/**
 * Schema result type.
 */
export type SchemaResult<TOutput> =
  | TypedSchemaResult<TOutput>
  | UntypedSchemaResult;

/**
 * Schema metadata type.
 */
export interface SchemaMetadata<T = any> {
  /**
   * The title of the schema.
   */
  title?: string;
  /**
   * A brief description of the schema.
   */
  description?: string;

  /**
   * The `examples` is a place to provide an array of examples that validate against the schema.
   */
  examples?: T[];

  /**
   * The `readOnly` keyword indicates that the value of the instance is managed exclusively by the owning authority, and attempts by an application to modify the value of this property are expected to be ignored or rejected by that owning authority.
   */
  readOnly?: boolean;

  /**
   * The `writeOnly` keyword indicates that the value is never present when the instance is retrieved from the owning authority.
   */
  writeOnly?: boolean;

  /**
   *  The instance value of the schema should not be used and the schema may be removed in the future.
   */
  deprecated?: boolean;
}

/**
 * Base schema type.
 */
export type BaseSchema<TInput = any, TOutput = TInput> = {
  /**
   * Whether it's async.
   */
  async: false;
  /**
   * Schema metadata.
   */
  metadata?: SchemaMetadata;
  /**
   * Parses unknown input based on its schema.
   *
   * @param input The input to be parsed.
   * @param info The parse info.
   *
   * @returns The parse result.
   *
   * @internal
   */
  _parse(input: unknown, info?: ParseInfo): SchemaResult<TOutput>;
  /**
   * Input and output type.
   *
   * @internal
   */
  _types?: { input: TInput; output: TOutput };
};

/**
 * Base schema async type.
 */
export type BaseSchemaAsync<TInput = any, TOutput = TInput> = {
  /**
   * Whether it's async.
   */
  async: true;
  /**
   * Schema metadata.
   */
  metadata?: SchemaMetadata;
  /**
   * Parses unknown input based on its schema.
   *
   * @param input The input to be parsed.
   * @param info The parse info.
   *
   * @returns The parse result.
   *
   * @internal
   */
  _parse(input: unknown, info?: ParseInfo): Promise<SchemaResult<TOutput>>;
  /**
   * Input and output type.
   *
   * @internal
   */
  _types?: { input: TInput; output: TOutput };
};

/**
 * Input inference type.
 */
export type Input<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['_types']
>['input'];

/**
 * Output inference type.
 */
export type Output<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['_types']
>['output'];
