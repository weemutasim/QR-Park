import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { storage } from '../firebase/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const SplashFast = ({ navigation }) => {
  const [imageUrl, setImageUrl] = useState('gs://car-parking-qr-45c2a.appspot.com');
  
  useEffect(() => {
    const storageRef = ref(storage, 'welcom/Fast.jpg');
    getDownloadURL(storageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการดึง URL ของรูปภาพ:', error);
      });
  }, []);

  return (
    <View style={style.container}>
      <View style={style.img}>
        <Image
          source={{uri: imageUrl}}
          style={{width: 265, height: 149}}
        />
      </View>
      <View style={{margin: 20, paddingTop: 30}}>
        <Text
          style={{
            fontSize: 24,
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Fast
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: 'black',
            marginHorizontal: 30,
            marginVertical: 30,
          }}>
          You can check the available parking spaces of the parking first, 
          so as not to waste time If the parking is full
        </Text>
      </View>
      <View
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 100, paddingRight: 20, paddingLeft: 20
          }}>
          <TouchableOpacity onPress={() => navigation.navigate("Regis")}
              style={{
              backgroundColor: '#FFFFFF',
              paddingVertical: 10,
              width: '30%',
              borderRadius: 20,

              }}>
            <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: '#000000'}}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
           onPress={() => navigation.navigate("Regis")}
            style={{
              backgroundColor: '#097AFF',
              paddingVertical: 10,
              width: '30%',
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
              Start
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: 'white',
    },
    img: {
      paddingTop: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default SplashFast