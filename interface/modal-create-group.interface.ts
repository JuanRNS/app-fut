export interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    fetchGroups: () => void;
    groupToEdit?: {
        id: string;
        name: string;
        description: string;
    };
}
