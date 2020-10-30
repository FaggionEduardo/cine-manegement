// arquivo do input retirado do unform adaptado para select 
import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

export default function Select({ name, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return <select ref={inputRef} defaultValue={defaultValue} {...rest} />;
}