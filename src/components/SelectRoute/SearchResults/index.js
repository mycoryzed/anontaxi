import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const SearchEntry = ({ item, onItemSelected }) => (
  <TouchableOpacity
    style={ styles.SearchEntry }
    onPress={ () => onItemSelected(item) }
  >
    <Text>
      { item.fullText }
    </Text>
  </TouchableOpacity>
)

const SearchResults = ({ results, onItemSelected }) => (
  results.length !== 0 ?
    <View style={ styles.SearchResults }>
      {
        results.map(item =>
          <SearchEntry
            key={ item.placeID }
            item={ item }
            onItemSelected={ onItemSelected }
          />
        )
      }
    </View> :
    null
)

export default SearchResults;
