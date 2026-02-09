import baseApi from "../BaseApi/BaseApi";

const chartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChart: builder.mutation({
      query: (data) => ({
        url: "/chart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Charts", "ChartHistory"],
    }),
    getActiveInChart: builder.query({
      query: () => ({
        url: "/chart/activeInChart",
        method: "GET",
      }),
      providesTags: ["Charts"],
    }),
    getActiveChart: builder.query({
      query: () => ({
        url: "/chart/activeChart",
        method: "GET",
      }),
      providesTags: ["Charts"],
    }),
    getChartByProjectId: builder.query({
      query: (id) => ({
        url: `/charts/project/${id}`,
        method: "GET",
      }),
      providesTags: ["Charts"],
    }),
    getChartById: builder.query({
      query: (id) => ({
        url: `/chart/${id}`,
        method: "GET",
      }),
      providesTags: ["Charts"],
    }),
    findChildrenValue: builder.query({
      query: (id) => ({
        url: `chart/findChildrenValue/${id}`,
        method: "GET",
      }),
      providesTags: ["Charts", "ChartHistory"],
    }),
    updateChartValue: builder.mutation({
      query: (id) => ({
        url: `/updateChartValue/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Charts"],
    }),
    allChartHistory: builder.query({
      query: (id) => ({
        url: `/chart/allChartHistory/${id}`,
        method: "GET",
      }),
      providesTags: ["Charts"],
    }),
    getRootChart: builder.query({
      query: (id: string) => ({
        url: `/chart/root/${id}`,
        method: "GET",
      }),
      providesTags: ["Charts"],
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
  useGetRootChartQuery,
  useFindChildrenValueQuery,
  useLazyFindChildrenValueQuery,
} = chartApi;
export default chartApi;
