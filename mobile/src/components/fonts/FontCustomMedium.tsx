import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FontCustomMedium = (props: any) => {
  return (
    <Text 
      {...props} 
      style={[styles.defaultFont, props.style]} 
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Poppins_500Medium', 
    fontSize: 14,
  },
});

export default FontCustomMedium;