import baseApi from "../BaseApi/BaseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffEmpStateCarts: builder.query({
        query: ()=> `/manager/dashboard`,
        providesTags: ["Manager"],
    }),
    // add here the query 
  }),
});

export const {
  useGetStaffEmpStateCartsQuery,
} = userApi;

export default userApi;
