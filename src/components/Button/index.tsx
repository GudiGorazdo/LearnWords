import React from 'react';
import type { PropsWithChildren } from 'react';
import { Text, StyleSheet, TouchableNativeFeedback, View } from 'react-native';

export type IButtonProps = PropsWithChildren<{
  title: string,
  onPress: () => void,
}>;

export function Button({ title, onPress }: IButtonProps) {
  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableNativeFeedback onPress={handlePress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
		width: '100%',
    backgroundColor: 'blue',
    borderRadius: 8,
    padding: 10,
    overflow: 'hidden',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


