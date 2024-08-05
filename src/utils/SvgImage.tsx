// utils/SvgImage.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg'; 

interface SvgImageProps {
  xml: string; 
  width?: number;
  height?: number;
}

const SvgImage: React.FC<SvgImageProps> = ({ xml, width = 24, height = 24 }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <SvgXml xml={xml} width={width} height={height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SvgImage;
