export type MediaStatus = 'watching' | 'completed';

export type Media = {
    /** Anilist id of anime (used in API calls) */
    id: number,
    
    /** Date anime was selected via voting */
    dateStarted: Date,

    /** Date group finished watching */
    dateFinished: Date | undefined,

    /** Current status of the anime */
    status: MediaStatus,
}