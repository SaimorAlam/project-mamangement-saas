/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../BaseApi/BaseApi";

// interface GetProjectsParams {
// page?: number;
// limit?: number;
// status?: string;
// priority?: string;
// name?: string;
// programId?: string;
// managerId?: string;
// startDate?: string;
// endDate?: string;
// sortBy?: string;
// sortOrder?: string;
// }

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffEmpStateCarts: builder.query({
      query: () => `/manager/dashboard`,
      providesTags: ["Manager"],
    }),
    // getAllProjects: builder.query<any, GetProjectsParams>({
    //   query: (params) => ({
    //     url: "/program",
    //     method: "GET",
    //     params,
    //   }),
    //   providesTags: ["Manager"],
    // }),
    getTopOverdueProjects: builder.query({
      query: () => `/manager/charts/top-overdue-projects`,
      providesTags: ["Manager"],
    }),
    getSubmissionStatus: builder.query({
      query: () => `/manager/submission-status`,
      providesTags: ["Manager"],
    }),
    // for project page
    getProjectPageStateCarts: builder.query({
      query: () => `/manager/project-dashboard`,
      providesTags: ["Manager"],
    }),
  }),
});

export const {
  useGetStaffEmpStateCartsQuery,
  useGetTopOverdueProjectsQuery,
  useGetSubmissionStatusQuery,
  useGetProjectPageStateCartsQuery
} = userApi;

export default userApi;