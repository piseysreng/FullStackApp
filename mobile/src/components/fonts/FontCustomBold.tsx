import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FontCustomBold = (props: any) => {
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
    fontFamily: 'Poppins_700Bold', 
    fontSize: 14,
  },
});

export default FontCustomBold;