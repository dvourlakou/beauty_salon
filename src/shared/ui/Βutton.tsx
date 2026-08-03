import type {ButtonProps} from '../types/types';

const Button =( {
    onClick,
    disabled = false,
    label,
    addClasses = ' ',
    type = 'button',

} : ButtonProps) => {
     return (
         <button
             type={type}
             onClick={onClick}
             disabled={disabled}
             className={`bg-cf-dark-gray opacity-90 hover:opacity-100 text-white px-4 py-2 
             rounded cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${addClasses}`}

            >
             {label}
         </button>
     );


};

export default Button;