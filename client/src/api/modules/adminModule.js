import privateClient from "../client/privateClient";

const adminEndpoints = {
  executeCommand: "admin/add-media", // Единый эндпоинт для выполнения команд
};

const adminModule = {
  executeCommand: async ({ command, params }) => {
    console.log(params);
    try {
      console.log(`POST-запрос: ${command}`);
      const response = await privateClient.post(adminEndpoints.executeCommand, {
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