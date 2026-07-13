interface PageTitleProps {
    title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
    return (
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
        </h2>
    );
};

export default PageTitle;