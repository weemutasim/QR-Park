import {View, Text, Alert} from 'react-native';
import React from 'react';
// import QRCode from 'react-native-qrcode-svg'
import Icon from 'react-native-vector-icons/FontAwesome';
import {auth} from '../../firebase/firebaseConfig';
import {signOut} from 'firebase/auth';
// import Svg, { Circle, Rect } from 'react-native-svg';

const SettingsScreen = ({navigation}) => {
  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
        // Alert.alert('Logout Successful');
        //console.log( `he user with the email ${user.email} has been logged out.`);
      })
      .catch(error => {
        Alert.alert('Logout Failed');
        console.log(error.message);
        console.log(error.code);
      });
  };

  const alertLogOut = () => {
    Alert.alert('Confirm', 'Logout?', [
      {
        text: 'Yes',
        onPress: () => logOut(),
      },
      {
        text: 'No',
      },
    ]);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 26, fontWeight: 'bold'}}>SettingsScreen</Text>
      {/* <QRCode value='https://www.youtube.com/watch?v=mA3eC9YnhsU' /> */}
      <Icon
        style={{position: 'absolute', top: 15, right: 10, padding: 10}}
        onPress={alertLogOut}
        name="sign-out"
        size={40}
        color={'#BEBEBE'}></Icon>

      {/* <Svg height="100" width="100">
        <Rect width="80" height="80" stroke="red" strokeWidth="2" fill="yellow" />
      </Svg> */}
    </View>
  );
};

export default SettingsScreen;
