import { useMutation } from "@tanstack/react-query";

import { resetPassword } from "@/services/authService";

export const useResetPassword = () => {
  return useMutation({ mutationFn: resetPassword });
};
