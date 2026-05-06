export interface Task {
    id: number;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    due_date?: string | null;
    is_archived?: boolean;
    created_at?: string;
    updated_at?: string;
}