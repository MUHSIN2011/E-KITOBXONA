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
    name: string;
    id: number;
    created_at: string;
}

export interface IGetTextbooks {
    id: number;
    title: string;
    subject: string;
    grade: number;
    author: string;
    publisher: string;
    publication_year: number;
    isbn: string;
    print_price: number;
    rent_value_per_year: number;
    service_life_years: number;
    payback_years: number;
    description: string;
    cover_image_url: string;
    total_copies: number;
    available_copies: number;
    rented_copies: number;
    updated_at: string
}

interface IGetTextbooksResponse {
    items: IGetTextbooks[];
    total: number;
    skip: number;
    limit: number;
}

export interface IGetStudents {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    class_name: string;
    birth_year: number;
    parent_phone: string;
    notes: string;
    school_id: number;
    grade: number;
    is_active: boolean;
    created_at: string;
    active_rentals_count: number;
    total_rentals_count: number | null;
}

interface IGetStudentsResponse {
    items: IGetStudents[];
    total: number;
    skip: number;
    limit: number;
}

interface IGetStudentsParams {
    skip: number;
    limit: number;
    search?: string;
}

export interface IAddNewStudentRequest {
    first_name: string;
    last_name: string;
    middle_name: string;
    class_name: string;
    birth_year: number;
    parent_phone: string;
    school_id: number;
    notes?: string;
}

export interface IRental {
    id: number;
    student_id: number;
    student_name: string;
    textbook_title: string;
    rent_start: string;
    rent_end: string;
    status: 'active' | 'returned';
    inventory_number: string;
}

interface IGetRentalsResponse {
    items: IRental[];
    total: number;
    skip: number;
    limit: number;
}

interface IRentRequest {
    student_id: number;
    textbook_id: number;
    academic_year_id: number;
    notes?: string;
}

interface IAcademicYear {
    id: number;
    name: string;
    is_active: boolean;
}

export interface ITextbookBase {
    id: number;
    title: string;
    subject: string;
    grade: number;
    author: string;
    publisher: string;
    publication_year: number;
    isbn: string;
    print_price: number;
    rent_value_per_year: number;
    service_life_years: number;
    payback_years: number;
    description: string;
    cover_image_url: string;
    created_at: string;
    updated_at: string;
}

export interface IGetbooksSchool {
    id: number;
    textbook_id: number;
    school_id: number;
    inventory_number: string;
    condition: string;
    status: 'available' | 'rented' | 'damaged' | 'lost';
    years_in_use: number;
    accumulated_value: number;
    notes: string | null;
    received_at: string;
    created_at: string;
    updated_at: string;
    textbook: ITextbookBase;
}

export interface IGetbooksSchoolResponse {
    items: IGetbooksSchool[];
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
                window.location.href = '/';
            }
        }
    }
    return result;
};

export const Todo = createApi({
    reducerPath: 'todoApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Todo', 'Textbooks', 'Rentals'],
    endpoints: (builder) => ({
        LoginUser: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
                url: `auth/login`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Todo'],
        }),
        GetStudents: builder.query<IGetStudentsResponse, IGetStudentsParams>({
            query: ({ skip, limit, search }) => {
                let url = `students/?skip=${skip}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                return { url, method: 'GET' };
            },
            providesTags: ['Todo'],
        }),
        AddNewStudent: builder.mutation<any, IAddNewStudentRequest>({
            query: (newStudent) => ({
                url: `students/`,
                method: 'POST',
                body: newStudent,
            }),
            invalidatesTags: ['Todo'],
        }),
        GetTextbooks: builder.query<IGetTextbooksResponse, string | void>({
            query: (subject) => ({
                url: subject && subject !== 'all'
                    ? `textbooks/?subject=${subject}&skip=0&limit=100`
                    : `textbooks/?skip=0&limit=100`,
                method: 'GET',
            }),
            providesTags: ['Todo'],
        }),
        GetRentals: builder.query<IGetRentalsResponse, { skip: number; limit: number }>({
            query: ({ skip, limit }) => `rentals/?skip=${skip}&limit=${limit}`,
            providesTags: ['Todo'],
        }),
        RentTextbook: builder.mutation<any, {
            student_id: number,
            textbook_ids: number[],
            notes?: string 
        }>({
            query: (payload) => ({
                url: 'rentals/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Rentals'],
        }),
        ReturnBook: builder.mutation<any, number>({
            query: (rentalId) => ({
                url: `rentals/${rentalId}/return`,
                method: 'POST',
                body: {},
            }),
            invalidatesTags: ['Todo'],
        }),
        GetRegions: builder.query<IGetRegions[], void>({
            query: () => `territories/regions`,
            providesTags: ['Todo'],
        }),
        GetActiveYear: builder.query<IAcademicYear, void>({
            query: () => `academic-years/active`,
            providesTags: ['Todo'],
        }),
        GetBooksSchool: builder.query<IGetbooksSchoolResponse, {
            subject?: string,
            condition?: string,
            status?: string,
            skip: number,
            limit: number
        }>({
            query: ({ subject, condition, status, skip, limit }) => ({
                url: `copies/`,
                params: {
                    subject: subject !== 'all' ? subject : undefined,
                    condition: condition !== 'all' ? condition : undefined,
                    status_filter: status !== 'all' ? status : undefined,
                    skip,
                    limit
                },
                method: 'GET',
            }),
            providesTags: ['Todo'],
        }),
        GetReportsOverview: builder.query<{
            total_schools: number;
            total_books: number;
            rented_books: number;
            lost_books: number;
            damaged_books: number;
            scope: string;
        }, number | void>({
            query: (yearId) => `reports/overview?academic_year_id=${yearId || 1}`,
            providesTags: ['Todo'],
        }),
        createTextbook: builder.mutation<any, any>({
            query: (newBook) => ({
                url: 'textbooks/',
                method: 'POST',
                body: newBook,
            }),
            invalidatesTags: ['Todo'],
        }),
        addTextbookCopies: builder.mutation<any, { textbook_id: number, school_id: number, quantity: number, condition?: string }>({
            query: (payload) => ({
                url: 'copies/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Todo'],
        }),
        getDistricts: builder.query<any[], number>({
            query: (regionId) => `territories/regions/${regionId}/districts`,
        }),
        getSchoolsByDistrict: builder.query<any[], number>({
            query: (districtId) => `territories/districts/${districtId}/schools`,
        }),
        getOverview: builder.query<any, { academic_year_id: number }>({
            query: ({ academic_year_id }) => `reports/overview?academic_year_id=${academic_year_id}`,
        }),
        getMe: builder.query<any, void>({
            query: () => 'auth/me',
            providesTags: ['Todo'],
        }),
    }),
});

export const {
    useLoginUserMutation,
    useGetRegionsQuery,
    useGetTextbooksQuery,
    useGetStudentsQuery,
    useAddNewStudentMutation,
    useGetRentalsQuery,
    useRentTextbookMutation,
    useReturnBookMutation,
    useGetActiveYearQuery,
    useGetBooksSchoolQuery,
    useGetReportsOverviewQuery,
    useCreateTextbookMutation,
    useAddTextbookCopiesMutation,
    useGetDistrictsQuery,
    useGetSchoolsByDistrictQuery,
    useGetOverviewQuery,
    useGetMeQuery
} = Todo;