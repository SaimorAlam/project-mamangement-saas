/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../BaseApi/BaseApi";

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
    getUpcomingDeadlines: builder.query({
      query: (params) => ({
        url: "/manager/projects/upcoming-deadlines",
        method: "GET",
        params,
      }),
      providesTags: ["Manager"],
    }),
    getAllActivityLogs: builder.query({
      query: (params) => ({
        url: "/activities",
        method: "GET",
        params,
      }),
      providesTags: ["Manager"],
    }),
    getAllLatestSubmissions: builder.query({
      query: (params) => ({
        url: "/manager/all-manager-submission",
        method: "GET",
        params,
      }),
      providesTags: ["Manager"],
    }),
    // for project page
    getProjectPageStateCarts: builder.query({
      query: () => `/manager/project-dashboard`,
      providesTags: ["Manager"],
    }),
    getProgramAllProjects: builder.query({ 
      query: () => `/manager/program-dashboard`,
      providesTags: ["Manager"],
    }),
    // for program review
    getProjectReviewPageCards: builder.query({ 
      query: () => `/manager/overview`,
      providesTags: ["Manager"],
    }),
    getAllReviewProjects: builder.query({ 
      query: () => `/manager/submissions`,
      providesTags: ["Manager"],
    }),
    getAllReviewProjectsReviewerActivity: builder.query({ 
      query: () => `/manager/activity`,
      providesTags: ["Manager"],
    }),
  }),
});

export const {
  useGetStaffEmpStateCartsQuery,
  useGetTopOverdueProjectsQuery,
  useGetSubmissionStatusQuery,
  useGetUpcomingDeadlinesQuery,
  useGetAllActivityLogsQuery,
  useGetAllLatestSubmissionsQuery,
  useGetProjectPageStateCartsQuery,
  useGetProgramAllProjectsQuery,
  useGetProjectReviewPageCardsQuery,
  useGetAllReviewProjectsQuery,
  useGetAllReviewProjectsReviewerActivityQuery
} = userApi;

export default userApi;