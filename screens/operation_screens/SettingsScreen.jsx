import {View, Text, Alert, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import {auth} from '../../firebase/firebaseConfig';
import {signOut} from 'firebase/auth';

import Button from '../component/Button';
import { COLORS, SIZES } from '../component/Themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({navigation}) => {

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert('Logout Failed');
        console.log(error.message);
        console.log(error.code);
      })
  };

  const alertLogOut = () => {
    Alert.alert('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
      {
        text: 'ตกลง',
        onPress: () => logOut(),
      },
      {
        text: 'ยกเลิก'
      },
    ]);
  };

  const navigateToEditProfile = () => {
    navigation.navigate("ProfileScreen");
  };

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword')
  }

  const accountItems = [
    {
      icon: "person-outline",
      text: "Edit Profile",
      action: navigateToEditProfile,
    },
    {
      icon: "password",
      text: "Change Password",
      action: navigateToChangePassword,
    },
    {
      icon: "privacy-tip",
      text: "Privacy",
      // action: console.log('test'),
    }
  ];

  const supportItems = [
    {
      icon: "credit-card",
      text: "My Subscription",
      // action: console.log('test'),
    },
    { 
      icon: "help-outline",
      text: "Help & Support",
      // action: console.log('test') 
    },
    {
      icon: "info-outline",
      text: "Terms and Policies",
      // action: console.log('test'),
    },
  ];

  const renderSettingsItem = ({ icon, text, action }) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
        backgroundColor: COLORS.gray,
      }}>
      <MaterialIcons name={icon} size={SIZES.h1} color={COLORS.black} />
      <Text
        style={{
          marginLeft: 36,
          fontSize: SIZES.h2,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  // let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <View
        style={{
          marginHorizontal: 12,
          alignItems: 'center',
          justifyContent: "center",
          paddingTop: '15%',
          paddingBottom: '10%'
        }}>
        <Text style={{ fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.black }}>Settings</Text>
      </View>

      <View style={{ marginHorizontal: 12 }}>
        {/* Account Settings */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: SIZES.h3, marginVertical: 10, paddingLeft: 20, color: COLORS.black }}>Account</Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: COLORS.light,
              paddingLeft: 20
            }}>
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Support and About settings */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: SIZES.h3, marginVertical: 10, paddingLeft: 20, color: COLORS.black }}>Support & About</Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: COLORS.light,
              paddingLeft: 20
            }}>
            {supportItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Cache & Cellular */}
        {/* <View style={{ marginBottom: 12 }}>
          <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
            Cache & Cellular{" "}
          </Text>
          <View
            style={{
              borderRadius: 12,
              backgrounColor: COLORS.gray,
            }}
          >
            {cacheAndCellularItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View> */}

        {/* Actions Settings */}

        {/* <View style={{ marginBottom: 12 }}>
          <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Actions</Text>
          <View
            style={{
              borderRadius: 12,
              backgrounColor: COLORS.gray,
            }}
          >
            {actionsItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View> */}
        <View style={{paddingHorizontal: 30, paddingTop: '30%'}}>
          <Button title="Log Out" onPress={alertLogOut} />
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
