import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FontCustomRegular = (props: any) => {
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
    fontFamily: 'Poppins_400Regular', 
    fontSize: 14,
  },
});

export default FontCustomRegular;