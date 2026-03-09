import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useClubStats from '../useClubStats';
import type { Media } from '../../types/media.types';

vi.mock('../useAnilistHomeMedia', () => ({
    default: vi.fn(),
}));

import useAnilistHomeMedia from '../useAnilistHomeMedia';

const mockUseAnilistHomeMedia = vi.mocked(useAnilistHomeMedia);

function makeMedia(overrides: Partial<Media> = {}): Media {
    return {
        id: 1,
        title: { english: 'Test', romaji: 'Test', native: 'Test', userPreferred: 'Test' },
        coverImage: {},
        studios: {},
        startDate: {},
        type: 'ANIME',
        media_club_status: 'completed',
        media_club_date_started: undefined,
        media_club_date_finished: undefined,
        ...overrides,
    };
}

function mockMediaList(mediaList: Media[] | undefined, extra = {}) {
    mockUseAnilistHomeMedia.mockReturnValue({
        mediaList,
        mediaListIsLoading: false,
        anilistRateLimitError: null,
        refetchAnilist: vi.fn(),
        ...extra,
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useClubStats – type counts', () => {
    it('counts anime and manga separately', () => {
        mockMediaList([
            makeMedia({ id: 1, type: 'ANIME' }),
            makeMedia({ id: 2, type: 'ANIME' }),
            makeMedia({ id: 3, type: 'MANGA' }),
        ]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.animeCount).toBe(2);
        expect(result.current.mangaCount).toBe(1);
    });

    it('returns zero counts for an empty media list', () => {
        mockMediaList([]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.animeCount).toBe(0);
        expect(result.current.mangaCount).toBe(0);
    });

    it('returns zero counts when mediaList is undefined', () => {
        mockMediaList(undefined);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.animeCount).toBe(0);
        expect(result.current.mangaCount).toBe(0);
    });
});

describe('useClubStats – status counts', () => {
    it('counts completed and watching items', () => {
        mockMediaList([
            makeMedia({ id: 1, media_club_status: 'completed' }),
            makeMedia({ id: 2, media_club_status: 'watching' }),
            makeMedia({ id: 3, media_club_status: 'completed' }),
        ]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.completedCount).toBe(2);
        expect(result.current.watchingCount).toBe(1);
    });
});

describe('useClubStats – timeline', () => {
    it('sorts media by start date descending (most recent first)', () => {
        mockMediaList([
            makeMedia({ id: 1, media_club_date_started: new Date('2023-01-01') }),
            makeMedia({ id: 2, media_club_date_started: new Date('2024-01-01') }),
            makeMedia({ id: 3, media_club_date_started: new Date('2022-01-01') }),
        ]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.timeline.map(m => m.id)).toEqual([2, 1, 3]);
    });

    it('places media without a start date at the end of the timeline', () => {
        mockMediaList([
            makeMedia({ id: 1, media_club_date_started: undefined }),
            makeMedia({ id: 2, media_club_date_started: new Date('2024-01-01') }),
        ]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.timeline[0].id).toBe(2);
        expect(result.current.timeline[1].id).toBe(1);
    });

    it('keeps two undated items in stable relative order', () => {
        mockMediaList([
            makeMedia({ id: 1, media_club_date_started: undefined }),
            makeMedia({ id: 2, media_club_date_started: undefined }),
        ]);

        const { result } = renderHook(() => useClubStats());
        // Both have no date; neither should be reordered relative to each other
        expect(result.current.timeline.map(m => m.id)).toEqual([1, 2]);
    });

    it('returns an empty array when mediaList is undefined', () => {
        mockMediaList(undefined);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.timeline).toEqual([]);
    });
});

describe('useClubStats – scoreRankings', () => {
    it('ranks media by averageScore descending', () => {
        mockMediaList([
            makeMedia({ id: 1, averageScore: 75 }),
            makeMedia({ id: 2, averageScore: 90 }),
            makeMedia({ id: 3, averageScore: 60 }),
        ]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.scoreRankings.map(m => m.id)).toEqual([2, 1, 3]);
    });

    it('excludes media with no averageScore', () => {
        mockMediaList([
            makeMedia({ id: 1, averageScore: 80 }),
            makeMedia({ id: 2, averageScore: undefined }),
        ]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.scoreRankings.length).toBe(1);
        expect(result.current.scoreRankings[0].id).toBe(1);
    });

    it('returns an empty array when mediaList is undefined', () => {
        mockMediaList(undefined);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.scoreRankings).toEqual([]);
    });
});

describe('useClubStats – genreFrequency', () => {
    it('counts genre occurrences across all media and sorts by frequency', () => {
        mockMediaList([
            makeMedia({ id: 1, genres: ['Action', 'Drama'] }),
            makeMedia({ id: 2, genres: ['Action', 'Comedy'] }),
            makeMedia({ id: 3, genres: ['Drama'] }),
        ]);

        const { result } = renderHook(() => useClubStats());
        const freqs = result.current.genreFrequency;

        // Action and Drama both appear twice, Comedy once
        const actionEntry = freqs.find(f => f.genre === 'Action');
        const dramaEntry = freqs.find(f => f.genre === 'Drama');
        const comedyEntry = freqs.find(f => f.genre === 'Comedy');

        expect(actionEntry?.count).toBe(2);
        expect(dramaEntry?.count).toBe(2);
        expect(comedyEntry?.count).toBe(1);

        // The single-count genre should appear after the two-count genres
        const comedyIndex = freqs.findIndex(f => f.genre === 'Comedy');
        expect(comedyIndex).toBeGreaterThan(freqs.findIndex(f => f.genre === 'Action'));
    });

    it('returns an empty array when media have no genres', () => {
        mockMediaList([
            makeMedia({ id: 1, genres: undefined }),
            makeMedia({ id: 2, genres: [] }),
        ]);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.genreFrequency).toEqual([]);
    });

    it('returns an empty array when mediaList is undefined', () => {
        mockMediaList(undefined);

        const { result } = renderHook(() => useClubStats());
        expect(result.current.genreFrequency).toEqual([]);
    });
});

describe('useClubStats – loading and error states', () => {
    it('forwards the isLoading flag from useAnilistHomeMedia', () => {
        mockMediaList(undefined, { mediaListIsLoading: true });

        const { result } = renderHook(() => useClubStats());
        expect(result.current.isLoading).toBe(true);
    });

    it('forwards the anilistRateLimitError from useAnilistHomeMedia', () => {
        const rateLimitError = { isRateLimited: true as const, retryAfterSeconds: 30 };
        mockMediaList(undefined, { anilistRateLimitError: rateLimitError });

        const { result } = renderHook(() => useClubStats());
        expect(result.current.anilistRateLimitError).toEqual(rateLimitError);
    });
});
