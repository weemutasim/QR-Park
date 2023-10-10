import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, set, onValue, update} from 'firebase/database';

import {IdContext} from '../../App';

const QRScreen = ({navigation}) => {
  const {adminKey} = useContext(IdContext);

  const [data, setData] = useState('');
  const [maximumPark, setMaximumPark] = useState(0);
  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);
  const [timeIn, setTimeIn] = useState(new Date());
  const [dateFrom, setDateFrom] = useState(new Date());
  const [status, setStatus] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, 'history/' + adminKey + userId);
    onValue(historyRef, snapshot => {
      if (snapshot.exists()) {
        const history = snapshot.val();
        setStatus(history.Status);
      } else {
        setStatus(null);
      }
    });
  }, []);

  useEffect(() => {
    const settingRef = ref(db, '/setting');
    onValue(settingRef, snapshot => {
      if (snapshot.exists()) {
        const settingData = snapshot.val();
        setMaximumPark(settingData.capacity);
        // console.log('setting >>>>', setting);
      } else {
        setMaximumPark(null);
      }
    });
  }, []);

  const isCount = () => {

      const settingRef = ref(db, '/setting'); // เปลี่ยนเป็น '/setting'
      update(settingRef, { setCount (count + 1) })
        .then(() => {
          // อัพเดตสำเร็จ
        })
        .catch((error) => {
          console.error('เกิดข้อผิดพลาดในการอัพเดตค่า count:', error);
        });

  }

  const check = admindata => {
    let key;
    const adminRef = ref(db, '/admin');
    onValue(adminRef, snapshot => {
      const admin = snapshot.val();
      for (key of Object.keys(admin)) {
        if (key.startsWith(admindata)) {
          // console.log(`NO As: ${key}`);
        }
      }
    });
    return key;
  };

  const qrcodeRead = event => {
    let isScann = false;
    setData(event.data);
    let isvalid = check(event.data);
    if (event.data === isvalid && count < maximumPark) {
      if ((!isScann && !status) || (!isScann && status === 'out')) {
        const currentTime = new Date();
        setDateFrom(currentTime);
        setTimeIn(currentTime);
        writeData();
        isCount();
        // writeDataAdmin();
        navigation.navigate('Details');
        isScann = true;
      } else {
        Alert.alert('กำลังใช้งาน...', 'คุณได้สแกนแล้ว!');
      }
    } else {
      console.log('Wrong QR code');
      Alert.alert('คิวอาร์โค้ดไม่ถูกต้อง!', 'โปรดลองใหม่อีกครั้ง');
    }
  };

  const writeData = () => {
    const userId = auth.currentUser.uid;
    if (status === 'out') {
      const userId = auth.currentUser.uid;
      const historyRef = ref(db, 'history/' + data + userId);
      const updatedHistory = {
        HisDate: dateFrom.toLocaleDateString(),
        InTime: timeIn.toLocaleTimeString(),
        OutTime: '',
        Status: 'in',
        Money: 0,
        Uid: data + userId,
      };
      update(historyRef, updatedHistory)
        .then(() => {
          console.log('Data has been updated successfully:', updatedHistory);
        })
        .catch(error => {
          console.log('Error updating data:', error);
        });
    } else {
      set(ref(db, 'history/' + data + userId), {
        HisDate: dateFrom.toLocaleDateString(),
        InTime: timeIn.toLocaleTimeString(),
        OutTime: '',
        Status: 'in',
        Money: 0,
        Uid: data + userId,
      })
        .then(() => {
          console.log('write history complete!');
        })
        .catch(error => {
          console.log('Error written documents: ', error);
        });
    }
  };

  return (
    <QRCodeScanner
      onRead={qrcodeRead}
      reactivate={true}
      reactivateTimeout={500}
      flashMode={flash}
      showMarker={true}
      topContent={
        <View>
          <TouchableOpacity
            onPress={() =>
              setFlash(
                flash === RNCamera.Constants.FlashMode.off
                  ? RNCamera.Constants.FlashMode.torch
                  : RNCamera.Constants.FlashMode.off,
              )
            }>
            {flash === RNCamera.Constants.FlashMode.off ? (
              <Icon name="flash-off" size={30} color={'#BEBEBE'}></Icon>
            ) : (
              <Icon name="flash-on" size={30} color={'#BEBEBE'}></Icon>
            )}
          </TouchableOpacity>
        </View>
      }
      bottomContent={
        <View style={styles.container}>
          <Text
            style={{
              color: '#000000',
              padding: 20,
              fontSize: 20,
              margin: 10,
              color: '#000000',
            }}>
            {/* {data} */}
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  timerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QRScreen;
