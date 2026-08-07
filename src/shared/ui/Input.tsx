import { forwardRef} from 'react';
import type { InputProps } from '../types/types';

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type = 'text',
            placeholder,
            onChange,
            value,
            error,
            addClasses = '',
            required = false,
            name,
        },
        ref
    ) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    name={name}
                    value={value}
                    required={required}
                    className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-pink-300 transition-colors ${error ?
                        'border-red-400' : 'border-gray-200'} ${addClasses}`}
                />
                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
