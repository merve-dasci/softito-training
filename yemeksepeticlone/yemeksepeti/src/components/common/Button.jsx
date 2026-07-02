import React from 'react';

const Button = React.memo(({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, className = '', ...props }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#7A1E2C] hover:bg-[#B83246] text-white border border-transparent';
      case 'secondary':
        return 'bg-[#17171C] hover:bg-gray-800 text-gray-300 border border-[#2e303a]';
      case 'danger':
        return 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20';
      case 'outline':
        return 'bg-transparent hover:bg-[#7A1E2C] text-white border border-[#7A1E2C]';
      default:
        return 'bg-[#7A1E2C] hover:bg-[#B83246] text-white border border-transparent';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-md font-semibold';
      case 'md':
        return 'px-5 py-2.5 text-sm rounded-lg font-semibold';
      case 'lg':
        return 'px-8 py-3.5 text-base rounded-xl font-bold';
      default:
        return 'px-5 py-2.5 text-sm rounded-lg font-semibold';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
