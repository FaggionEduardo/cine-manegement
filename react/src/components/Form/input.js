// arquvo de input tipo texto retirado da documentação do unform 
import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import "./input.css"
export default function Input({ name,id, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
      <div>
  <input ref={inputRef} defaultValue={defaultValue} {...rest} /><br/>
  {error && <span className={id+"Error"}>{error}</span> }
  </div>

  );
}