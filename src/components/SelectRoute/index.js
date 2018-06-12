import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';

import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import OrderButton from './OrderButton';
import styles from './styles';

const AVAILABLE_INPUTS = {
  NONE: 'none',
  FROM: 'from',
  TO: 'to'
}

class SelectRoute extends React.Component {
  state = {
    predictions: [],
    currentPositionRegion: null,

    fromText: '',
    fromPosition: null,
    fromPlaceID: '',
    fromPlaceAddress: '',

    toText: '',
    toPosition: null,
    toPlaceID: '',
    toPlaceAddress: '',

    focusedInput: AVAILABLE_INPUTS.NONE
  }

  onChangeText = (text) => {
    if (this.state.focusedInput === AVAILABLE_INPUTS.FROM)
      this.setState({ fromText: text });

    else if (this.state.focusedInput === AVAILABLE_INPUTS.TO)
      this.setState({ toText: text });

    this.doSearchWithThrottling(text, 500);
  }

  doSearchWithThrottling = (text, timeout) => {
    if (this.searchTimeoutID)
      clearTimeout(this.searchTimeoutID);

    this.searchTimeoutID = setTimeout(this.doSearch, timeout);
  }

  doSearch = () => {
    if (this.state.focusedInput === AVAILABLE_INPUTS.NONE)
      return;

    let term = '';

    if (this.state.focusedInput === AVAILABLE_INPUTS.FROM)
      term = this.state.fromText;

    else if (this.state.focusedInput === AVAILABLE_INPUTS.TO)
      term = this.state.toText;

    RNGooglePlaces.getAutocompletePredictions(term)
      .then((results) => this.setState({ predictions: results }))
      .catch((error) => console.log(error.message));
  }

  onItemSelected = (item) => {
    if (this.state.focusedInput === AVAILABLE_INPUTS.FROM)
      this.setState(
        {
          fromText: item.primaryText,
          fromPlaceID: item.placeID,
          fromPlaceAddress: item.placeAddress,
          predictions: []
        },
        () => {
          console.log(this.state);
          this.setMarker(item.placeID, AVAILABLE_INPUTS.FROM);
        }
      );

    else if (this.state.focusedInput === AVAILABLE_INPUTS.TO)
      this.setState(
        {
          toText: item.primaryText,
          toPlaceID: item.placeID,
          toPlaceAddress: item.placeAddress,
          predictions: []
        },
        () => {
          console.log(this.state);
          this.setMarker(item.placeID, AVAILABLE_INPUTS.TO);
        }
      );
  }

  markFocusedInput = (input) => {
    this.setState({ focusedInput: input })
  }

  setMarker = (placeID, input) => {
    RNGooglePlaces.lookUpPlaceByID(placeID)
      .then((result) => {
        console.log('Marker info', result);
        if (Object.keys(result).length === 0)
          return

        const position = {
          latitude: result.latitude,
          longitude: result.longitude
        }

        if (this.state.focusedInput === AVAILABLE_INPUTS.FROM)
          this.setState({ fromPosition: position }, () => {
            this.setCurrentPositionRegion(result.latitude, result.longitude);
            // this.fitAllMarkers();
          });

        if (this.state.focusedInput === AVAILABLE_INPUTS.TO)
          this.setState({ toPosition: position }, () => this.fitAllMarkers());
      })
      .catch((error) => console.log(error.message));
  }

  componentWillMount() {
    this.autoSetCurrentPositionRegion();
  }

  autoSetCurrentPositionRegion = () => {
    RNGooglePlaces.getCurrentPlace()
    .then((results) => {
      if (results.length === 0)
        return;

      const result = results[0];
      this.setCurrentPositionRegion(result.latitude, result.longitude);
    })
    .catch((error) => console.log(error.message));
  }

  setCurrentPositionRegion = (latitude, longitude) => {
    this.setState({
      currentPositionRegion: {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.00121,
      }
    });
  }

  fitAllMarkers = () => {
    if (!this.state.fromPosition || !this.state.toPosition)
      return;
    this.map.fitToCoordinates([this.state.fromPosition, this.state.toPosition], {
      edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
      animated: true,
    });
  }

  render() {
    return (
      <View style={styles.Container}>
        {
          this.state.currentPositionRegion ?
            <MapView
              ref={ ref => { this.map = ref; }}
              style={styles.Map}
              region={ this.state.currentPositionRegion }
            >
              {
                this.state.fromPosition ?
                  <Marker
                    pinColor={ '#0d3d4d' }
                    coordinate={ this.state.fromPosition } />
                  : null
              }
              {
                this.state.toPosition ?
                  <Marker
                    pinColor={ '#329b85' }
                    coordinate={ this.state.toPosition } />
                  : null
              }
            </MapView>
            : null
        }

        <View style={ styles.SelectRoute }>
          <View style={ styles.SearchBox }>
            <SearchInput
              style={{ borderBottomColor: '#e5e5e5', borderBottomWidth: 1 }}
              placeholder='What is your location?'
              onChangeText={ this.onChangeText }
              onFocus={ () => this.markFocusedInput(AVAILABLE_INPUTS.FROM) }
              onBlur={ () => this.markFocusedInput(AVAILABLE_INPUTS.NONE) }
              text={ this.state.fromText }
            />
            <SearchInput
              placeholder='Where do you want to go?'
              onChangeText={ this.onChangeText }
              onFocus={ () => this.markFocusedInput(AVAILABLE_INPUTS.TO) }
              onBlur={ () => this.markFocusedInput(AVAILABLE_INPUTS.NONE) }
              text={ this.state.toText }
            />
          </View>
          <SearchResults results={ this.state.predictions } onItemSelected={ this.onItemSelected } />
        </View>
        {
          this.state.fromPosition && this.state.toPosition ?
            <OrderButton />
            : null
        }
      </View>
    )
  }
}

export default SelectRoute;
