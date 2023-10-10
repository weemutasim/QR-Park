import {Text, View, Keyboard, Alert, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {auth} from '../firebase/firebaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';

import {COLORS} from './component/Themes';
import Button from './component/Button';
import Input from './component/Input';
import Loader from './component/Loader';

const Login = ({navigation}) => {
  const [inputs, setInputs] = useState({email: '', password: ''});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (inputs.password.length < 6) {
      handleError('Min password length of 6', 'password');
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const login = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password,
      );
      if (userCredential) {
        navigation.navigate('Operation_Screen');
      } else {
        Alert.alert('เข้าสู้ระบบผิดพลาด', 'ไม่พบผู้ใช้', [{text: 'ตกลง'}]);
      }
    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('เข้าสู้ระบบผิดพลาด', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', [
        {text: 'ตกลง'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{backgroundColor: COLORS.white, flex: 1}}>
      <Loader visible={loading} />
      <View style={{paddingTop: 100, paddingHorizontal: 30}}>
        <Text
          style={{
            color: COLORS.black,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Welcome,
        </Text>
        <Text
          style={{
            color: COLORS.black,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Glad to see you!
        </Text>
        <View style={{marginVertical: 20, paddingTop: 30}}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={{
                color: COLORS.black,
                paddingLeft: '60%',
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingTop: 110}}>
          <Button title="Log In" onPress={validate} />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 14, color: '#000000'}}>
          Don't have an account ?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Regis')}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
            Sign Up{' '}
          </Text>
        </TouchableOpacity>
        <Text style={{fontSize: 14, color: '#000000'}}>Now</Text>
      </View>
    </View>
  );
};

export default Login;
