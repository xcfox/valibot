import type { BaseMetadata } from '../../types/metadata';

/**
 * WithDescription metadata type.
 */
export interface WithDescriptionAction<TInput, TDescription extends string>
  extends BaseMetadata<TInput> {
  /**
   * The metadata type.
   */
  readonly type: 'withDescription';
  /**
   * The metadata reference.
   */
  readonly reference: typeof withDescription;

  readonly extraProperties: {
    description: TDescription;
  };
}

/**
 * Creates a with description metadata.
 *
 * @param description The description value.
 *
 * @returns A WithDescription metadata.
 */
export function withDescription<TInput, TDescription extends string>(
  description: TDescription
): WithDescriptionAction<TInput, TDescription> {
  return {
    kind: 'metadata',
    type: 'withDescription',
    reference: withDescription,
    extraProperties: {
      description,
    },
  };
}
