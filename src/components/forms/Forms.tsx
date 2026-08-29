import React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  children: React.ReactNode;
}

const Form = ({ title, children, className = "", ...rest }: FormProps) => {
  return (
    <form className={`border border-stone-200 p-6 mb-7 ${className}`} {...rest}>
      {title && <div className="font-serif text-lg mb-5">{title}</div>}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">{children}</div>
    </form>
  );
};

export default Form;
