import {StyleSheet} from 'react-native';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

const buttonBottomFreeze = StyleSheet.create({
  style: {
    position: 'absolute',
    right: 0,
    ...ifIphoneX({ bottom: getBottomSpace(), }, {bottom: 0}),
    width: '100%',
    borderRadius: 0,
  },
});

export default buttonBottomFreeze.style;
