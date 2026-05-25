import { useMutation } from "@tanstack/react-query";

import {
  registerUser,
  RegisterRequest,
} from "@/services/authService";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};