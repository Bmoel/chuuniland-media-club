import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import usePreferredMediaName from '../usePreferredMediaName';

describe('usePreferredMediaName', () => {
    it('returns the english title when all titles are provided', () => {
        const { result } = renderHook(() => usePreferredMediaName());
        expect(result.current({
            english: 'English Title',
            userPreferred: 'User Title',
            romaji: 'Romaji Title',
            native: 'Native Title',
        })).toBe('English Title');
    });

    it('falls back to userPreferred when english is absent', () => {
        const { result } = renderHook(() => usePreferredMediaName());
        expect(result.current({
            userPreferred: 'User Title',
            romaji: 'Romaji Title',
            native: 'Native Title',
        })).toBe('User Title');
    });

    it('falls back to romaji when english and userPreferred are absent', () => {
        const { result } = renderHook(() => usePreferredMediaName());
        expect(result.current({
            romaji: 'Romaji Title',
            native: 'Native Title',
        })).toBe('Romaji Title');
    });

    it('falls back to native when only native is provided', () => {
        const { result } = renderHook(() => usePreferredMediaName());
        expect(result.current({ native: 'Native Title' })).toBe('Native Title');
    });

    it('returns an empty string when all titles are absent', () => {
        const { result } = renderHook(() => usePreferredMediaName());
        expect(result.current({})).toBe('');
    });

    it('ignores undefined english and falls back correctly', () => {
        const { result } = renderHook(() => usePreferredMediaName());
        expect(result.current({
            english: undefined,
            userPreferred: 'User Title',
        })).toBe('User Title');
    });
});
