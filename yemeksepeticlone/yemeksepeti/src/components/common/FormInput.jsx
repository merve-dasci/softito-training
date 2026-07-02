import React from 'react';

const FormInput = React.memo(({ label, id, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
  return (
    <div className="text-left w-full">
      {label && (
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5" htmlFor={id}>
          {label} {required && <span className="text-[#B83246]">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#0B0B0F] border border-[#2e303a] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7A1E2C] transition-colors duration-200"
        {...props}
      />
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
