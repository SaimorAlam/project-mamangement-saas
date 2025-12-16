/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "../BaseApi/BaseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: ({ employeeIds, ...data }) => ({
        url: "/project",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    getAllProjects: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        Object.entries(args || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return {
          url: "/project",
          method: "GET",
          params,
        };
      },
      providesTags: (result) => [
        { type: "Project", id: "LIST" },
        ...(result?.data?.data ?? []).map((project: any) => ({
          type: "Project",
          id: project.id,
        })),
      ],
    }),

    searchProjects: builder.query({
      query: (searchTerm) => ({
        url: "/project/search",
        method: "GET",
        params: { name: searchTerm },
      }),
      providesTags: [{ type: "Project", id: "LIST" }],
    }),

    getProjectById: builder.query({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Project", id }],
    }),

    updateProject: builder.mutation({
      query: ({ id, ...project }) => ({
        url: `/project/${id}`,
        method: "PATCH",
        body: project,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    getProjectSheets: builder.query({
      query: (id) => ({
        url: `/project/${id}/sheets`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Project", id }],
    }),

    updateProjectStatus: builder.mutation({
      query: (data) => ({
        url: "/project/status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useSearchProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectSheetsQuery,
  useUpdateProjectStatusMutation,
} = projectApi;

export default projectApi;
