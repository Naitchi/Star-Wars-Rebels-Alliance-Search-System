import React from 'react';

import style from './TextInputField.module.css';

interface TextInputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onOrderChange?: () => void;
  orderBy?: { field: string | null; order: boolean };
  placeholder?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  name,
  value,
  orderBy,
  onChange,
  onClear,
  onOrderChange,
  placeholder,
}) => {
  return (
    <div className={style.inputField}>
      {orderBy && (
        <button className={orderBy.field === name ? style.activate : ''} onClick={onOrderChange}>
          {orderBy.field === name ? '' : '⇅'}
          {orderBy.field === name && (orderBy.order ? '↧' : '↥')}
        </button>
      )}
      <label className={style.label} htmlFor={name}>
        {label}:
      </label>
      <input
        className={style.input}
        type="text"
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value && (
        <button className={style.deleteBtn} onClick={onClear}>
          X
        </button>
      )}
    </div>
  );
};

export default TextInputField;
