import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, set, onValue, update} from 'firebase/database';

const QRScreen = ({navigation}) => {
  const [data, setData] = useState(null);
  const [maximumPark, setMaximumPark] = useState(0);
  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);

  const [timeIn, setTimeIn] = useState(new Date());
  const [dateFrom, setDateFrom] = useState(new Date());
  const [status, setStatus] = useState('');

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, `/history/${userId}`);
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
    const historyRef = ref(db, '/setting');
    onValue(historyRef, snapshot => {
      if (snapshot.exists()) {
        const settingData = snapshot.val();
        setMaximumPark(settingData.capacity);
        // console.log('setting >>>>', setting);
      } else {
        setMaximumPark(null);
      }
    });
  }, []);

  const qrcodeRead = event => {
    let isScann = false;
    if (event.data === '8851552108001' && maximumPark > false) {
      if ((!isScann && !status) || (!isScann && status === 'out')) {
        const currentTime = new Date();
        setDateFrom(currentTime);
        setTimeIn(currentTime);
        writeData();
        navigation.navigate('Details');
        isScann = true;
      } else {
        Alert.alert('คุณได้สแกนแล้ว!');
      }
    } else {
      console.log('Wrong QR code');
      Alert.alert('คิวอาร์โค้ดไม่ถูกต้อง!');
    }
    setData(event.data);
  };

  const writeData = () => {
    const userId = auth.currentUser.uid;
    if (status === 'out') {
      const userId = auth.currentUser.uid;
      const historyRef = ref(db, `/history/${userId}`);
      const updatedHistory = {
        HisDate: dateFrom.toLocaleDateString(),
        InTime: timeIn.toLocaleTimeString(),
        OutTime: '',
        Status: 'in',
        Money: 0,
      };
      update(historyRef, updatedHistory)
        .then(() => {
          console.log('Data has been updated successfully:', updatedHistory);
        })
        .catch(error => {
          console.error('Error updating data:', error);
        });
    } else {
      set(ref(db, 'history/' + userId), {
        HisDate: dateFrom.toLocaleDateString(),
        InTime: timeIn.toLocaleTimeString(),
        OutTime: '',
        Status: 'in',
        Money: 0,
      })
        .then(() => {
          console.log('write history complete!');
        })
        .catch(error => {
          console.error('Error written documents: ', error);
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
            {data}
          </Text>
          {/* <Text>Scanned Time in : {timeIn}</Text>
            <Text>Scanned Time out : {timeOut}</Text>
            <Text>Scanned Time date : {date}</Text> */}
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
