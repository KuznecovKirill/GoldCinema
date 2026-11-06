import axiosClient from "../client/axiosClient";

const adminEndpoints = {
  executeCommand: "admin/add-media", // Единый эндпоинт для выполнения команд
};

const adminModule = {
  executeCommand: async ({ command, params }) => {
    try {
      console.log(`POST-запрос: ${command}`);
      const response = await axiosClient.post(adminEndpoints.executeCommand, {
        command,
        params,
      });
      return { response };
    } catch (err) {
      console.error("Ошибка при выполнении команды:", err);
      return { err };
    }
  },
};

export default adminModule;