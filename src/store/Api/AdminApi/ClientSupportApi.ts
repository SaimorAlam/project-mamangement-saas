import baseApi from "../BaseApi/BaseApi";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ClientSupportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupport: builder.mutation({
      query: (data: any) => ({
        url: "client-support/create-ticket",
        method: "POST",
        body: data,
      }),
    }),
    getMyTickets: builder.mutation({
      query: () => ({
        url: "client-support/my-tickets",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateSupportMutation, useGetMyTicketsMutation } =
  ClientSupportApi;
export default ClientSupportApi;
