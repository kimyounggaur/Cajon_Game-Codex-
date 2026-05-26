import { describe, expect, it } from 'vitest';
import { RHYTHM_CATALOG } from '../rhythms/rhythmCatalog';
import { createChartFromRhythm } from '../rhythms/rhythmChartFactory';

describe('rhythm catalog', () => {
  it('contains at least 18 unique rhythms', () => {
    const ids = RHYTHM_CATALOG.map((rhythm) => rhythm.meta.id);
    expect(RHYTHM_CATALOG.length).toBeGreaterThanOrEqual(18);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('creates at least one note for every rhythm', () => {
    for (const rhythm of RHYTHM_CATALOG) {
      expect(rhythm.pattern.length).toBeGreaterThan(0);
      expect(createChartFromRhythm(rhythm).notes.length).toBeGreaterThan(0);
    }
  });
});
