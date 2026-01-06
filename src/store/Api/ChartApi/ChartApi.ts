import baseApi from "../BaseApi/BaseApi";

const chartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChart: builder.mutation({
      query: (data) => ({
        url: "/chart",
        method: "POST",
        body: data,
      }),
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
} = chartApi;
export default chartApi;