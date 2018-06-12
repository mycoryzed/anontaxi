import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import styles from './styles';

const SearchInput = ({ style, text, onChangeText, ...rest }) => {
  const { SearchInput } = styles;
  const combinedStyles = StyleSheet.flatten([ SearchInput, style ]);

  return (
    <TextInput
      style={ combinedStyles }
      onChangeText={ (text) => onChangeText(text) }
      value={ text }
      underlineColorAndroid='rgba(0,0,0,0)'
      { ...rest }
    />
  )
}

export default SearchInput;
