import { describe, it, expect } from 'vitest';
import useDateFormat from '../useDateFormat';

describe('useDateFormat', () => {
    const format = useDateFormat();

    it('formats a 1st with "st" suffix', () => {
        expect(format(new Date('2024-01-01T00:00:00Z'))).toBe('January 1st, 2024');
    });

    it('formats a 2nd with "nd" suffix', () => {
        expect(format(new Date('2024-01-02T00:00:00Z'))).toBe('January 2nd, 2024');
    });

    it('formats a 3rd with "rd" suffix', () => {
        expect(format(new Date('2024-01-03T00:00:00Z'))).toBe('January 3rd, 2024');
    });

    it('formats a 4th with "th" suffix', () => {
        expect(format(new Date('2024-01-04T00:00:00Z'))).toBe('January 4th, 2024');
    });

    it('formats 11th with "th" (teen exception)', () => {
        expect(format(new Date('2024-01-11T00:00:00Z'))).toBe('January 11th, 2024');
    });

    it('formats 12th with "th" (teen exception)', () => {
        expect(format(new Date('2024-01-12T00:00:00Z'))).toBe('January 12th, 2024');
    });

    it('formats 13th with "th" (teen exception)', () => {
        expect(format(new Date('2024-01-13T00:00:00Z'))).toBe('January 13th, 2024');
    });

    it('formats 21st with "st" suffix', () => {
        expect(format(new Date('2024-01-21T00:00:00Z'))).toBe('January 21st, 2024');
    });

    it('formats 22nd with "nd" suffix', () => {
        expect(format(new Date('2024-01-22T00:00:00Z'))).toBe('January 22nd, 2024');
    });

    it('formats 31st with "st" suffix', () => {
        expect(format(new Date('2024-01-31T00:00:00Z'))).toBe('January 31st, 2024');
    });

    it('uses UTC date to avoid timezone shift', () => {
        // Midnight UTC on Jan 1 should display as January, not December
        const date = new Date('2024-01-01T00:00:00Z');
        expect(format(date)).toContain('January');
    });

    it('formats a date in a non-January month', () => {
        expect(format(new Date('2023-07-04T00:00:00Z'))).toBe('July 4th, 2023');
    });
});
