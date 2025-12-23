import { IProgram } from "@/types";
import baseApi from "../BaseApi/BaseApi";
const programApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProgram: builder.mutation({
      query: (data) => ({
        url: "/program",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Program", id: "LIST" }],
    }),

    getAllProgram: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        console.log(args);
        Object.entries(args).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
        return {
          url: "/program",
          method: "GET",
          params,
        };
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
            ...result.data.data.map((program: IProgram) => ({
              type: "Program",
              id: program.id,
            })),
            { type: "Program", id: "LIST" },
          ]
          : [{ type: "Program", id: "LIST" }],
    }),

    getProgramById: builder.query({
      query: (id) => {
        console.log(id);
        return {
          url: `/program/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: "Program", id }],
    }),

    getProjectsByProgramId: builder.query({
      query: ({ programId, args }) => {
        const params = new URLSearchParams();

        Object.entries(args || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
        return {
          url: `/program/${programId}/projects`,
          method: "GET",
          params,
        };
      },
      providesTags: (_result, _error, programId) => [
        { type: "Project", id: "LIST" },
        { type: "Program", id: "LIST" },
        { type: "Program", id: programId },
      ],
    }),

    updateProgramName: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/program/${id}/name`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Program", id },
        { type: "Program", id: "LIST" },
      ],
    }),
    getChartTitleId: builder.mutation({
      query:(bodyData)=>({
        url:`/chart`,
        method:"POST",
        body:bodyData
      })
    }),
    getStackBarChartCSVfilesTitleId: builder.query({
      query: () => `/charts/stack-bar-chart`
    }),
    getHeatmapChartCSVfilesTitleId: builder.query({
      query: () => `/charts/heat-map-chart`
    }),
    getMultiAxisLineChartCSVfilesTitleId: builder.query({
      query: () => `/charts/multi-axis-line-chart`
    }),
  })
})
  export const {
    useCreateProgramMutation,
    useGetAllProgramQuery,
    useGetProgramByIdQuery,
    useGetProjectsByProgramIdQuery,
    useUpdateProgramNameMutation,
    useGetChartTitleIdMutation,
    useGetStackBarChartCSVfilesTitleIdQuery,
    useGetHeatmapChartCSVfilesTitleIdQuery,
    useGetMultiAxisLineChartCSVfilesTitleIdQuery
  } = programApi;

  export default programApi;
