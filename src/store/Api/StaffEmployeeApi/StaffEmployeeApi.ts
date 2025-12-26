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
  }),
});

export const {
  useGetStaffEmployeeTopOverDueQuery,
  useGetStaffEmployeeUpcomingDeadlinesQuery,
  useGetStaffEmployeeLatestSubmissionsQuery,
} = staffEmployeeApi;

export default staffEmployeeApi;
