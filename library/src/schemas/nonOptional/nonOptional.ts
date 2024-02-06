import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue } from '../../utils/index.ts';
import type { NonOptionalInput, NonOptionalOutput } from './types.ts';

/**
 * Non optional schema type.
 */
export type NonOptionalSchema<
  TWrapped extends BaseSchema,
  TOutput = NonOptionalOutput<TWrapped>
> = BaseSchema<NonOptionalInput<TWrapped>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'non_optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A non optional schema.
 */
export function nonOptional<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  messageOrMetadata?: ErrorMessageOrMetadata
): NonOptionalSchema<TWrapped> {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'non_optional',
    expects: '!undefined',
    async: false,
    wrapped,
    message,
    get metadata() {
      return metadata ?? this.wrapped.metadata;
    },
    _parse(input, config) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return schemaIssue(this, nonOptional, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
