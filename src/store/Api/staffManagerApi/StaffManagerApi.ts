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
      query: (params) => ({
        url: "/manager/submissions",
        method: "GET",
        params,
      }),
      providesTags: ["Manager"],
    }),
    getAllReviewProjectsReviewerActivity: builder.query({ 
      query: () => `/manager/activity`,
      providesTags: ["Manager"],
    }),
    editSubmission: builder.mutation<any, {submissionId: string; action: string}>({
      query: ({ submissionId, action }) => ({
        url: `/manager/${submissionId}/status`,
        method: "PATCH",
        body: { status : action },
      }),
      invalidatesTags: ["Manager"],
    }),
    deleteSubmission: builder.mutation<any, {submissionId: string}>({
      query: ({ submissionId }) => ({
        url: `/manager/${submissionId}/delete-submission`,
        method: "DELETE",
      }),
      invalidatesTags: ["Manager"],
    }),
    // for favorite projects
    getFavoriteProjects: builder.query<any, void>({
      query: ()=> `/favorites-project/me`,
      providesTags: ["Manager"],
    }),
    addProjectToFavorite: builder.mutation<any, {projectId: string}>({
      query: (body)=> ({
        url: `/favorites-project`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Manager"],
    }),
    removeProjectFromFavorite: builder.mutation({
      query: (projectId) => ({
        url: "/favorites-project",
        method: "DELETE",
        body: { projectId: projectId },
      }),
      invalidatesTags: ["Manager"],
    }),
    // for notification
    getNotification: builder.query<any, void>({
      query: ()=> `/notification/received`,
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
  useGetAllReviewProjectsReviewerActivityQuery,
  useEditSubmissionMutation,
  useDeleteSubmissionMutation,
  useGetFavoriteProjectsQuery,
  useAddProjectToFavoriteMutation,
  useRemoveProjectFromFavoriteMutation,
  useGetNotificationQuery
} = userApi;

export default userApi;