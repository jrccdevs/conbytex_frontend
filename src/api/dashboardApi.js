import api from "./clienteApi"; // tu instancia configurada

export const getDashboardData = async () => {
  try {
    const { data } = await api.get("/dashboard/resumen");

    console.log("resumen",  data);
    return data;
  } catch (error) {
    console.error("Error dashboard:", error);
    throw error;
  }
};