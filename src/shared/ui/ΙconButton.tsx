import type {IconButtonProps} from '../types/types';

const IconButton =( {
                    onClick,
                    disabled = false,
                    icon,
                    addClasses = ' ',
                    type = 'button',

                } : IconButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`opacity-90 hover:opacity-100 cursor-pointer
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${addClasses}`}

        >
            {icon}
        </button>
    );


};

export default IconButton;