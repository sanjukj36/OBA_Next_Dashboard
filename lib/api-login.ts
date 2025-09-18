import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? `${process.env.NEXT_PUBLIC_API}/api`
    : `/api`;
// const BASE_URL = `${process.env.NEXT_PUBLIC_API}/api`;

const client = axios.create({ baseURL: BASE_URL });

export const loginCheckUserNameApi = async (body: { email: string }) => {
  return await client.post("/user/facial/checkuname", body);
};

// export const FacialLogin =async ()

export const facialLogin = async (body: FormData) => {
  return await client.post("user/facial/login", body, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
