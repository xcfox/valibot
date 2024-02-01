import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  Output,
  Pipe,
  SchemaMetadata,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResult,
  schemaIssue,
} from '../../utils/index.ts';
import type { ArrayPathItem } from './types.ts';

/**
 * Array schema type.
 */
export type ArraySchema<
  TItem extends BaseSchema,
  TOutput = Output<TItem>[]
> = BaseSchema<Input<TItem>[], TOutput> & {
  /**
   * The schema type.
   */
  type: 'array';
  /**
   * The array item schema.
   */
  item: TItem;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<Output<TItem>[]> | undefined;
};

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 * @param metadata The schema metadata.
 *
 * @returns A array schema.
 */
export function array<TItem extends BaseSchema>(
  item: TItem,
  pipe?: Pipe<Output<TItem>[]>,
  metadata?: SchemaMetadata<Input<TItem>>
): ArraySchema<TItem>;

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 * @param metadata The schema metadata.
 *
 * @returns A array schema.
 */
export function array<TItem extends BaseSchema>(
  item: TItem,
  message?: ErrorMessage,
  pipe?: Pipe<Output<TItem>[]>,
  metadata?: SchemaMetadata<Input<TItem>>
): ArraySchema<TItem>;

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param metadata The schema metadata.
 *
 * @returns A array schema.
 */
export function array<TItem extends BaseSchema>(
  item: TItem,
  metadata?: SchemaMetadata<Input<TItem>>
): ArraySchema<TItem>;

export function array<TItem extends BaseSchema>(
  item: TItem,
  arg2?: SchemaMetadata<Input<TItem>> | Pipe<Output<TItem>[]> | ErrorMessage,
  arg3?: SchemaMetadata<Input<TItem>> | Pipe<Output<TItem>[]>,
  arg4?: SchemaMetadata<Input<TItem>>
): ArraySchema<TItem> {
  // Get message, pipe argument and metadata
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(
    arg2,
    arg3,
    arg4
  );

  // Create and return array schema
  return {
    type: 'array',
    async: false,
    metadata,
    item,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!Array.isArray(input)) {
        return schemaIssue(info, 'type', 'array', this.message, input);
      }

      // Create typed, issues and output
      let typed = true;
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each array item
      for (let key = 0; key < input.length; key++) {
        const value = input[key];
        const result = this.item._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create array path item
          const pathItem: ArrayPathItem = {
            type: 'array',
            input,
            key,
            value,
          };

          // Add modified result issues to issues
          for (const issue of result.issues) {
            if (issue.path) {
              issue.path.unshift(pathItem);
            } else {
              issue.path = [pathItem];
            }
            issues?.push(issue);
          }
          if (!issues) {
            issues = result.issues;
          }

          // If necessary, abort early
          if (info?.abortEarly) {
            typed = false;
            break;
          }
        }

        // If not typed, set typed to false
        if (!result.typed) {
          typed = false;
        }

        // Set output of item
        output.push(result.output);
      }

      // If output is typed, execute pipe
      if (typed) {
        return pipeResult(
          output as Output<TItem>[],
          this.pipe,
          info,
          'array',
          issues
        );
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}
