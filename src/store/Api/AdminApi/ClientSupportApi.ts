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
    getMyTickets: builder.query({
      query: () => ({
        url: "client-support/my-tickets",
        method: "GET",
      }),
    }),
    getTicketMessages: builder.query({
      query: (id: string) => ({
        url: `client-support/${id}/my-ticket`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateSupportMutation,
  useGetMyTicketsQuery,
  useGetTicketMessagesQuery,
  useLazyGetTicketMessagesQuery,
} = ClientSupportApi;
export default ClientSupportApi;
