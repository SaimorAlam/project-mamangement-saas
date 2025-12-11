import baseApi from "../BaseApi/BaseApi";

const programApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProgram: builder.mutation({
      query: (data) => ({
        url: "/program",
        method: "POST",
        body: data,
      }),
    }),
    getAllProgram: builder.query({
      query: () => ({
        url: "/program",
        method: "GET",
      }),
      providesTags: ["PROGRAM"],
    }),
    getProgramById: builder.query({
      query: (id) => ({
        url: `/program/${id}`,
        method: "GET",
      }),
    }),
    getProjectsById: builder.query({
      query: (id) => ({
        url: `/program/${id}/projects`,
        method: "GET",
      }),
    }),
    updateProgramName: builder.mutation({
      query: (data) => ({
        url: `/program/${data.id}/name`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateProgramMutation,
  useGetAllProgramQuery,
  useGetProgramByIdQuery,
  useGetProjectsByIdQuery,
  useUpdateProgramNameMutation,
} = programApi;

export default programApi;
