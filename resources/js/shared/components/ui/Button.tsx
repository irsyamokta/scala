import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({
    type = 'button',
    className = '',
    variant = 'primary',
    disabled,
    children,
    ...props
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
        primary: 'border border-transparent bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700 focus:ring-indigo-500 active:bg-gray-900',
        secondary: 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-indigo-500 disabled:opacity-25',
        danger: 'border border-transparent bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 active:bg-red-700',
    };

    return (
        <button
            {...props}
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-25' : ''} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}