import { GetToken } from '@/utils/axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface ILoginRequest {
    email: string;
    password: string;
}

interface ILoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

interface IGetRegions {
    name: string,
    id: number,
    created_at: string
}

export const Todo = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://student4.softclub.tj/api/v1/',
        prepareHeaders: (headers) => {
            const token = GetToken();
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Todo'],
    endpoints: (builder) => ({
        LoginUser: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
                url: `auth/login`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Todo'],
        }),
        GetRegions: builder.query<IGetRegions[], void>({
            query: () => ({
                url: `territories/regions`,
                method: 'GET',
            }),
            providesTags: ['Todo'],
        }),
    }),
})

export const { useLoginUserMutation, useGetRegionsQuery } = Todo