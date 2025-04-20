export interface Link {
    title: string;
    url: string;
    description?: string;
    id?: string;
}

export type EditableLink = {
    new_id?: string;
    title: string;
    id?: string;
    description: string | undefined;
    url: string;
    hasError?: boolean;
};