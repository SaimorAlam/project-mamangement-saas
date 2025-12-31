/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
    deletingItemId: string;
    deletingItemTitle?: string;
    onDelete: (deletingItemId: string) => void;
}

const DeleteModal = ({ deletingItemTitle, deletingItemId, onDelete }: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-[#B00020]" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete {deletingItemTitle ? deletingItemTitle : ""}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600">
                    This action cannot be undone. Are you sure to delete this?
                </p>

                <DialogFooter className="flex gap-3 mt-4">
                    <button className="border px-4 py-2 rounded" onClick={()=> setOpen(false)}>
                        Cancel
                    </button>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => onDelete(deletingItemId)}
                    >
                        Delete
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
