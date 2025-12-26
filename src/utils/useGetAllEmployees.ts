/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllUsersQuery } from "@/store/Api/UserApi/UserApi";

const useGetAllEmployees = () => {
  const { data, isLoading } = useGetAllUsersQuery({});
  const allEmployees = data?.data?.data.filter(
    (user: any) => user.role !== "CLIENT"
  );
  return { allEmployees, isLoading };
};

export default useGetAllEmployees;
