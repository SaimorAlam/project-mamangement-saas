/* eslint-disable @typescript-eslint/no-explicit-any */
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
      query: ({ programId }: { programId: string }) => ({
        url: `/client-dashboard/timeline?programId=${programId}`,
        method: "GET",
      }),
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

    getDeadline: builder.query({
      query: () => "/client-dashboard/upcoming-deadline",
      providesTags: ["Dashboard"],
    }),
    getAllSubmission: builder.query({
      query: (args: any) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            params.set(key, value as string);
          }
        });
        return {
          url: "/client-dashboard/all-submissions",
          method: "GET",
          params,
        };
      },
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetOverviewStackQuery,
  useGetEmployeeActivityQuery,
  useGetTimelineQuery,
  useLazyGetTimelineQuery,
  useGetStatusQuery,
  useGetOverdueQuery,
  useGetDeadlineQuery,
  useGetAllSubmissionQuery,
} = clientDashboardApi;
export default clientDashboardApi;
