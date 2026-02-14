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
    first_name: string;
    last_name: string;
    middle_name: string;
    class_name: string;
    birth_year: number;
    parent_phone: string;
    notes: string;
    id: number;
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

export interface IRentedBook {
    rental_id: number;
    textbook_title: string;
    inventory_number: string;
    rent_start: string;
    status: 'active' | 'returned';
}

export interface IRental {
    student_id: number;
    student_name: string;
    class_name: string;
    total_books_taken: number;
    rented_books: IRentedBook[];
}

export interface IGetRentalsResponse {
    items: IRental[];
    total: number;
    skip: number;
    limit: number;
}

interface IGetRentalsParams {
    skip?: number;
    grade?: number;
    limit?: number;
    student_id?: number | null;
    academic_year_id?: number | null;
    status_filter?: string | null;
    date_from?: string | null;
    date_to?: string | null;
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

export interface IStudentDetail {
    id: number;
    school_id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    class_name: string;
    grade: number;
    birth_year: number;
    parent_phone: string;
    notes: string;
    is_active: boolean;
    active_rentals_count: number;
    total_rentals_count: number | null;
    created_at: string;
}

export interface IUpdateStudentRequest extends Partial<IAddNewStudentRequest> {
    id: number;
    is_active?: boolean;
}

export interface ICreateTextbookRequest {
    title: string;
    subject_id: number;
    grade: number;
    author: string;
    publisher: string;
    publication_year: number;
    isbn: string;
    print_price: number;
    rent_value_per_year: number;
    service_life_years: number;
    payback_years: number;
    description: string;      // Майдони ҳатмӣ ё холӣ ("")
    cover_image_url?: string; // Агар илова кардан хоҳед
}

export interface IYearSummary {
    year_id: number;
    year_name: string;
    is_active: boolean;
    total_students: number;
    total_rentals: number;
    active_rentals: number;
    returned_rentals: number;
    lost_books: number;
    damaged_books: number;
    return_rate: number;
    avg_books_per_student: number;
    total_rental_income: number;
}
interface ISubject {
    id: number;
    name: string;
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
                const newTokens = refreshResult.data as ILoginResponse;
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
    tagTypes: ['Todo', 'Textbooks', 'Rentals', 'Region', 'District', 'School', 'Copies', 'Budget', 'Students', 'Supplies'],
    endpoints: (builder) => ({
        LoginUser: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
                url: `auth/login`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Todo'],
        }),
        GetStudents: builder.query<IGetStudentsResponse, IGetStudentsParams | void>({
            query: (params) => ({
                url: `students/`,
                method: 'GET',
                params: {
                    skip: params?.skip ?? 0,
                    limit: params?.limit ?? 100,
                    search: params?.search
                }
            }),
            providesTags: ['Students'],
        }),
        GetStudentById: builder.query<IStudentDetail, number>({
            query: (id) => ({
                url: `students/${id}`,
                method: 'GET'
            }),
            providesTags: (_result, _error, id) => [{ type: 'Students', id }],
        }),
        AddNewStudent: builder.mutation<any, IAddNewStudentRequest>({
            query: (newStudent) => ({
                url: `students/`,
                method: 'POST',
                body: newStudent,
            }),
            invalidatesTags: ['Students'],
        }),
        GetTextbooks: builder.query<IGetTextbooksResponse, string | void>({
            query: (subject) => ({
                url: `textbooks/`,
                method: 'GET',
                params: {
                    subject_id: subject && subject !== 'all' ? subject : undefined,
                    skip: 0,
                    limit: 100
                }
            }),
            providesTags: (result, error, subject) => [
                { type: 'Textbooks', id: subject || 'ALL' },
                ...(result?.items?.map(item => ({ type: 'Textbooks' as const, id: item.id })) || [])
            ],
        }),
        GetRentals: builder.query<IGetRentalsResponse, IGetRentalsParams>({
            query: (params) => ({
                url: `rentals/`,
                method: 'GET',
                params: params,
            }),
            providesTags: ['Rentals'],
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
            invalidatesTags: ['Rentals', 'Students'],
        }),
        ReturnBook: builder.mutation<any, number>({
            query: (rentalId) => ({
                url: `rentals/${rentalId}/return`,
                method: 'POST',
                body: {},
            }),
            invalidatesTags: ['Rentals', 'Students'],
        }),
        GetRegions: builder.query<IGetRegions[], void>({
            query: () => `territories/regions`,
            providesTags: ['Region'],
        }),
        GetActiveYear: builder.query<IAcademicYear, void>({
            query: () => `academic-years/active`,
            providesTags: ['Todo'],
        }),
        GetBooksSchool: builder.query<IGetbooksSchoolResponse, {
            textbook_id?: number,
            subject?: string,
            condition?: string,
            status?: string,
            skip: number,
            limit: number
        }>({
            query: ({ textbook_id, subject, condition, status, skip, limit }) => ({
                url: `copies/`,
                params: {
                    textbook_id,
                    subject: subject !== 'all' ? subject : undefined,
                    condition: condition !== 'all' ? condition : undefined,
                    status_filter: status !== 'all' ? status : undefined,
                    skip,
                    limit
                },
                method: 'GET',
            }),
            providesTags: ['Copies'],
        }),
        GetReportsOverview: builder.query<{
            total_schools: number;
            total_books: number;
            rented_books: number;
            lost_books: number;
            damaged_books: number;
            scope: string;
            total_districts: number;
        }, number | void>({
            query: (yearId) => `reports/overview?academic_year_id=${yearId}`,
            providesTags: ['Todo'],
        }),
        createTextbook: builder.mutation<IGetTextbooks[], ICreateTextbookRequest>({
            query: (newBook) => ({
                url: 'textbooks/',
                method: 'POST',
                body: newBook,
            }),
            invalidatesTags: ['Textbooks'],
        }),
        addSupplies: builder.mutation<any, { textbook_id: number, school_id: number, quantity: number, condition?: string }>({
            query: (payload) => ({
                url: 'supplies/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Copies'],
        }),
        getDistricts: builder.query<any[], number>({
            query: (regionId) => `territories/regions/${regionId}/districts`,
            providesTags: ['District'],
        }),
        getSchoolsByDistrict: builder.query<any[], number>({
            query: (districtId) => `territories/districts/${districtId}/schools`,
            providesTags: ['School'],
        }),
        getOverview: builder.query<any, { academic_year_id: number }>({
            query: ({ academic_year_id }) => `reports/overview?academic_year_id=${academic_year_id}`,
        }),
        getMe: builder.query<any, void>({
            query: () => 'auth/me',
            providesTags: ['Todo'],
        }),
        addRegion: builder.mutation<any, { name: string }>({
            query: (body) => ({ url: 'territories/regions', method: 'POST', body }),
            invalidatesTags: ['Region'],
        }),
        addDistrict: builder.mutation<any, { name: string, region_id: number }>({
            query: (body) => ({ url: 'territories/districts', method: 'POST', body }),
            invalidatesTags: ['District'],
        }),
        addSchool: builder.mutation<any, { name: string, district_id: number }>({
            query: (body) => ({ url: 'territories/schools', method: 'POST', body }),
            invalidatesTags: ['School'],
        }),
        updateDistrict: builder.mutation<any, { id: number, name: string, region_id: number }>({
            query: ({ id, ...body }) => ({
                url: `territories/districts/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['District'],
        }),
        updateSchool: builder.mutation<any, { id: number, name: string, district_id: number }>({
            query: ({ id, ...body }) => ({
                url: `territories/schools/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['School'],
        }),
        deleteDistrict: builder.mutation<any, number>({
            query: (id) => ({
                url: `territories/districts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['District'],
        }),
        deleteSchool: builder.mutation<any, number>({
            query: (id) => ({
                url: `territories/schools/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['School'],
        }),
        updateRegion: builder.mutation<any, { id: number, name: string }>({
            query: ({ id, ...patch }) => ({
                url: `territories/regions/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Region'],
        }),
        deleteRegion: builder.mutation<any, number>({
            query: (id) => ({
                url: `territories/regions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Region'],
        }),
        addCopies: builder.mutation<any, any>({
            query: (newOrder) => ({
                url: 'copies/',
                method: 'POST',
                body: newOrder,
            }),
            invalidatesTags: ['Copies'],
        }),
        getSchoolBudget: builder.query<any, { schoolId: number; yearId: number }>({
            query: ({ schoolId, yearId }) => ({
                url: `/finance/budgets/school/${schoolId}/year/${yearId}`,
                method: 'GET',
            }),
            providesTags: ['Budget'],
        }),
        updateStudent: builder.mutation<void, IUpdateStudentRequest>({
            query: ({ id, ...payload }) => ({
                url: `/students/${id}`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['Students'],
        }),
        getYearStatistics: builder.query<any, number>({
            query: (yearId) => `academic-years/enhanced/${yearId}/statistics`,
        }),

        closeAcademicYear: builder.mutation<any, number>({
            query: (yearId) => ({
                url: `academic-years/enhanced/${yearId}/close`,
                method: 'POST',
            }),
        }),
        GetSubjects: builder.query<ISubject[], void>({
            query: () => ({
                url: `subjects/`,
                method: 'GET',
            }),
            providesTags: ['Todo'],
        }),
        CreateDamageReport: builder.mutation<any, number>({
            query: (yearId) => ({
                url: `damage-reports/`,
                method: 'POST',
            }),
        }),
        GetTextbookById: builder.query<any, number>({
            query: (id) => `textbooks/${id}`,
            providesTags: (result, error, id) => [{ type: 'Textbooks', id }],
        }),
        GetCopiesById: builder.query<any, number>({
            query: (id) => ({
                url: `copies/${id}`,
                method: 'GET',
            }),
        }),
        getUsersCount: builder.query<{ total_users: number }, void>({
            query: () => ({
                url: '/auth/stats/users-count',
                method: 'GET',
            }),
        }),
        getAcademicYearsSummary: builder.query<IYearSummary[], void>({
            query: () => `academic-years/enhanced/summary/all`,
            providesTags: ['Todo'],
        }),
        getPendingBooksBySchool: builder.query<any, number>({
            query: (school_id) => `supplies/stats/pending-by-school?to_school_id=${school_id}`,
            providesTags: ['Supplies'],
        }),
        acceptBookItem: builder.mutation<any, { item_id: number; inventory_number: string }>({
            query: ({ item_id, inventory_number }) => ({
                url: `supplies/items/${item_id}/accept/`,
                method: 'POST',
                body: { inventory_number },
            }),
            invalidatesTags: ['Supplies', 'Copies'],
        }),
        getSupplyById: builder.query({
            query: (id) => `/supplies/${id}`,
            providesTags: ['Supplies'],
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
    useAddSuppliesMutation,
    useGetDistrictsQuery,
    useGetSchoolsByDistrictQuery,
    useGetOverviewQuery,
    useGetMeQuery,
    useAddRegionMutation,
    useAddDistrictMutation,
    useAddSchoolMutation,
    useUpdateDistrictMutation,
    useUpdateSchoolMutation,
    useDeleteDistrictMutation,
    useDeleteSchoolMutation,
    useUpdateRegionMutation,
    useDeleteRegionMutation,
    useAddCopiesMutation,
    useGetSchoolBudgetQuery,
    useGetStudentByIdQuery,
    useUpdateStudentMutation,
    useGetYearStatisticsQuery,
    useCloseAcademicYearMutation,
    useGetSubjectsQuery,
    useCreateDamageReportMutation,
    useGetTextbookByIdQuery,
    useGetCopiesByIdQuery,
    useGetUsersCountQuery,
    useGetAcademicYearsSummaryQuery,
    useGetPendingBooksBySchoolQuery,
    useAcceptBookItemMutation,
    useGetSupplyByIdQuery
} = Todo;