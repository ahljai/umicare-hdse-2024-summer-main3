import React from 'react';

interface SelectProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ id, value, onChange, children }) => (
  <select id={id} value={value} onChange={onChange} className="form-select">
    {children}
  </select>
);
