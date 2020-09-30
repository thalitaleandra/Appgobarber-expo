import React, { useRef, useCallback, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Container, TextInput, Icon } from './styles'
import { TextInputProps } from 'react-native'
import { useField } from '@unform/core';
interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}
interface InputValueReference {
  value: string;

}

interface InputRef {
  focus(): void;
}
const Input: React.RefForwardingComponent<InputRef, InputProps> = ({ name, icon, ...rest }, ref, ) => {
  const inputElementRef = useRef<any>(null);
  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const InputValueRef = useRef<InputValueReference>({ value: defaultValue })
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, [])
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!InputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    }
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: InputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputElementRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value })
      },
      clearValue() {
        inputElementRef.current.value = '';
        inputElementRef.current.clear();
      }
    })
  }, [fieldName, registerField])

  return (
    <Container isFocused={isFocused} isErrored={!!error}>
      <Icon name={icon} size={20} color={isFocused || isFilled ? '#ff9000' : '#666360'} />
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={(value) => {
          InputValueRef.current.value = value;
        }}
        {...rest} />
    </Container>


  )
}

export default forwardRef(Input);
