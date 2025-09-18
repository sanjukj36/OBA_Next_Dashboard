import { useAuthStore } from "@/store/use-auth-store";
import axios from "axios";
import { navigateToLogin } from "./navigate";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? `${process.env.NEXT_PUBLIC_API}/api`
    : `/api`;

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.response.use(
  (response) => response,
  (err) => {
    if(err.response?.status === 403) {
      const { logout } = useAuthStore.getState()
      logout();
      navigateToLogin()
    }
    return Promise.reject(err)
  }
)

export default client;
