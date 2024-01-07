import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../styles/themeLight';

import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface IInputProps {
  ref?: any;
  onLayout?: () => void;
  onChangeText: (text: string) => void;
  label?: string;
  value?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: any;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  icon?: {
    front?: boolean,
    type: string,
    style?: object,
    onPress?: () => void,
  },
}

export function Input({
  label,
  value,
  placeholder,
  style,
  focusedStyle,
  multiline,
  numberOfLines,
  icon,
  disabled,
  onChangeText,
  onLayout,
}: IInputProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputTemplate = () => {
    return (
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onLayout={onLayout}
        editable={disabled}
        placeholderTextColor={theme.inputPlaceholder}
      />
    );
  }

  const pressIcon = () => {
    if (icon && icon.onPress) {
      icon.onPress();
    }
  }

  const getIcon = () => {
    if (!icon) return;
    return <Icon
      name={icon.type}
      size={16}
      style={[icon.style, { flexShrink: 1 }]}
      onPress={() => pressIcon()}
    />
  }

  const getInput = () => {
    return (
      <View style={[styles.inputRow]}>
        {icon && icon.front && getIcon()}
        <View
          style={[
            styles.inputStyle,
            multiline ? styles.textArea : styles.input,
            style,
            isFocused && styles.inputFocused,
            focusedStyle,
            styles.inputContainer,
          ]}
        >
          {inputTemplate()}
        </View>
        {icon && !icon.front && getIcon()}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}:</Text>}
      {getInput()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  input: {
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    color: theme.textColor,
  },

  inputContainer: {
    paddingBottom: 8,
    paddingTop: 8,
    justifyContent: 'center',
  },

  label: {
    marginBottom: 8,
    fontSize: 16,
    color: theme.textColor
  },

  inputRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputStyle: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    flexGrow: 1,
  },

  textArea: {
    minHeight: 40,
    paddingTop: 5,
  },

  inputFocused: {
    borderColor: 'blue',
  },
});


