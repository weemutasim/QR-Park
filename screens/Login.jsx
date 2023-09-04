import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const checkEmail = (text) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(text);
    setIsValidEmail(isValid);
  }

  const SingInUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      navigation.navigate('Operation_Screen');
      Alert.alert('Login Successful');
      console.log( `User with email ${user.email} has been logged in.`);

    } catch(error) {
      Alert.alert('Login Failed');
      console.log(error.message);
      console.log(error.code);
    }
  }

  return (
    <View style={{height: '100%', paddingTop: 100, backgroundColor: 'white'}}>
      <Text style={styles.text}>Glad to see you!</Text>
      <View style={{paddingTop: 50}}>
        <Text style={styles.lable}>Email Address</Text>
        {
          isValidEmail ? null : <Text style={{color: 'red', paddingLeft: 50}}>Email is not valid.</Text>
        }
        <TextInput
            style={styles.input}
            onChangeText={(text) => {setEmail(text), checkEmail(text)}}
            value={email}
            placeholder='Email Address'
            />
        <Text style={styles.lable}>Password</Text>
          
      <View style={{paddingTop: 5}}>
        <TextInput
        style={styles.input}
        onChangeText={(password => setPassword(password))}
        value={password}
        placeholder='Password'
        secureTextEntry={showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} 
            style={{position: 'absolute', right: 50, paddingTop: 30}}>
                {
                  showPassword == true ? (
                      <Icon  
                            name="eye-with-line" size={30} color={'#BEBEBE'}></Icon>
                  ) : (
                      <Icon 
                            name="eye" size={30} color={'#BEBEBE'}></Icon>
                  )
                }
        </TouchableOpacity>
      </View>  
        <TouchableOpacity> 
          <Text style={{color: '#000000', textAlign: 'right', paddingRight: 40}}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center', paddingTop: 170}}>
          <TouchableOpacity onPress={SingInUser}//() => navigation.navigate('Operation_Screen')}
            style={{
              backgroundColor: '#097AFF',
              paddingVertical: 20,
              width: '80%',
              borderRadius: 15,
            }}>
            <Text
              style={{
                fontSize: 20,
                marginHorizontal: 30,
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', display: 'flex', justifyContent: 'center', paddingTop: 5}}>
          <Text style={{fontSize: 14, color: '#000000'}}>Don't have an account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Regis')}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>Sign Up </Text>
          </TouchableOpacity>
          <Text style={{fontSize: 14, color: '#000000'}}>Now</Text> 
        </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center', 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#000000'
    },
    input: {
        borderWidth: 0.5,
        padding: 15,
        fontSize: 16,
        marginTop: 10,
        borderRadius: 50,
        marginHorizontal: 30,
        marginBottom: 10
    },
    lable: {
        fontSize: 16, 
        marginHorizontal: 40,
        color: '#000000'
    }
})

export default Login