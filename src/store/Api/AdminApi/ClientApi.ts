/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../BaseApi/BaseApi";

const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: (data: any) => ({
        url: "clients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),
    getAllClientByAdmin: builder.query({
      query: () => ({
        url: "clients/getAll",
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),
    getClientByIdAdmin: builder.query({
      query: (id: string) => ({
        url: `clients/getSingle/${id}`,
        method: "GET",
      }),
    }),
    updateClient: builder.mutation({
      query: (data: any) => ({
        url: `clients/update/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteClient: builder.mutation({
      query: (id: string) => ({
        url: `clients/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
    getClientDashboardSummary: builder.query({
      query: () => ({
        url: `clients/dashboard/summary`,
        method: "GET",
      }),
    }),
    getClientStatusStack: builder.query({
      query: () => ({
        url: `clients/dashboard/status-stack`,
        method: "GET",
      }),
    }),
    getClientPaymentStats: builder.query({
      query: () => ({
        url: `clients/payment-stats`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateClientMutation,
  useGetAllClientByAdminQuery,
  useGetClientByIdAdminQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientDashboardSummaryQuery,
  useGetClientStatusStackQuery,
  useGetClientPaymentStatsQuery,
} = clientApi;
export default clientApi;
