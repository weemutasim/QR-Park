import {View, Text, TouchableOpacity, Alert, Keyboard} from 'react-native';
import React, { useState} from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, db} from '../firebase/firebaseConfig';
import {ref, set} from 'firebase/database';

import {COLORS} from './component/Themes';
import Input from './component/Input';
import Button from './component/Button';
import Loader from './component/Loader';

const Regis = ({navigation}) => {
  const [inputs, setInputs] = useState({
    email: '',
    fullname: '',
    lastname: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!inputs.fullname) {
      handleError('Please input fullname', 'fullname');
      isValid = false;
    }

    if (!inputs.lastname) {
      handleError('Please input lastname', 'lastname');
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
      register();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const register = async () => {
    setLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password,
      );
      if (userCredential) {
        const userId = auth.currentUser.uid;
        set(ref(db, 'users/' + userId), {
          fullname: inputs.fullname,
          lastname: inputs.lastname,
          email: inputs.email,
          password: inputs.password,
        })
          .then(() => {
            console.log('write history complete!');
          })
          .catch(error => {
            console.error('Error written documents: ', error);
          });
        navigation.navigate('Operation_Screen');

      } else {
        Alert.alert('เข้าสู้ระบบผิดพลาด', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', [{text: 'ตกลง'}]);
      }
    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('เข้าสู้ระบบผิดพลาด', 'อีเมลถูกใช้งานแล้ว', [{text: 'ตกลง'}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{backgroundColor: COLORS.white, flex: 1}}>
      <Loader visible={loading} />
      <View style={{paddingTop: 30, paddingHorizontal: 30}}>
        <Text style={{color: COLORS.black, fontSize: 25, fontWeight: 'bold'}}>
          Get Started
        </Text>
        <Text style={{color: COLORS.grey, fontSize: 18}}>
          Let's create your account!
        </Text>
        <View style={{marginVertical: 40}}>
          <Input
            onChangeText={text => handleOnchange(text, 'fullname')}
            onFocus={() => handleError(null, 'fullname')}
            iconName="account-outline"
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.fullname}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'lastname')}
            onFocus={() => handleError(null, 'lastname')}
            iconName="account-outline"
            label="Last Name"
            placeholder="Enter your lastname"
            error={errors.lastname}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
          <Button title="Register" onPress={validate} />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14, color: '#000000'}}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{fontSize: 14, color: '#000000', fontWeight: 'bold'}}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Regis;
