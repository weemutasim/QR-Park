import {
  StyleSheet,
  Text,
  View,
  Alert,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {auth} from '../firebase/firebaseConfig';
import {sendPasswordResetEmail} from 'firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Input from './component/Input';
import Button from './component/Button';
import {COLORS, SIZES} from './component/Themes';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleForgetPassword = () => {
    console.log(email);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          'การจัดส่งอีเมล',
          'ระบบได้จัดส่งอีเมลรีเซ็ตรหัสผ่านเรียบร้อยแล้ว',
        );
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        Alert.alert('การจัดส่งอีเมล', 'อีเมลไม่ถูกต้อง');
      });
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (isValid) {
      handleForgetPassword();
    }
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <View style={{backgroundColor: COLORS.white, flex: 1}}>
      <TouchableOpacity
        style={{paddingTop: 20, left: 15}}
        onPress={() => navigation.goBack()}>
        <MaterialIcons
          name="arrow-back-ios-new"
          style={{fontSize: 25, color: COLORS.blue}}
        />
      </TouchableOpacity>
      <Text style={{fontSize: SIZES.h1, color: COLORS.black, alignSelf: 'center', top: '10%', fontWeight: 'bold'}}>Reset Password</Text>
      <View
        style={{
          marginVertical: 20,
          paddingTop: '30%',
          paddingHorizontal: 30,
        }}>
        <Input
          label="Email"
          placeholder="Enter your email address"
          onChangeText={email => setEmail(email)}
          error={errors.email}
          onFocus={() => handleError(null, 'email')}
        />
        <Button title="Submit" onPress={validate} />
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({});
