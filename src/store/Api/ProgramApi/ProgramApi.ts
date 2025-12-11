import baseApi from "../BaseApi/BaseApi";

const programApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProgram: builder.mutation({
      query: (data) => ({
        url: "/program",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Program"],
    }),
    getAllProgram: builder.query({
      query: () => ({
        url: "/program",
        method: "GET",
      }),
      providesTags: ["Program"],
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
      invalidatesTags: ["Program"],
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
