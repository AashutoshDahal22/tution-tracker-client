import React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  children: React.ReactNode;
}

const Form = ({ title, children, className = "", ...rest }: FormProps) => {
  return (
    <form
      className={`border border-stone-200 p-4 sm:p-6 mb-6 sm:mb-7 ${className}`}
      {...rest}
    >
      {title && (
        <div className="font-serif text-base sm:text-lg mb-4 sm:mb-5">
          {title}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 [&>*:last-child]:col-span-1 [&>*:last-child]:sm:col-span-2">
        {children}
      </div>
    </form>
  );
};

export default Form;
