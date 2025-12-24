import baseApi from "../BaseApi/BaseApi";

const deadlineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingDeadlines: builder.query({
      query: () => ({
        url: "/employeeDashboard/projects/upcoming-deadlines?days=2025",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUpcomingDeadlinesQuery } = deadlineApi;
export default deadlineApi;
