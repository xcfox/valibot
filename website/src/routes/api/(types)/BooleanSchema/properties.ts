import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'boolean',
        {
          type: 'custom',
          name: 'TOutput',
          default: 'boolean',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'boolean',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
  pipe: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pipe',
          href: '../Pipe/',
          generics: ['boolean'],
        },
        'undefined',
      ],
    },
  },
};
