import React from 'react';
import style from './SelectInputField.module.css';

interface SelectInputFieldProps {
  label: string;
  name: string;
  value: string | number;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClear?: () => void;
}

const SelectInputField: React.FC<SelectInputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onClear,
  options,
}) => {
  return (
    <div className={style.inputField}>
      <div className={style.orderContainer}>
        <label className={style.label} htmlFor={name}>
          {label}:
        </label>
        <div className={style.deleteContainer}>
          {value && (
            <button className={style.deleteBtn} onClick={onClear}>
              X
            </button>
          )}
        </div>
      </div>
      <select className={style.input} id={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInputField;
