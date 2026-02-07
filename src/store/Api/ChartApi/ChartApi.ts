import baseApi from "../BaseApi/BaseApi";

const chartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChart: builder.mutation({
      query: (data) => ({
        url: "/charts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Charts"]
    }),
    getActiveInChart: builder.query({
      query: () => ({
        url: "/chart/activeInChart",
        method: "GET",
      }),
    }),
    getActiveChart: builder.query({
      query: () => ({
        url: "/chart/activeChart",
        method: "GET",
      }),
    }),
    getChartByProjectId: builder.query({
      query: (id) => ({
        url: `/charts/project/${id}`,
        method: "GET",
      }),
      providesTags: ["Charts"]
    }),
    getChartById: builder.query({
      query: (id) => ({
        url: `/chart/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateChartMutation,
  useGetActiveInChartQuery,
  useGetActiveChartQuery,
  useGetChartByIdQuery,
  useLazyGetChartByIdQuery,
  useGetChartByProjectIdQuery,
} = chartApi;
export default chartApi;