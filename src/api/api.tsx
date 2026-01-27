import { GetToken } from '@/utils/axios';
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

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

export interface IGetTextbooks {
    id: number;
    title: string,
    subject: string,
    grade: number,
    author: string,
    publisher: string,
    publication_year: number,
    isbn: string,
    print_price: number,
    rent_value_per_year: number,
    service_life_years: number,
    payback_years: number,
    description: string,
    cover_image_url: string
    created_by: number,
    created_at: string,
    updated_at: string,
    total_copies: number,
    available_copies: number,
    rented_copies: number
}

interface IGetTextbooksResponse {
    items: IGetTextbooks[];
    total: number;
    skip: number;
    limit: number;
}

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://student4.softclub.tj/api/v1/',
    prepareHeaders: (headers) => {
        const token = GetToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: 'auth/refresh',
                    method: 'POST',
                    body: { refresh_token: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const newTokens = refreshResult.data as any;
                localStorage.setItem('access_token', newTokens.access_token);
                if (newTokens.refresh_token) {
                    localStorage.setItem('refresh_token', newTokens.refresh_token);
                }
                result = await baseQuery(args, api, extraOptions);
            } else {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    }
    return result;
};

export const Todo = createApi({
    reducerPath: 'todoApi',
    baseQuery: baseQueryWithReauth,
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
        GetTextbooks: builder.query<IGetTextbooksResponse, string | undefined>({
            query: (subject) => ({
                url: subject && subject !== 'all'
                    ? `textbooks/?subject=${subject}&skip=0&limit=100`
                    : `textbooks/?skip=0&limit=100`,
                method: 'GET',
            }),
            providesTags: ['Todo'],
        }),
    }),
});

export const { useLoginUserMutation, useGetRegionsQuery, useGetTextbooksQuery } = Todo;