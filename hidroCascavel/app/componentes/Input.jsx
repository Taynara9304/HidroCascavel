import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

/**
 * Componente reutilizável de Input com label flutuante (Outlined)
 *
 * Props:
 * - label: string → texto do label
 * - value: string → valor do input
 * - onChangeText: function → callback para alterar valor
 * - placeholder: string → texto placeholder
 * - keyboardType: string → tipo de teclado (ex: 'default', 'email-address', 'numeric')
 * - secureTextEntry: boolean → para senhas
 * - style: objeto opcional para estilos extras
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
}) => {
  return (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      outlineColor="#2685BF"
      activeOutlineColor="#2685BF"
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});

export default Input;
