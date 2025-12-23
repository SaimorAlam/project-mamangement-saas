import baseApi from "../BaseApi/BaseApi";

const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: ({
        page,
        limit,
        search,
        status,
        joinedDateFrom,
        joinedDateTo,
        sortBy,
        sortOrder,
      }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", String(limit));

        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (joinedDateFrom) params.append("joinedDateFrom", joinedDateFrom);
        if (joinedDateTo) params.append("joinedDateTo", joinedDateTo);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        return {
          url: `/employees`,
          method: "GET",
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              { type: "Employees", id: "LIST" },
              ...result.data.map((employee: { id: string }) => ({
                type: "Employees",
                id: employee.id,
              })),
            ]
          : [{ type: "Employees", id: "LIST" }],
    }),

    getSingleEmployee: builder.query({
      query: (id) => `/employees/${id}`,
    }),

    addEmployee: builder.mutation({
      query: (data) => ({
        url: "/users/employees/create-employee",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),
    addManager: builder.mutation({
      query: (data) => ({
        url: "/users/managers/create",
        method: "POST",
        body: data,
      }),
    }),
    addViewer: builder.mutation({
      query: (data) => ({
        url: "/users/viewers/create",
        method: "POST",
        body: data,
      }),
    }),
    updateEmployee: builder.mutation({
      query: ({ projects, id, ...employeeData }) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        body: employeeData,
      }),
      invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),

    bulkDeleteEmployee: builder.mutation({
      query: (data) => ({
        url: "/employees/bulk/delete",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),
    getEmployeeTaskStatistics: builder.query({
      query: (id) => `/employees/${id}/statistics`,
    }),
    getEmployeeTaskById: builder.query({
      query: (id) => `/employees/${id}/tasks`,
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetSingleEmployeeQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useBulkDeleteEmployeeMutation,
  useGetEmployeeTaskStatisticsQuery,
  useGetEmployeeTaskByIdQuery,
  useAddManagerMutation,
  useAddViewerMutation,
} = employeeApi;

export default employeeApi;
