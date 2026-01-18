import { useAuth } from "@/context/AuthContext";

export const useAdmin = () => {
  return useAuth();
};
