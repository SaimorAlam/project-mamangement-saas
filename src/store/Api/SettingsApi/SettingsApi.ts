import baseApi from "../BaseApi/BaseApi";

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateNotificationClient: builder.mutation({
      query: (data) => ({
        url: "/notification/client",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateNotificationClientMutation } = settingsApi;
export default settingsApi;
