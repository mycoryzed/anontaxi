import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const OrderButton = () => (
  <View style={{ position: "absolute", zIndex: 1000, bottom: 50, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#329b84', borderRadius: 10, paddingLeft: 40, paddingRight: 40, paddingTop: 20, paddingBottom: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}>Order</Text>
    </TouchableOpacity>
  </View>
)

export default OrderButton;
