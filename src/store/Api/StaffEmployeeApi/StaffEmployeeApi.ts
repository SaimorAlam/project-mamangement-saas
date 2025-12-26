import baseApi from "../BaseApi/BaseApi";

const staffEmployeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffEmployeeTopOverDue: builder.query({
      query: () => ({
        url: `/employeeDashboard/projects/top-overdue`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStaffEmployeeTopOverDueQuery } =
  staffEmployeeApi;

export default staffEmployeeApi;
