import { X } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
}

const MobileSidebar = ({
    open,
    onClose,
}: Props) => {

    if (!open) return null;

    return (
        <>
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40"
            />

            <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-white shadow-xl dark:bg-slate-950">

                <div className="flex items-center justify-between border-b p-5">

                    <h2 className="text-xl font-bold">
                        ProcureFlow
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>

                </div>

                <div className="p-5">
                    Sidebar goes here...
                </div>

            </aside>
        </>
    );
};

export default MobileSidebar;
