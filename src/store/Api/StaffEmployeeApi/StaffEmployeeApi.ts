/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../BaseApi/BaseApi";

const staffEmployeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffEmployeeOverviewCards: builder.query({
      query: () => ({
        url: `/employeeDashboard/dashboard`,
        method: "GET",
      }),
      providesTags: ["Employee"],
    }),
    getStaffEmployeeTopOverDue: builder.query({
      query: () => ({
        url: `/employeeDashboard/projects/top-overdue`,
        method: "GET",
      }),
      providesTags: ["Employee"],
    }),
    getStaffEmployeeUpcomingDeadlines: builder.query({
      query: (params) => ({
        url: "/employeeDashboard/projects/upcoming-deadlines",
        method: "GET",
        params,
      }),
      providesTags: ["Employee"],
    }),
    getStaffEmployeeLatestSubmissions: builder.query({
      query: (query) => {
        const searchParams = new URLSearchParams();

        Object.keys(query).forEach((key) => {
          if (
            query[key] !== undefined &&
            query[key] !== null &&
            query[key] !== ""
          ) {
            searchParams.append(key, query[key].toString());
          }
        });

        return {
          url: `/submitted`,
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["Employee"],
    }),
    getStaffEmployeeSubmissionStatus: builder.query({
      query: () => ({
        url: `/employeeDashboard/submission-status`,
        method: "GET",
      }),
      providesTags: ["Employee"],
    }),
    getFavoriteProjects: builder.query<any, void>({
      query: () => `/favorites-project/me`,
      providesTags: ["Employee"],
    }),
    addToFavouriteProject: builder.mutation<any, string>({
      query: (projectId) => ({
        url: `/favorites-project`,
        method: "POST",
        body: { projectId },
      }),
      invalidatesTags: ["Employee"],
    }),
    removeFavouriteProject: builder.mutation({
      query: (projectId) => ({
        url: "/favorites-project",
        method: "DELETE",
        body: { projectId: projectId },
      }),
      invalidatesTags: ["Employee"],
    }),
    getNotifications: builder.query({
      query: () => `/notification/received`,
    }),
    getEmployeeAllProjects: builder.query({
      query: (params) => ({
        url: "/project/all",
        method: "GET",
        params,
      }),
      providesTags: ["Employee"],
    }),
    createEmployeeSubmission: builder.mutation<any, {
      information: string;
      submission: string;
      projectId: string;
      ipAddress?: string;
      elements: {
        chartId: string;
        xAxis: string;
        yAxis: string;
        zAxis: string;
      }[];
    }>({
      query: (data) => ({
        url: `/submitted`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
});

export const {
  useGetStaffEmployeeOverviewCardsQuery,
  useGetStaffEmployeeTopOverDueQuery,
  useGetStaffEmployeeUpcomingDeadlinesQuery,
  useGetStaffEmployeeLatestSubmissionsQuery,
  useGetStaffEmployeeSubmissionStatusQuery,
  useGetFavoriteProjectsQuery,
  useAddToFavouriteProjectMutation,
  useRemoveFavouriteProjectMutation,
  useGetNotificationsQuery,
  useGetEmployeeAllProjectsQuery,
  useCreateEmployeeSubmissionMutation,
} = staffEmployeeApi;

export default staffEmployeeApi;
