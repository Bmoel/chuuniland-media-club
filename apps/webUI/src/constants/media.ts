import type { Media } from "../types/media.types";

/**
 * All keys should stay the same as the ids in each Media object
 * Documenation for object key meanings can be found in media.types.ts
 */
export const MEDIA: {[key: string]: Media} = {
    /** Bokurano */
    1690: {
        id: 1690,
        dateStarted: new Date(2022, 9, 15), // October 15th, 2022
        dateFinished: new Date(2023, 2, 25), // March 25th, 2023
        status: 'completed',
    },
    /** The Pet Girl of Sakurasou */
    13759: {
        id: 13759, 
        dateStarted: new Date(2023, 2, 25), // March 25th, 2023
        dateFinished: new Date(2023, 8, 10), // September 10th, 2023
        status: 'completed',
    },
    /** Somali and the Forest Spirit */
    108617: {
        id: 108617,
        dateStarted: new Date(2023, 7, 2), // August 2nd, 2023
        dateFinished: new Date(2023, 9, 29), // October 29th, 2023
        status: 'completed',
    },
    /** Ya Boy Kongming */
    141774: {
        id: 141774,
        dateStarted: new Date(2023, 9, 30), // October 30th, 2023
        dateFinished: new Date(2024, 0, 14), // January 14th, 2024
        status: 'completed',
    },
    /** Tari Tari */
    13333: {
        id: 13333,
        dateStarted: new Date(2024, 0, 30), // January 30th, 2024
        dateFinished: new Date(2024, 4, 5), // May 5th, 2024
        status: 'completed',
    },
    /** Baccano! */
    2251: {
        id: 2251,
        dateStarted: new Date(2024, 3, 14), // April 14th, 2024
        dateFinished: new Date(2024, 10, 10), // November 10th, 2024
        status: 'completed',
    },
    /** Insomniacs After School */
    143653: {
        id: 143653,
        dateStarted: new Date(2024, 10, 23), // November 23rd, 2024
        dateFinished: new Date(2025, 7, 24), // August 24th, 2025
        status: 'completed',
    },
    /** SK8 The Infinity */
    124153: {
        id: 124153,
        dateStarted: new Date(2025, 7, 31), // August 31st, 2025
        dateFinished: new Date(2025, 11, 14), // December 14th, 2025
        status: 'watching',
    }
};