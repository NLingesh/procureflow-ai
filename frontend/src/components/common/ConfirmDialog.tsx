interface ConfirmDialogProps {
    open: boolean;
}

const ConfirmDialog = ({ open }: ConfirmDialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
                <h2 className="text-lg font-semibold">
                    Confirm Action
                </h2>

                <p className="mt-2 text-slate-500">
                    Are you sure you want to continue?
                </p>
            </div>
        </div>
    );
};

export default ConfirmDialog;