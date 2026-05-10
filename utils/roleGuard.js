import { getStorage } from "@/utils/storage";

export const isAdmin = () => {
  const user = getStorage("user", null);
  return user?.role === "admin";
};