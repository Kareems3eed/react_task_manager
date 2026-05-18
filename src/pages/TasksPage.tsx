import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/tasks.api";
import type { Task } from "../types";
import KIcon from "../shared/components/KIcon";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
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
            due_date: task.due_date ? task.due_date.split("T")[0] : "",
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateTask = async () => {
        if (!form.title?.trim()) return;
        try {
            setCreating(true);
            const newTask = await createTask(form);
            setTasks((prev) => [newTask, ...prev]);
            setForm({ title: "", description: "", status: "todo", priority: "medium", due_date: "" });
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
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            setEditingTask(null);
            setForm({ title: "", description: "", status: "todo", priority: "medium", due_date: "" });
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
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
                setError("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 ring-red-600/20';
            case 'medium': return 'bg-amber-100 text-amber-700 ring-amber-600/20';
            case 'low': return 'bg-emerald-100 text-emerald-700 ring-emerald-600/20';
            default: return 'bg-slate-100 text-slate-700 ring-slate-600/20';
        }
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Task Board</h1>
                        <p className="mt-1 text-slate-500">Manage and track your daily activities</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                {editingTask ? "Edit Task" : "Create New Task"}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Title</label>
                                    <input
                                        name="title"
                                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="What needs to be done?"
                                        value={form.title || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="Optional details..."
                                        value={form.description || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Status</label>
                                        <select
                                            name="status"
                                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            value={form.status}
                                            onChange={handleChange}
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Priority</label>
                                        <select
                                            name="priority"
                                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            value={form.priority}
                                            onChange={handleChange}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Due Date</label>
                                    <input
                                        type="date"
                                        name="due_date"
                                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={form.due_date || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    onClick={editingTask ? handleUpdateTask : handleCreateTask}
                                    disabled={creating}
                                    className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {editingTask ? "Update Task" : "Add Task"}
                                </button>
                                {editingTask && (
                                    <button
                                        onClick={() => {
                                            setEditingTask(null);
                                            setForm({ title: "", description: "", status: "todo", priority: "medium", due_date: "" });
                                        }}
                                        className="w-full rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all mt-2"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tasks List Section */}
                    <div className="lg:col-span-2">
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                                <KIcon name="IconClipboardList" size={48} className="text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">No tasks yet</h3>
                                <p className="text-slate-500">Get started by creating your first task above.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="group relative flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-semibold text-slate-900">{task.title}</h4>
                                                <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEdit(task)}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <KIcon name="IconPencil" size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <KIcon name="IconTrash" size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getPriorityColor(task.priority)}`}>
                                                {task.priority.toUpperCase()}
                                            </span>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <KIcon name="IconCircleCheck" size={14} className={task.status === 'done' ? 'text-emerald-500' : 'text-slate-400'} />
                                                <span className="capitalize">{task.status.replace('_', ' ')}</span>
                                            </div>

                                            {task.due_date && (
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <KIcon name="IconCalendar" size={14} className="text-slate-400" />
                                                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
