import baseApi from "../BaseApi/BaseApi";


export const infrastructureNodesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getRootNodes: builder.query({
      query: (projectId) => ({
        url: `/infrastructure-nodes/project/${projectId}/roots`,
        method: "GET",
      }),
      providesTags: ["Nodes"],
    }),

    getProjectTree: builder.query({
      query: (projectId) => ({
        url: `/infrastructure-nodes/project/${projectId}/tree`,
        method: "GET",
      }),
      providesTags: ["Nodes"],
    }),

    getNodeTree: builder.query({
      query: (nodeId) => ({
        url: `/infrastructure-nodes/${nodeId}/tree`,
        method: "GET",
      }),
      providesTags: ["Nodes"],
    }),

    getFlatNodes: builder.query({
      query: (projectId) => ({
        url: `/infrastructure-nodes/project/${projectId}/flat`,
        method: "GET",
      }),
      providesTags: ["Nodes"],
    }),

    getNodeChildren: builder.query({
      query: (nodeId) => ({
        url: `/infrastructure-nodes/${nodeId}/children`,
        method: "GET",
      }),
      providesTags: ["Nodes"],
    }),

    exportNodes: builder.query({
      query: (projectId) => ({
        url: `/infrastructure-nodes/project/${projectId}/export`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    createNode: builder.mutation({
      query: (payload) => ({
        url: `/infrastructure-nodes`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Nodes"],
    }),

    updateNode: builder.mutation({
      query: ({ nodeId, data }) => ({
        url: `/infrastructure-nodes/${nodeId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Nodes"],
    }),

    deleteNode: builder.mutation({
      query: (nodeId) => ({
        url: `/infrastructure-nodes/${nodeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Nodes"],
    }),

    importNodes: builder.mutation({
      query: ({ projectId, data }) => ({
        url: `/infrastructure-nodes/project/${projectId}/import`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Nodes"],
    }),

  }),
});

export const {
  useGetRootNodesQuery,
  useGetProjectTreeQuery,
  useLazyGetProjectTreeQuery,
  useGetNodeTreeQuery,
  useGetFlatNodesQuery,
  useGetNodeChildrenQuery,
  useExportNodesQuery,
  useCreateNodeMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
  useImportNodesMutation,
} = infrastructureNodesApi;

export default infrastructureNodesApi;
