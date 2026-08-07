import  * as React from 'react';
export  type ButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    label: string;
    addClasses?: string;
    type?: 'button' | 'submit' | 'reset';
};

export type IconButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    addClasses?: string;
    type?: 'button' | 'submit' | 'reset';

};

export type LayoutProps = {
    children: React.ReactNode;
};

export type InputProps = {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    addClasses?: string;
    required?: boolean;
    name?: string;
};
