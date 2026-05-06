import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/tasks.api";
import type { Task } from "../types";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [creating, setCreating] = useState<boolean>(false);
    const [form, setForm] = useState<Partial<Task>>({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
    });
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const startEdit = (task: Task) => {
        setEditingTask(task);

        setForm({
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority,
            due_date: task.due_date
                ? task.due_date.split("T")[0]
                : "",
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateTask = async () => {
        if (!form.title?.trim()) return;

        try {
            setCreating(true);

            const newTask = await createTask(form);

            setTasks((prev) => [newTask, ...prev]);

            // reset form
            setForm({
                title: "",
                description: "",
                status: "todo",
                priority: "medium",
                due_date: "",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateTask = async () => {
        if (!editingTask) return;

        try {
            const updated = await updateTask(editingTask.id, form);

            setTasks((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t))
            );

            // reset form AFTER update
            setEditingTask(null);

            setForm({
                title: "",
                description: "",
                status: "todo",
                priority: "medium",
                due_date: "",
            });
        } catch (err) {
            console.error("Update error:", err);
        }
    };



    const handleDeleteTask = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        try {
            await deleteTask(id);

            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setError("");
                const data = await getTasks();
                setTasks(data);
            } catch (err) {
                console.log(err)
                setError("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Tasks</h2>
            <div>
                <h3>Create Task</h3>

                <input
                    name="title"
                    placeholder="Title"
                    value={form.title || ""}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description || ""}
                    onChange={handleChange}
                />

                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <select name="priority" value={form.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <input
                    type="date"
                    name="due_date"
                    value={form.due_date || ""}
                    onChange={handleChange}
                />

                <button
                    onClick={editingTask ? handleUpdateTask : handleCreateTask}
                >
                    {editingTask ? "Update Task" : "Add Task"}
                </button>
            </div>
            {tasks.length === 0 ? (
                <p>No tasks found</p>
            ) : (
                tasks.map((task) => (
                    <div key={task.id}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>{task.status}</p>
                        <p>{task.due_date}</p>
                        <p>{task.priority}</p>
                        <p>{task.is_archived}</p>
                        <p>{task.created_at}</p>
                        <p>{task.updated_at}</p>
                        <button onClick={() => startEdit(task)}>Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)}>
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}