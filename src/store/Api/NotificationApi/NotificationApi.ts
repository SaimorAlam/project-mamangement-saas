import baseApi from "../BaseApi/BaseApi";

const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder)=>({
        getNotifications: builder.query({
            query: () => "notification/received",
            providesTags: ["Notification"],
        }),
        updateNotification: builder.mutation({
            query: (id: string) => ({
                url: `notification/client/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        })
    })
})

export const { useGetNotificationsQuery, useUpdateNotificationMutation } = notificationApi
export default notificationApi;