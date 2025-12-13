import baseApi from "../BaseApi/BaseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    updateUsers: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    createManager: builder.mutation({
      query: (data) => ({
        url: "/users/managers/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Manager"],
    }),
    getAllManagers: builder.query({
      query: () => ({
        url: "/users/managers",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: "/users/employees/create-employee",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employee"],
    }),
    getAllEmployees: builder.query({
      query: () => ({
        url: "/users/employees",
        method: "GET",
      }),
      providesTags: ["Employee"],
    }),
    createViewer: builder.mutation({
      query: (data) => ({
        url: "/users/viewers/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Viewer"],
    }),
    getAllViewers: builder.query({
      query: () => ({
        url: "/users/viewers",
        method: "GET",
      }),
      providesTags: ["Viewer"],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getManagerById: builder.query({
      query: (id) => ({
        url: `/users/managers/${id}`,
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),

    getEmployeeById: builder.query({
      query: (id) => ({
        url: `/users/employees/${id}`,
        method: "GET",
      }),
      providesTags: ["Employee"],
    }),

    getViewerById: builder.query({
      query: (id) => ({
        url: `/users/viewers/${id}`,
        method: "GET",
      }),
      providesTags: ["Viewer"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUsersMutation,
  useGetAllManagersQuery,
  useGetAllEmployeesQuery,
  useGetProfileQuery,
  useGetAllViewersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetManagerByIdQuery,
  useGetEmployeeByIdQuery,
  useGetViewerByIdQuery,
  useCreateManagerMutation,
  useCreateEmployeeMutation,
  useCreateViewerMutation,
} = userApi;

export default userApi;
