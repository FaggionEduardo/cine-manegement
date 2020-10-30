// arquivo do input de arquivo retirado da documentação do unform adaptado para foto de perfil 
import React, { ChangeEvent, useRef, useEffect, useCallback, useState }  from 'react';
import Photo from "../../assets/svgs/cam.svg";
import { useField } from '@unform/core';
import "./file.css"


const ImageInput= ({ name,imgLink, ...rest }) => {
  const inputRef = useRef(null);

  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [preview, setPreview] = useState(defaultValue);

  const handlePreview = useCallback((e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
    }

    const previewURL = URL.createObjectURL(file);

    setPreview(previewURL);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]',
      clearValue(ref) {
        ref.value = '';
        setPreview(null);
      },
      setValue(_, value) {
        setPreview(value);
      }
    })
  }, [fieldName, registerField]);

  return (
    <>
    <label htmlFor="file" >
      { preview ? <img src={preview} alt="Preview" className="previewPerfil" />:<img className="previewPerfil" src={imgLink}></img> }
     
      <input
      id="file"
        type="file"
        ref={inputRef}
        onChange={handlePreview}
        {...rest}
        style={{display:'none'}}
      />
      </label>
    </>
  );
};

export default ImageInput;