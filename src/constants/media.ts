import type { Media } from "../types/media.types";

export const MEDIA: Media[] = [
    /** Bokurano */
    {
        id: 1690,
        dateStarted: new Date(2022, 9, 15), // October 15th, 2022
        dateFinished: undefined,
        status: 'completed',
    },
    /** The Pet Girl of Sakurasou */
    {
        id: 13759, 
        dateStarted: new Date(2023, 2, 25), // March 25th, 2023
        dateFinished: undefined,
        status: 'completed',
    },
    /** Somali and the Forest Spirit */
    {
        id: 108617,
        dateStarted: new Date(2023, 7, 2), // August 2nd, 2023
        dateFinished: undefined,
        status: 'completed',
    },
    /** Ya Boy Kongming */
    {
        id: 141774,
        dateStarted: new Date(2023, 9, 30), // October 30th, 2023
        dateFinished: undefined,
        status: 'completed',
    },
    /** Tari Tari */
    {
        id: 13333,
        dateStarted: new Date(2024, 0, 30), // January 30th, 2024
        dateFinished: undefined,
        status: 'completed',
    },
    /** Baccano! */
    {
        id: 2251,
        dateStarted: new Date(2024, 3, 14), // April 14th, 2024
        dateFinished: undefined,
        status: 'completed',
    },
    /** Insomniacs After School */
    {
        id: 143653,
        dateStarted: new Date(2024, 10, 23), // November 23rd, 2024
        dateFinished: undefined,
        status: 'completed',
    },
    /** SK8 The Infinity */
    {
        id: 124153,
        dateStarted: new Date(2025, 7, 31), // August 31st, 2025
        dateFinished: undefined,
        status: 'watching',
    }
];

export const MEDIA_TOTAL: number = MEDIA.length;