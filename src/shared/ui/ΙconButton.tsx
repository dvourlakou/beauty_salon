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
            className={`hover:opacity-100 
              transition-all duration-300 disabled:opacity-50 ${addClasses}`}

        >
            {icon}
        </button>
    );


};

export default IconButton;