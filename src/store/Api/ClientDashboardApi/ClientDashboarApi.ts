import baseApi from "../BaseApi/BaseApi";

const clientDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStack: builder.query({
      query: () => "/client-dashboard/overview-stack",
      providesTags: ["Dashboard"],
    }),

    getEmployeeActivity: builder.query({
      query: () => "/client-dashboard/employee-activity",
      providesTags: ["Dashboard"],
    }),

    getTimeline: builder.query({
      query: () => "/client-dashboard/timeline",
      providesTags: ["Dashboard"],
    }),

    getStatus: builder.query({
      query: ({ period }: { period: string }) =>
        `/client-dashboard/status?period=${period}`,
      providesTags: ["Dashboard"],
    }),

    getOverdue: builder.query({
      query: () => "/client-dashboard/overdue",
      providesTags: ["Dashboard"],
    }),

    getUpcomingDeadline: builder.query({
      query: () => "/client-dashboard/upcoming-deadline",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetOverviewStackQuery,
  useGetEmployeeActivityQuery,
  useGetTimelineQuery,
  useGetStatusQuery,
  useGetOverdueQuery,
  useGetUpcomingDeadlineQuery,
} = clientDashboardApi;
export default clientDashboardApi;
