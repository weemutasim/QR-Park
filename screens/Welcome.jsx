import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'

import {COLORS, SIZES} from './component/Themes';
import {Slides} from './component/Slides';

const Welcome = ({ navigation }) => {
  const renderSlide = ({item}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.imageTitle}>{item.title}</Text>
        <Image style={styles.imageStyle} source={item.image} />
        <Text style={styles.imageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <AppIntroSlider
        data={Slides}
        renderItem={renderSlide}
        dotStyle={styles.inactiveBullet}
        activeDotStyle={styles.activeBullet}
        showSkipButton={true}
        renderSkipButton={() => <Text style={styles.skipButton}>Skip</Text>}
        renderDoneButton={() => <Text style={styles.doneButton}>Sign up</Text>}
        onDone={() => navigation.navigate('Regis')}
      />
    </View>
  );
}

export default Welcome

const styles = StyleSheet.create({
  imageTitle: {
    paddingTop: '40%',
    margin: 20,
    fontSize: SIZES.h1,
    color: COLORS.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageStyle: {
    width: 265,
    height: 149,
    paddingTop: '50%',
  },
  slide: {
    width: SIZES.width,
    height: SIZES.height,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  imageText: {
    textAlign: 'center',
    fontSize: SIZES.h2,
    color: 'black',
    marginHorizontal: 40,
    marginVertical: 30,
    color: COLORS.black,
  },
  skipButton: {
    color: COLORS.grey,
    fontSize: SIZES.h2,
    margin: 10,
    marginLeft: 20,
  },
  doneButton: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: SIZES.h2,
    marginRight: 20,
    margin: 10
  },
  activeBullet: {
    backgroundColor: COLORS.blue,
    width: 25,
    height: 10,
    borderRadius: 5,
  },
  inactiveBullet: {
    backgroundColor: COLORS.grey,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});