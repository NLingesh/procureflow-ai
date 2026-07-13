interface BreadcrumbProps {
    items: string[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            {items.map((item, index) => (
                <span key={index}>
                    {item}
                    {index !== items.length - 1 && " / "}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumb;