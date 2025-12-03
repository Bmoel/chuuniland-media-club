import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAGS } from './tags';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery(),
    endpoints: () => ({}),
    tagTypes: TAGS,
});