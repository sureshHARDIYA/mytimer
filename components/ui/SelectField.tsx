import React from "react";
import Select from "react-select";
import styles from "./SelectField.module.scss";

interface SelectFieldProps {
  label: string;
  value: { value: string; label: string } | null;
  onChange: (option: { value: string; label: string } | null) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  isClearable?: boolean;
}

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  isClearable = true,
}: SelectFieldProps) => {
  return (
    <div className={styles.selectField}>
      <label className={styles.selectField__label}>{label}</label>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        isClearable={isClearable}
        className={styles.selectField__select}
        classNamePrefix="select-field"
      />
    </div>
  );
};

export default SelectField;
