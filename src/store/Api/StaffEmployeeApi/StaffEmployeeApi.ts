/* eslint-disable @typescript-eslint/no-explicit-any */
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
    }),
    getStaffEmployeeSubmissionStatus: builder.query({
      query: () => ({
        url: `/employeeDashboard/submission-status`,
        method: "GET",
      }),
    }),
    getFavoriteProjects: builder.query<any, void>({
      query: () => `/favorites-project/me`,
      providesTags: ["menuItems"],
    }),
    addToFavouriteProject: builder.mutation<any, string>({
      query: (projectId) => ({
        url: `/favorites-project`,
        method: "POST",
        body: { projectId },
      }),
      invalidatesTags: ["menuItems", "Manager"],
    }),
    removeFavouriteProject: builder.mutation({
      query: (projectId) => ({
        url: "/favorites-project",
        method: "DELETE",
        body: { projectId: projectId },
      }),
      invalidatesTags: ["menuItems"],
    }),
    getNotifications: builder.query({
      query: () => `/notification/received`,
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
  useGetNotificationsQuery,
} = staffEmployeeApi;

export default staffEmployeeApi;
