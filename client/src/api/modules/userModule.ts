import axiosClient from "../client/axiosClient";
import { AuthResponse, User } from "../../types";

//Шрифты стоит убрать, если я их использую в index.tsx
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const userEndpoints = {
  signIn: "user/signIn",
  signUp: "user/signUp",
  getInfo: "user/info",
  updatePassword: "user/update-password",
};

interface SignInParams {
  username: string;
  password: string;
}

interface SignUpParams {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface UpdatePasswordParams {
  password: string;
  newPassword: string;
}

const userModule = {
  signIn: async (data: SignInParams): Promise<{ response?: AuthResponse; err?: any }> => {
    try {
      const response = await axiosClient.post<AuthResponse>(userEndpoints.signIn, data);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  signUp: async (data: SignUpParams): Promise<{ response?: AuthResponse; err?: any }> => {
    try {
      const response = await axiosClient.post<AuthResponse>(userEndpoints.signUp, data);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getInfo: async (): Promise<{ response?: User; err?: any }> => {
    try {
      const response = await axiosClient.get<User>(userEndpoints.getInfo);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  updatePassword: async (data: UpdatePasswordParams): Promise<{ response?: any; err?: any }> => {
    try {
      const response = await axiosClient.put(userEndpoints.updatePassword, data);
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default userModule;