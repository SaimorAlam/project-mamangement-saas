import baseApi from "../BaseApi/BaseApi";

import { IAddEmployeePayload } from "@/types";

const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: ({ page, limit }) =>
        `/employees?page=${page}&limit=${limit}`,
      providesTags: ["Employees"],
    }),

    addEmployee: builder.mutation({
      query: ({
        projects,
        ...employeeData
      }: IAddEmployeePayload) => ({
        url: "/users/employees/create-employee",
        method: "POST",
        body: employeeData,
      }),
      invalidatesTags: ["Employees"],
    }),

    updateEmployee: builder.mutation({
      query: ({ projects, id, ...employeeData }) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        body: employeeData,
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
} = employeeApi;

export default employeeApi;
