import React, {useState, useEffect} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ref, onValue, update, set} from 'firebase/database';
import {auth, db} from '../../firebase/firebaseConfig';
import {updateEmail} from 'firebase/auth';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Input from '../component/Input';
import Button from '../component/Button';
import {COLORS, SIZES} from '../component/Themes';

const ProfileScreen = ({navigation}) => {
  const [inputs, setInputs] = useState({fullname: '', lastname: '', email: ''});
  const [gets, setGets] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
      const userId = auth.currentUser.uid;
      const usersRef = ref(db, `/users/${userId}`);
      onValue(usersRef, snapshot => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const newInputs = {
              fullname: userData.fullname,
              lastname: userData.lastname,
              email: userData.email,
              img: userData.img
          };
          setGets(newInputs);
        } else {
          setGets({ name: null, lastname: null, email: null, img: null });
        }
      });
  }, [])

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

    if (isValid) {
      updateUser();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const updateUser = () => {
    const userId = auth.currentUser.uid;
    updateEmail(auth.currentUser, inputs.email)
      .then(() => {
        console.log('Email update', auth.currentUser);
        const usersRef = ref(db, `/users/${userId}`);
        const updatedUser = {
          fullname: inputs.fullname,
          lastname: inputs.lastname,
          email: inputs.email,
          img: selectedImage
        };
        update(usersRef, updatedUser)
          .then(() => {
            console.log('user has been updated successfully:', updatedUser);
          })
          .catch(error => {
            console.log('Error updating user:', error);
          });
        Alert.alert('อัปเดตสำเร็จ', 'ข้อมูลได้รับการอัปเดต', [
          {text: 'ตกลง', onPress: navigation.goBack()},
        ]);
      })
      .catch(error => {
        console.log(error);
        Alert.alert('อัปเดตไม่สำเร็จ', 'แนะนำให้คุณทำการอัปเดตใหม่');
      });
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 22,
      }}>
      <TouchableOpacity
        style={{paddingTop: 20}}
        onPress={() => navigation.goBack()}>
        <MaterialIcons
          name="arrow-back-ios-new"
          style={{fontSize: 25, color: COLORS.blue}}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: SIZES.h1,
          alignSelf: 'center',
          color: COLORS.black,
          fontWeight: 'bold',
          paddingTop: 20,
        }}>
        Edit Profile
      </Text>
      <View
        style={{
          alignItems: 'center',
          marginVertical: 22,
        }}>
        <TouchableOpacity onPress={openImagePicker} >
          {selectedImage ? (<Image
              source={{uri: selectedImage}}
              style={{
                height: 170,
                width: 170,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: COLORS.blue,
              }}
            />) : (  
            <Image
              source={{uri: gets.img}}
              style={{
                height: 170,
                width: 170,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: COLORS.blue,
              }}
            />) }
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 10,
            }}>
            <MaterialIcons
              onPress={handleCameraLaunch}
              name="photo-camera"
              style={{color: COLORS.black, fontSize: 32}}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Input
          label="Full Name"
          placeholder={gets.fullname}
          onChangeText={text => handleOnchange(text, 'fullname')}
          onFocus={() => handleError(null, 'fullname')}
          error={errors.fullname}
        />
        <Input
          label="Last Name"
          placeholder={gets.lastname}
          onChangeText={text => handleOnchange(text, 'lastname')}
          onFocus={() => handleError(null, 'lastname')}
          error={errors.lastname}
        />
        <Input
          label="Email"
          placeholder={gets.email}
          onChangeText={text => handleOnchange(text, 'email')}
          onFocus={() => handleError(null, 'email')}
          error={errors.email}
        />
      </View>
      <Button title="Update" onPress={validate} />
    </View>
  );
};

export default ProfileScreen;
