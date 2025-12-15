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
      query: (id) => ({
        url: `/program/${id}/projects`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Program", id },
        { type: "Program", id: "LIST" },
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
  }),
});

export const {
  useCreateProgramMutation,
  useGetAllProgramQuery,
  useGetProgramByIdQuery,
  useGetProjectsByProgramIdQuery,
  useUpdateProgramNameMutation,
} = programApi;

export default programApi;
