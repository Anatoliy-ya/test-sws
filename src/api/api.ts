import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DataRowProps } from '../types/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://185.244.172.108:8081/' }),
  endpoints: (builder) => ({
    createEntity: builder.mutation<{ id: number; rowName: string }, void>({
      query: () => ({
        url: 'v1/outlay-rows/entity/create',
        method: 'POST',
      }),
    }),
    createRow: builder.mutation<
      DataRowProps,
      { eID: number; row: Omit<DataRowProps, 'id' | 'child' | 'total'> }
    >({
      query: ({ eID, row }) => ({
        url: `v1/outlay-rows/entity/${eID}/row/create`,
        method: 'POST',
        body: row,
      }),
    }),
    getRows: builder.query<DataRowProps[], number>({
      query: (eID) => `v1/outlay-rows/entity/${eID}/row/list`,
    }),
    updateRow: builder.mutation<
      DataRowProps,
      { eID: string; rID: number; data: Omit<DataRowProps, 'id' | 'child' | 'total'> }
    >({
      query: ({ eID, rID, data }) => ({
        url: `v1/outlay-rows/entity/${eID}/row/${rID}/update`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteRow: builder.mutation<{ success: boolean }, { eID: number; rID: number }>({
      query: ({ eID, rID }) => ({
        url: `v1/outlay-rows/entity/${eID}/row/${rID}/delete`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateEntityMutation,
  useCreateRowMutation,
  useGetRowsQuery,
  useUpdateRowMutation,
  useDeleteRowMutation,
} = api;
