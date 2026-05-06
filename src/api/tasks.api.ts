import axiosInstance from "./axios";
import type { Task } from "../types";

export const getTasks = async (): Promise<Task[]> => {
    const response = await axiosInstance.get("/tasks/");
    return response.data;
};

export const createTask = async (
    task: Partial<Task>
): Promise<Task> => {
    const response = await axiosInstance.post("/tasks/", task);
    return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tasks/${id}/`);
};