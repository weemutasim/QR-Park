import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, db} from '../firebase/firebaseConfig';
import {ref, set} from 'firebase/database';

const Regis = ({navigation}) => {
  const [ShowPassword, setShowPassword] = useState(true);

  const [name, setName] = useState('');
  const [surename, setSurename] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const RegisterUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      navigation.navigate('Operation_Screen');
      // Alert.alert('Registration Successful');
      console.log(`User with email ${user.email} has been registered.`);

      const userId = auth.currentUser.uid;
      set(ref(db, 'users/' + userId), {
        name: name,
        lastname: surename,
        username: userName,
        email: email,
        password: password,
      })
        .then(() => {
          console.log('write history complete!');
        })
        .catch(error => {
          console.error('Error written documents: ', error);
        });
    } catch (error) {
      console.log(error.message);
      console.log(error.code);
      Alert.alert('Registration Failed');
    }
  };

  return (
    <View style={{height: '100%', paddingTop: 100, backgroundColor: 'white'}}>
      <Text
        style={{
          fontSize: 24,
          color: 'black',
          marginHorizontal: 50,
          fontWeight: 'bold',
        }}>
        Get Started
      </Text>
      <Text style={{fontSize: 13, marginHorizontal: 50, paddingBottom: 40}}>
        Let's create your account!
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={name => setName(name)}
        value={name}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={surename => setSurename(surename)}
        value={surename}
        placeholder="Surename"
      />
      <TextInput
        style={styles.input}
        onChangeText={email => setEmail(email)}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={userName => setUserName(userName)}
        value={userName}
        placeholder="User Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={password => {
          setPassword(password);
        }}
        value={password}
        placeholder="Password"
        secureTextEntry={ShowPassword}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!ShowPassword)}
        style={styles.eye}>
        {ShowPassword == true ? (
          <Icon name="eye-with-line" size={30} color={'#BEBEBE'} />
        ) : (
          <Icon name="eye" size={30} color={'#BEBEBE'} />
        )}
      </TouchableOpacity>
      <View style={{alignItems: 'center', paddingTop: 40}}>
        <TouchableOpacity onPress={RegisterUser} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 5,
          }}>
          <Text style={{fontSize: 14, color: '#000000'}}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{fontSize: 14, color: '#000000', fontWeight: 'bold'}}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 0.5,
    padding: 15,
    fontSize: 16,
    marginTop: 20,
    borderRadius: 50,
    marginHorizontal: 30,
  },
  eye: {
    position: 'absolute',
    right: 50,
    paddingTop: 540,
  },
  button: {
    backgroundColor: '#097AFF',
    paddingVertical: 20,
    width: '80%',
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 16,
    marginHorizontal: 30,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Regis;
