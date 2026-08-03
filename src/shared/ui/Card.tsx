interface CardProps {

    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const Card =({ children, onClick, className = ''} : CardProps) => {

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-x1 shadow -sm border border-gray-100 p-6 transition-all duration-300 ${className}`}

        >
            {children}
        </div>
    );
};

export default Card;
