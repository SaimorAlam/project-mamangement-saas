import { useGetProfileQuery } from "@/store/Api/UserApi/UserApi";
import { User } from "@/types/Auth/Auth";

export const useGetUser = () => {
  const { data, isLoading, isError } = useGetProfileQuery({});

  const user = data?.data as User | undefined;

  return {
    loading: isLoading,
    error: isError,
    name: user?.name || "",
    role: user?.role || "",
    profileImage: user?.profileImage || "",
    email: user?.email || "",
    id: user?.id || "",
    status: user?.status || "",
  };
};
