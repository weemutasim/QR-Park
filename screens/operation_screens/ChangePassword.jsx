import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {updatePassword, reauthenticateWithCredential, EmailAuthProvider, signInWithEmailAndPassword, signInWithCredential } from 'firebase/auth';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, onValue, update, set} from 'firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Input from '../component/Input';
import Button from '../component/Button';
import {COLORS, SIZES} from '../component/Themes';

const ChangePassword = ({navigation}) => {
  const [inputs, setInputs] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.newPassword) {
      handleError('Please input new password', 'newPassword');
      isValid = false;
    } else if (inputs.newPassword.length < 6) {
      handleError('Min password length of 6', 'newPassword');
      isValid = false;
    }

    if (!inputs.confirmPassword) {
      handleError('Please input confirm password', 'confirmPassword');
      isValid = false;
    } else if (inputs.confirmPassword.length < 6) {
      handleError('Min password length of 6', 'confirmPassword');
      isValid = false;
    } else if (inputs.newPassword !== inputs.confirmPassword) {
      handleError('Password not matched', 'confirmPassword');
      isValid = false;
    }

    if (isValid) {
      ChangePassword();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  // const promptForCredentials = () => {
  //   const credential = auth.EmailAuthProvider.credential(email, inputs.confirmPassword);
  //   const provider = auth.EmailAuthProvider;
  //   const authCredential = provider.credential('6310210685@psu.ac.th', '123456');
  //   return auth.signInWithCredential(authCredential);
  // }


  // const reauthenticate = () => {
  //   const user = auth.currentUser;
  //   const credential = promptForCredentials();
  //   reauthenticateWithCredential(user, credential)
  //     .then(() => {
  //       // Alert.alert('อัปเดตไม่สำเร็จ', 'แนะนำให้คุณทำการเปลี่ยนรหัสผ่านใหม่');
  //       ChangePassword();
  //     })
  //     .catch(error => {
  //       Alert.alert('อัปเดตไม่สำเร็จ', 'แนะนำให้คุณทำการเปลี่ยนรหัสผ่านใหม่');
  //       console.log(error)
  //       console.log(error.message)
  //     });
  // };

  const ChangePassword = () => {
    const user = auth.currentUser;
    const userId = auth.currentUser.uid;
    updatePassword(user, inputs.confirmPassword)
      .then(() => {
        console.log('Update password successful.');

        const passwordRef = ref(db, `/users/${userId}`);
        const updatedPassword = {
          password: inputs.confirmPassword,
        };
        update(passwordRef, updatedPassword)
          .then(() => {
            console.log(
              'password has been updated successfully:',
              updatedPassword,
            );
          })
          .catch(error => {
            console.log('Error updating password:', error);
          });

        Alert.alert('อัปเดตสำเร็จ', 'คุณได้เปลี่ยนรหัสผ่านแล้ว', [
          {text: 'ตกลง', onPress: navigation.goBack()},
        ]);
      })
      .catch(error => {
        console.log('Error updating password:', error);
        Alert.alert('อัปเดตไม่สำเร็จ', 'แนะนำให้คุณทำการเปลี่ยนรหัสผ่านใหม่');
      });
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
      <Text
        style={{
          textAlign: 'center',
          fontSize: SIZES.h1,
          color: COLORS.black,
          paddingTop: '30%',
          fontWeight: 'bold',
        }}>
        Change Password
      </Text>
      <View
        style={{
          marginVertical: 20,
          paddingTop: '20%',
          paddingHorizontal: 30,
        }}>
        <Input
          onChangeText={text => handleOnchange(text, 'newPassword')}
          onFocus={() => handleError(null, 'newPassword')}
          label="New password"
          placeholder="Enter your new password"
          error={errors.newPassword}
        />
        <Input
          onChangeText={text => handleOnchange(text, 'confirmPassword')}
          onFocus={() => handleError(null, 'confirmPassword')}
          label="Confirm password"
          placeholder="Enter your confirm password"
          error={errors.confirmPassword}
          password
        />
        <Button title="Submit" onPress={validate} />
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
