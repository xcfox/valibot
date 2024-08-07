import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItems: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TupleItemsAsync',
      href: '../TupleItemsAsync/',
    },
  },
  TRest: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
      ],
    },
  },
  TMessage: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
          generics: [
            {
              type: 'custom',
              name: 'TupleWithRestIssue',
              href: '../TupleWithRestIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  items: {
    type: {
      type: 'custom',
      name: 'TItems',
    },
  },
  rest: {
    type: {
      type: 'custom',
      name: 'TRest',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'TupleWithRestSchemaAsync',
      href: '../TupleWithRestSchemaAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TItems',
        },
        {
          type: 'custom',
          name: 'TRest',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
