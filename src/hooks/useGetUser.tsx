import { useGetProfileQuery } from "@/store/Api/UserApi/UserApi";

export const useGetUser = () => {
  const { data } = useGetProfileQuery({});
  const user = data?.data;
  const { name, role, profileImage, email, id, status } = user;
  return {
    name,
    role,
    profileImage,
    email,
    id,
    status,
  };
};
