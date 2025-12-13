import baseApi from "../BaseApi/BaseApi";

const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: ({ page, limit }) =>
        `/employees?page=${page}&limit=${limit}`,
      providesTags: ["Employees"],
    }),
  }),
});

export const { useGetAllEmployeesQuery } = employeeApi;

export default employeeApi;
