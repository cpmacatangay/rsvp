import { describe, expect, it } from 'vitest';

import { maskName } from '~/lib/mask';

describe('maskName', () => {
  it('keeps single-token names verbatim and whole', () => {
    expect(maskName('Maliah')).toBe('Maliah');
  });

  it('masks surname initial: first token + initial', () => {
    expect(maskName('Anna Mustermann')).toBe('Anna M.');
  });

  it('keeps kinship honorifics in display tokens', () => {
    expect(maskName('Tito Rodel')).toBe('Tito R.');
    expect(maskName('Nanang Bing')).toBe('Nanang B.');
  });

  it('handles messy whitespace safely', () => {
    expect(maskName('  Chris  Calzada  ')).toBe('Chris C.');
  });

  it('returns empty string for empty input', () => {
    expect(maskName('   ')).toBe('');
  });
});
