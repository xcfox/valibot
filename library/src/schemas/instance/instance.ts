import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';
import type { Class } from './types.ts';

/**
 * Instance schema type.
 */
export type InstanceSchema<
  TClass extends Class,
  TOutput = InstanceType<TClass>
> = BaseSchema<InstanceType<TClass>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'instance';
  /**
   * The class of the instance.
   */
  class: TClass;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<InstanceType<TClass>> | undefined;
};

/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  class_: TClass,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  class_: TClass,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

export function instance<TClass extends Class>(
  class_: TClass,
  arg2?: Pipe<InstanceType<TClass>> | ErrorMessageOrMetadata,
  arg3?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'instance',
    async: false,
    class: class_,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof this.class)) {
        return schemaIssue(info, 'type', 'instance', this.message, input);
      }

      // Execute pipe and return result
      return pipeResult(input, this.pipe, info, 'instance');
    },
  };
}
