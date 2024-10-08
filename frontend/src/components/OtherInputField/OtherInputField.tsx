import React from 'react';

import style from './OtherInputField.module.css';

interface OtherInputFieldProps {
  label: string;
  name: string;
  operateur: string;
  type: 'date' | 'number';
  value?: string | number;
  max?: number;
  min?: number;
  orderBy?: { field: string | null; order: boolean };
  onOperateurChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderChange?: () => void;
  onClear: () => void;
}

// Composant réutilisable pour Input Date et Number

const OtherInputField: React.FC<OtherInputFieldProps> = ({
  label,
  name,
  operateur,
  type,
  value,
  min,
  max,
  orderBy,
  onOperateurChange,
  onOrderChange,
  onDateChange,
  onClear,
}) => {
  return (
    <div className={style.inputField}>
      <div className={style.orderContainer}>
        {orderBy && (
          <button className={orderBy.field === name ? style.activate : ''} onClick={onOrderChange}>
            {orderBy.field === name ? '' : '⇅'}
            {orderBy.field === name && (orderBy.order ? '↧' : '↥')}
          </button>
        )}
        <label className={style.label} htmlFor={name}>
          {label}:
        </label>
        <div className={style.deleteContainer}>
          {value && (
            <button onClick={onClear} className={style.deleteBtn}>
              X
            </button>
          )}
        </div>
      </div>
      <div className={style.inputContainer}>
        <select
          className={style.select}
          value={operateur}
          onChange={onOperateurChange}
          name="operateur"
        >
          <option value="<">&lt;</option>
          <option value=">">&gt;</option>
          <option value="=">=</option>
          <option value="<=">&lt;=</option>
          <option value=">=">&gt;=</option>
        </select>
        <input
          className={style.input}
          min={min ?? 0}
          max={max ?? undefined}
          type={type}
          id={name}
          value={value ?? ''}
          onChange={onDateChange}
        />
      </div>
    </div>
  );
};

export default OtherInputField;
