import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TextInput } from 'react-native-paper';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleContainerPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <TextInput
        ref={inputRef}
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dense={false}
        selectionColor="#2685BF"
      />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});

export default Input;