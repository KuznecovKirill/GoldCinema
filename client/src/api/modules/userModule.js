import privateClient from "../client/privateClient";
import publicClient from "../client/public.client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const userEndpoints = {
    signIn: "user/signIn",
    signUp: "user/signUp",
    getInfo: "user/info",
    updatePassword: "user/update-password"
  };

const userModule = {
    signIn: async ({ username, password }) => {
      try {
        console.log("Запрос");
        const response = await publicClient.post(
          userEndpoints.signIn,
          { username, password }
        );
        return { response };
      } catch (err) { console.log("err"); return { err }; }
    },
    signUp: async ({ username, password, confirmPassword}) => {
      try {
        const response = await publicClient.post(
          userEndpoints.signUp,
          { username, password, confirmPassword }
        );
        return { response };
      } catch (err) { return { err }; }
    },
    getInfo: async () => {
      try {
        const response = await privateClient.get(userEndpoints.getInfo);
        return { response };
      } catch (err) { return { err }; }
    },
    updatePassword: async ({ password, newPassword}) => {
      try {
        const response = await privateClient.put(
          userEndpoints.updatePassword,
          { password, newPassword}
        );
        return { response };
      } catch (err) { return { err }; }
    }
  };
  export default userModule;