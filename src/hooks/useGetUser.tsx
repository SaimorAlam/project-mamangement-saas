import { useGetProfileQuery } from "@/store/Api/UserApi/UserApi";
import { User } from "@/types/Auth/Auth";

export const useGetUser = () => {
  const { data } = useGetProfileQuery({});
  const user = data?.data;
  const { name, role, profileImage, email, id, status } = user as User;
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
