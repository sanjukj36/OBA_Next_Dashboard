import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { toast } from "sonner";

export const useLoginMutation = () => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: data => {
      const res = data.data;
      login(
        {
          token: res.token,
          id: res.id,
          company_entity: res.company_entity,
          fleet_entity: res.fleet_entity,
          vessel_entity: res.vessel_entity,
          email: res.email,
          is_superuser: res.is_superuser
        },
        res.token
      );
      router.push("/dashboard/overview");
    },
    onError: error => {
      // TODO: handle Error response.
      toast.error(error.message);
      console.log("Login Failed", error);
    }
  });
};
