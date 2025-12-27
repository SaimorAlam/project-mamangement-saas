import baseApi from "../BaseApi/BaseApi";

const staffEmployeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffEmployeeTopOverDue: builder.query({
      query: () => ({
        url: `/employeeDashboard/projects/top-overdue`,
        method: "GET",
      }),
    }),
    getStaffEmployeeUpcomingDeadlines: builder.query({
      query: (params) => ({
        url: "/employeeDashboard/projects/upcoming-deadlines",
        method: "GET",
        params,
      }),
    }),
    getStaffEmployeeLatestSubmissions: builder.query({
      query: () => ({
        url: `/submitted`,
        method: "GET",
      }),
    }),
    getStaffEmployeeSubmissionStatus: builder.query({
      query: () => ({
        url: `/employeeDashboard/submission-status`,
        method: "GET",
      }),
    }),
    getFavoriteProjects: builder.query<any, void>({
      query: () => `/favorites-project/me`,
      providesTags: [{ type: "menuItems", id: "LIST" }],
    }),
    addToFavouriteProject: builder.mutation<any, string>({
      query: (projectId) => ({
        url: `/favorites-project`,
        method: "POST",
        body: { projectId },
      }),
      invalidatesTags: [{ type: "menuItems", id: "LIST" }],
    }),
    removeFavouriteProject: builder.mutation({
      query: (projectId) => ({
        url: "/favorites-project",
        method: "DELETE",
        body: { projectId: projectId },
      }),
      invalidatesTags: [{ type: "menuItems", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStaffEmployeeTopOverDueQuery,
  useGetStaffEmployeeUpcomingDeadlinesQuery,
  useGetStaffEmployeeLatestSubmissionsQuery,
  useGetStaffEmployeeSubmissionStatusQuery,
  useGetFavoriteProjectsQuery,
  useAddToFavouriteProjectMutation,
  useRemoveFavouriteProjectMutation,
} = staffEmployeeApi;

export default staffEmployeeApi;
