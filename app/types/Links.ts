export type EditableLink = {
    new_id?: string;
    title: string;
    id?: string;
    description: string | null;
    url: string;
    hasError?: boolean;
};