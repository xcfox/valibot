import * as v from 'valibot';
import { describe, expect, test, vi } from 'vitest';
import { convertSchema } from './convertSchema.ts';
import { createContext } from './vitest/index.ts';

console.warn = vi.fn();

describe('convertSchema', () => {
  describe('definitions', () => {
    test('should convert schema using definitions', () => {
      const schema = v.string();
      expect(
        convertSchema(
          {},
          schema,
          undefined,
          createContext({
            definitions: { foo: { type: 'string' } },
            referenceMap: new Map().set(schema, 'foo'),
          })
        )
      ).toStrictEqual({
        $ref: '#/$defs/foo',
      });
    });
  });

  describe('schema with pipe', () => {
    test('should convert pipe items', () => {
      expect(
        convertSchema(
          {},
          v.pipe(v.string(), v.email(), v.description('foo')),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'string',
        format: 'email',
        description: 'foo',
      });
    });

    test('should convert pipe schema in definitions', () => {
      const schema = v.string();
      expect(
        convertSchema(
          {},
          v.pipe(schema, v.email(), v.description('foo')),
          undefined,
          createContext({
            definitions: { foo: { type: 'string' } },
            referenceMap: new Map().set(schema, 'foo'),
          })
        )
      ).toStrictEqual({
        type: 'string',
        format: 'email',
        description: 'foo',
      });
    });

    test('should throw error for multiple schemas in pipe', () => {
      expect(() =>
        convertSchema(
          {},
          v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
          undefined,
          createContext()
        )
      ).toThrowError(
        'A "pipe" with multiple schemas cannot be converted to JSON Schema.'
      );
    });

    test('should force convertion for multiple schemas in pipe', () => {
      expect(
        convertSchema(
          {},
          v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
          { force: true },
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        type: 'string',
        description: 'foo',
      });
      expect(console.warn).toHaveBeenLastCalledWith(
        'A "pipe" with multiple schemas cannot be converted to JSON Schema.'
      );
    });
  });

  describe('primitive schemas', () => {
    test('should convert boolean schema', () => {
      expect(
        convertSchema({}, v.boolean(), undefined, createContext())
      ).toStrictEqual({
        type: 'boolean',
      });
    });

    test('should convert null schema', () => {
      expect(
        convertSchema({}, v.null(), undefined, createContext())
      ).toStrictEqual({
        type: 'null',
      });
    });

    test('should convert number schema', () => {
      expect(
        convertSchema({}, v.number(), undefined, createContext())
      ).toStrictEqual({
        type: 'number',
      });
    });

    test('should convert string schema', () => {
      expect(
        convertSchema({}, v.string(), undefined, createContext())
      ).toStrictEqual({
        type: 'string',
      });
    });
  });

  describe('complex schemas', () => {
    test('should convert array schema', () => {
      expect(
        convertSchema({}, v.array(v.number()), undefined, createContext())
      ).toStrictEqual({
        type: 'array',
        items: { type: 'number' },
      });
    });

    test('should convert tuple schema', () => {
      expect(
        convertSchema(
          {},
          v.tuple([v.number(), v.string()]),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: false,
      });
    });

    test('should convert tuple with rest schema', () => {
      expect(
        convertSchema(
          {},
          v.tupleWithRest([v.number(), v.string()], v.boolean()),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: { type: 'boolean' },
      });
    });

    test('should convert loose tuple schema', () => {
      expect(
        convertSchema(
          {},
          v.looseTuple([v.number(), v.string()]),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: true,
      });
    });

    test('should convert strict tuple schema', () => {
      expect(
        convertSchema(
          {},
          v.strictTuple([v.number(), v.string()]),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: false,
      });
    });

    test('should convert object schema', () => {
      expect(
        convertSchema(
          {},
          v.object({
            key1: v.string(),
            key2: v.optional(v.string()),
            key3: v.number(),
            key4: v.nullish(v.number()),
          }),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: false,
      });
    });

    test('should convert object with rest schema', () => {
      expect(
        convertSchema(
          {},
          v.objectWithRest(
            {
              key1: v.string(),
              key2: v.optional(v.string()),
              key3: v.number(),
              key4: v.nullish(v.number()),
            },
            v.number()
          ),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: { type: 'number' },
      });
    });

    test('should convert loose object schema', () => {
      expect(
        convertSchema(
          {},
          v.looseObject({
            key1: v.string(),
            key2: v.optional(v.string()),
            key3: v.number(),
            key4: v.nullish(v.number()),
          }),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: true,
      });
    });

    test('should convert strict object schema', () => {
      expect(
        convertSchema(
          {},
          v.strictObject({
            key1: v.string(),
            key2: v.optional(v.string()),
            key3: v.number(),
            key4: v.nullish(v.number()),
          }),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: false,
      });
    });

    test('should convert record schema', () => {
      expect(
        convertSchema(
          {},
          v.record(v.string(), v.number()),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        additionalProperties: { type: 'number' },
      });
    });

    test('should throw error for record schema with pipe in key', () => {
      expect(() =>
        convertSchema(
          {},
          v.record(v.pipe(v.string(), v.email()), v.number()),
          undefined,
          createContext()
        )
      ).toThrowError(
        'The "record" schema with a schema for the key that contains a "pipe" cannot be converted to JSON Schema.'
      );
    });

    test('should force convertion for record schema with pipe in key schema', () => {
      expect(
        convertSchema(
          {},
          v.record(v.pipe(v.string(), v.email()), v.number()),
          { force: true },
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        additionalProperties: { type: 'number' },
      });
      expect(console.warn).toHaveBeenLastCalledWith(
        'The "record" schema with a schema for the key that contains a "pipe" cannot be converted to JSON Schema.'
      );
    });

    test('should throw error for record schema with non-string schema key', () => {
      expect(() =>
        convertSchema(
          {},
          // @ts-expect-error
          v.record(v.number(), v.number()),
          undefined,
          createContext()
        )
      ).toThrowError(
        'The "record" schema with the "number" schema for the key cannot be converted to JSON Schema.'
      );
    });
  });

  describe('special schemas', () => {
    test('should convert any schema', () => {
      expect(
        convertSchema({}, v.any(), undefined, createContext())
      ).toStrictEqual({});
    });

    test('should convert unknown schema', () => {
      expect(
        convertSchema({}, v.unknown(), undefined, createContext())
      ).toStrictEqual({});
    });

    test('should convert nullable schema without default', () => {
      expect(
        convertSchema({}, v.nullable(v.string()), undefined, createContext())
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
      });
    });

    test('should convert nullable schema with default', () => {
      expect(
        convertSchema(
          {},
          v.nullable(v.string(), 'foo'),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
      expect(
        convertSchema(
          {},
          v.nullable(v.string(), () => 'foo'),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
    });

    test('should convert nullish schema without default', () => {
      expect(
        convertSchema({}, v.nullish(v.string()), undefined, createContext())
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
      });
    });

    test('should convert nullish schema with default', () => {
      expect(
        convertSchema(
          {},
          v.nullish(v.string(), 'foo'),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
      expect(
        convertSchema(
          {},
          v.nullable(v.string(), () => 'foo'),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
    });

    test('should convert optional schema without default', () => {
      expect(
        convertSchema({}, v.optional(v.string()), undefined, createContext())
      ).toStrictEqual({
        type: 'string',
      });
    });

    test('should convert optional schema with default', () => {
      expect(
        convertSchema(
          {},
          v.optional(v.string(), 'foo'),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'string',
        default: 'foo',
      });
      expect(
        convertSchema(
          {},
          v.optional(v.string(), () => 'foo'),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        type: 'string',
        default: 'foo',
      });
    });

    test('should convert supported literal schema', () => {
      expect(
        convertSchema({}, v.literal(true), undefined, createContext())
      ).toStrictEqual({
        const: true,
      });
      expect(
        convertSchema({}, v.literal(123), undefined, createContext())
      ).toStrictEqual({
        const: 123,
      });
      expect(
        convertSchema({}, v.literal('foo'), undefined, createContext())
      ).toStrictEqual({
        const: 'foo',
      });
    });

    test('should throw error for unsupported literal schema', () => {
      expect(() =>
        convertSchema({}, v.literal(123n), undefined, createContext())
      ).toThrowError(
        'The value of the "literal" schema is not JSON compatible.'
      );
      expect(() =>
        convertSchema({}, v.literal(Symbol('foo')), undefined, createContext())
      ).toThrowError(
        'The value of the "literal" schema is not JSON compatible.'
      );
    });

    test('should force conversion for unsupported literal schema', () => {
      expect(
        convertSchema({}, v.literal(123n), { force: true }, createContext())
      ).toStrictEqual({
        const: 123n,
      });
      expect(console.warn).toHaveBeenLastCalledWith(
        'The value of the "literal" schema is not JSON compatible.'
      );
      const symbol = Symbol('foo');
      expect(
        convertSchema({}, v.literal(symbol), { force: true }, createContext())
      ).toStrictEqual({
        const: symbol,
      });
      expect(console.warn).toHaveBeenLastCalledWith(
        'The value of the "literal" schema is not JSON compatible.'
      );
    });

    test('should convert enum schema', () => {
      enum TestEnum {
        KEY1,
        KEY2,
        KEY3 = 'foo',
        KEY4 = 123,
      }
      expect(
        convertSchema(
          {},
          // @ts-expect-error
          v.enum(TestEnum),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        enum: [0, 1, 'foo', 123],
      });
    });

    test('should convert supported picklist schema', () => {
      expect(
        convertSchema(
          {},
          v.picklist(['foo', 123, 'bar', 456]),
          { force: false },
          createContext()
        )
      ).toStrictEqual({ enum: ['foo', 123, 'bar', 456] });
    });

    test('should throw error for unsupported picklist schema', () => {
      expect(() =>
        convertSchema({}, v.picklist([123n, 456n]), undefined, createContext())
      ).toThrowError(
        'An option of the "picklist" schema is not JSON compatible.'
      );
    });

    test('should force conversion for unsupported picklist schema', () => {
      expect(
        convertSchema(
          {},
          v.picklist([123n, 456n]),
          { force: true },
          createContext()
        )
      ).toStrictEqual({ enum: [123n, 456n] });
      expect(console.warn).toHaveBeenLastCalledWith(
        'An option of the "picklist" schema is not JSON compatible.'
      );
    });

    test('should convert union schema', () => {
      expect(
        convertSchema(
          {},
          v.union([v.string(), v.boolean()]),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'boolean' }],
      });
    });

    test('should convert variant schema', () => {
      expect(
        convertSchema(
          {},
          v.variant('type', [
            v.object({ type: v.literal('foo'), foo: v.string() }),
            v.object({ type: v.literal('bar'), bar: v.number() }),
          ]),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        anyOf: [
          {
            type: 'object',
            properties: {
              type: { const: 'foo' },
              foo: { type: 'string' },
            },
            required: ['type', 'foo'],
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              type: { const: 'bar' },
              bar: { type: 'number' },
            },
            required: ['type', 'bar'],
            additionalProperties: false,
          },
        ],
      });
    });

    test('should convert intersect schema', () => {
      expect(
        convertSchema(
          {},
          v.intersect([
            v.object({ foo: v.string() }),
            v.object({ bar: v.number() }),
          ]),
          undefined,
          createContext()
        )
      ).toStrictEqual({
        allOf: [
          {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
            required: ['foo'],
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              bar: { type: 'number' },
            },
            required: ['bar'],
            additionalProperties: false,
          },
        ],
      });
    });

    test('should convert simple lazy schema without definitions', () => {
      const stringSchema = v.string();
      const lazyGetter = () => stringSchema;
      const context = createContext();
      expect(
        convertSchema({}, v.lazy(lazyGetter), undefined, context)
      ).toStrictEqual({ $ref: '#/$defs/0' });
      expect(context).toStrictEqual({
        definitions: { '0': { type: 'string' } },
        referenceMap: new Map().set(stringSchema, '0'),
        getterMap: new Map().set(lazyGetter, stringSchema),
      });
    });

    test('should convert simple lazy schema with definitions', () => {
      const stringSchema = v.string();
      const lazyGetter = () => stringSchema;
      const context = createContext({
        definitions: { testSchema: { type: 'string' } },
        referenceMap: new Map().set(stringSchema, 'stringSchema'),
      });
      expect(
        convertSchema(
          {},
          v.lazy(lazyGetter),
          { definitions: { stringSchema } },
          context
        )
      ).toStrictEqual({ $ref: '#/$defs/stringSchema' });
      expect(context).toStrictEqual({
        definitions: { testSchema: { type: 'string' } },
        referenceMap: new Map().set(stringSchema, 'stringSchema'),
        getterMap: new Map().set(lazyGetter, stringSchema),
      });
    });

    test('should convert recursive lazy schema with static getter', () => {
      // Returns a static reference that never changes
      const lazyGetter = () => nodeSchema;
      const nodeSchema: v.GenericSchema = v.object({
        node: v.optional(v.lazy(lazyGetter)),
      });
      const context = createContext();
      expect(
        convertSchema(
          {},
          // @ts-expect-error
          nodeSchema,
          undefined,
          context
        )
      ).toStrictEqual({
        type: 'object',
        properties: { node: { $ref: '#/$defs/1' } },
        required: [],
        additionalProperties: false,
      });
      expect(context).toStrictEqual({
        definitions: {
          '1': {
            type: 'object',
            properties: { node: { $ref: '#/$defs/1' } },
            required: [],
            additionalProperties: false,
          },
        },
        referenceMap: new Map().set(nodeSchema, '1'),
        getterMap: new Map().set(lazyGetter, nodeSchema),
      });
    });

    test('should convert recursive lazy schema with dynamic getter', () => {
      // Returns a dynamic reference that always changes
      const lazyGetter = () => v.nullable(nodeSchema);
      const nodeSchema: v.GenericSchema = v.object({
        node: v.lazy(lazyGetter),
      });
      const context = createContext();
      expect(
        convertSchema(
          {},
          // @ts-expect-error
          nodeSchema,
          undefined,
          context
        )
      ).toStrictEqual({
        type: 'object',
        properties: { node: { $ref: '#/$defs/2' } },
        required: ['node'],
        additionalProperties: false,
      });
      expect(context).toStrictEqual({
        definitions: {
          '2': {
            anyOf: [
              {
                type: 'object',
                properties: { node: { $ref: '#/$defs/2' } },
                required: ['node'],
                additionalProperties: false,
              },
              { type: 'null' },
            ],
          },
        },
        referenceMap: new Map().set(expect.any(Object), '2'),
        getterMap: new Map().set(lazyGetter, expect.any(Object)),
      });
    });
  });

  describe('other schemas', () => {
    test('should throw error for unsupported file schema', () => {
      expect(() =>
        // @ts-expect-error
        convertSchema({}, v.file(), undefined, createContext())
      ).toThrowError('The "file" schema cannot be converted to JSON Schema.');
    });

    test('should force conversion for unsupported file schema', () => {
      expect(
        // @ts-expect-error
        convertSchema({}, v.file(), { force: true }, createContext())
      ).toStrictEqual({});
      expect(console.warn).toHaveBeenLastCalledWith(
        'The "file" schema cannot be converted to JSON Schema.'
      );
    });
  });
});