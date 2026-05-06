export interface Task {
    id: string;
    user: User;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
    is_archived?: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    username: string;
}