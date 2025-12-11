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
        }),
        getProgramById: builder.query({
            query: (id) => ({
                url: `/program/${id}`,
                method: "GET",
            }),
        }),
        getProgramProjects: builder.query({
            query: (id) => ({
                url: `/program/${id}/projects`,
                method: "GET",
            }),
        }),
    }),
})

export const {
    useCreateProgramMutation,
    useGetAllProgramQuery,
    useGetProgramByIdQuery,
    useGetProgramProjectsQuery,
} = programApi

export default programApi