import baseApi from "../BaseApi/BaseApi";

const sheetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSheet: builder.mutation({
      query: (data) => ({
        url: "/sheet/submit-cell",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUploadSheetMutation } = sheetApi;

export default sheetApi;
