import React from 'react';

const FormSelect = React.memo(({ label, id, value, onChange, options = [], required = false, ...props }) => {
  return (
    <div className="text-left w-full">
      {label && (
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5" htmlFor={id}>
          {label} {required && <span className="text-[#B83246]">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-[#0B0B0F] border border-[#2e303a] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7A1E2C] transition-colors duration-200"
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
