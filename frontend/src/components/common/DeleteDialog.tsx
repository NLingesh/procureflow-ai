interface DeleteDialogProps {
    open: boolean;
}

const DeleteDialog = ({ open }: DeleteDialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-red-600">
                    Delete Item
                </h2>

                <p className="mt-2 text-slate-500">
                    This action cannot be undone.
                </p>
            </div>
        </div>
    );
};

export default DeleteDialog;