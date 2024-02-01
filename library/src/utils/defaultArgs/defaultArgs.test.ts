import { describe, expect, test } from 'vitest';
import { defaultArgs } from './defaultArgs.ts';

describe('defaultArgs', () => {
  test('should return error, pipe and metadata', () => {
    expect(defaultArgs(undefined, undefined, undefined)).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(defaultArgs('error', undefined, undefined)).toEqual([
      'error',
      undefined,
      undefined,
    ]);
    expect(defaultArgs([], undefined, undefined)).toEqual([
      undefined,
      [],
      undefined,
    ]);

    expect(defaultArgs({}, undefined, undefined)).toEqual([
      undefined,
      undefined,
      {},
    ]);
    expect(defaultArgs([], {}, undefined)).toEqual([undefined, [], {}]);
    expect(defaultArgs('error', undefined, undefined)).toEqual([
      'error',
      undefined,
      undefined,
    ]);
    expect(defaultArgs('error', [], undefined)).toEqual([
      'error',
      [],
      undefined,
    ]);
    expect(defaultArgs('error', [], {})).toEqual(['error', [], {}]);
  });
});
