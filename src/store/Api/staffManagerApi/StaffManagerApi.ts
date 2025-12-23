import baseApi from "../BaseApi/BaseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffEmpStateCarts: builder.query({
        query: ()=> `/manager/dashboard`,
        providesTags: ["Manager"],
    })
  }),
});

export const {
  useGetStaffEmpStateCartsQuery,
} = userApi;

export default userApi;
