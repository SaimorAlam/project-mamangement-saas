import { useGetProfileQuery } from "@/store/Api/UserApi/UserApi";
import { User } from "@/types/Auth/Auth";

export const useGetUser = () => {
  const { data } = useGetProfileQuery({});
  const user = data?.data;
  const { name, role, profileImage, email, id, status } = user as User;
  return {
    name,
    role,
    profileImage,
    email,
    id,
    status,
  };
};
