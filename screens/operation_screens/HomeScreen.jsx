import React, {useState, useEffect, useCallback, useContext} from 'react';
import {View, Text, Image, BackHandler, Alert} from 'react-native';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, onValue, update} from 'firebase/database';
import {signOut} from 'firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Circle} from 'react-native-svg';

import {SIZES, COLORS} from '../component/Themes';
import { IdContext } from '../../App';

const HomeScreen = ({navigation}) => {
  const {setAdminKey} = useContext(IdContext);

  const [getName, setGetName] = useState({});
  const [count, setCount] = useState(0);
  const [maximumPark, setMaximumPark] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
          {
            text: 'ตกลง',
            onPress: () => {
              signOut(auth)
                .then(() => {
                  navigation.navigate('Login');
                })
                .catch(error => {
                  Alert.alert('Logout Failed');
                  console.log(error.message);
                  console.log(error.code);
                });
            },
          },
          {
            text: 'ยกเลิก',
          },
        ]);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, '/history');
    onValue(historyRef, snapshot => {
      const historyData = snapshot.val();
      for (const key of Object.keys(historyData)) {
        const historyDataSubstring = key.substring(28, 56);
        if (historyDataSubstring.startsWith(userId)) {
          // console.log(`NO As Mo sala: ${historyDataSubstring}`);
          const amKey = key.substring(0, 28);
          console.log('NO As Mo sala', amKey);
          setAdminKey(amKey);
        }
      }
    });
  }, []);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const statusRef = ref(db, `/history/Status`);
    onValue(statusRef, snapshot => {
      if (snapshot.exists()) {
        const statusData = snapshot.val();
        const count = Object.values(statusData).filter(
          item => item === 'in',
        ).length;
        setCount(count);
        console.log('count >>> ', count);
      } else {
        console.log('ไม่มีข้อมูลในตำแหน่งนี้');
      }
    });

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

    const usersRef = ref(db, `/users/${userId}`);
    onValue(usersRef, snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const newInputs = {
          fullname: userData.fullname,
          img: userData.img,
        };
        setGetName(newInputs);
      } else {
        setGetName({fullname: null, img: null});
      }
    });
  }, []);

  // const inFirebase = () => {
  //   const inSystem = ref(db, `/inSystem`);
  //   const updatedInSystem = {
  //     inCar: count,
  //   };
  //   update(inSystem, updatedInSystem)
  //     .then(() => {
  //       console.log('Data has been updated successfully:', updatedInSystem);
  //     })
  //     .catch(error => {
  //       console.error('Error updating data:', error);
  //     });
  //     console.log('>>> ', updatedInSystem)
  // };

  return (
    <View
      style={{
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: COLORS.white,
      }}>
      <View
        style={{flexDirection: 'row', paddingTop: '10%', paddingLeft: '10%'}}>
        {getName.img ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: getName.img}}
              style={{
                height: 80,
                width: 80,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: COLORS.darkBlue,
              }}
            />
            <Text
              style={{
                marginLeft: 20,
                bottom: 10,
                fontSize: SIZES.h3,
                fontWeight: 'bold',
              }}>
              Welcome
            </Text>
            <Text
              style={{position: 'absolute', marginLeft: '55%', paddingTop: 25}}>
              {getName.fullname}
            </Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../../img/Profile.webp')}
            style={{
              height: 80,
              width: 80,
              borderRadius: 85,
              borderWidth: 2,
              borderColor: COLORS.darkBlue,
            }}
          />
          <Text
            style={{
              marginLeft: 20,
              bottom: 10,
              fontSize: SIZES.h3,
              fontWeight: 'bold',
            }}>
            Welcome
          </Text>
          <Text
            style={{position: 'absolute', marginLeft: '55%', paddingTop: 25}}>
            {getName.fullname}
          </Text>
        </View>
        )}
      </View>
      <View style={{alignItems: 'center', top: '10%'}}>
        <AnimatedCircularProgress
          size={220}
          width={25}
          fill={maximumPark - count}     //{maximumPark - count}
          rotation={360}
          tintColor="#00e0ff"
          renderCap={({center}) => (
          <Circle cx={center.x} cy={center.y} r="13" fill="black" />
          )}
          lineCap='round'
          tintTransparency={true}
          backgroundColor={COLORS.darkBlue}>
          {fill => (
            <View>
              <Text style={{fontSize: 35, marginLeft: 13}}>{fill}</Text>
              <Text style={{fontSize: SIZES.h2}}>จอดได้อีก</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
      <View style={{top: '40%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '10%', marginRight: '10%'}}>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={maximumPark}    //{maximumPark}
          tintColor="#00e0ff"
          backgroundColor={COLORS.darkBlue}
          rotation={-90}
          arcSweepAngle={180}
          lineCap="round"
          tintTransparency={false}>
          {fill => (
            <View>
              <Text style={{fontSize: SIZES.h3}}>{fill}</Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={count}    //{count}
          tintColor="#00e0ff"
          backgroundColor={COLORS.darkBlue}
          rotation={-90}
          arcSweepAngle={180}
          lineCap="round"
          tintTransparency={false}>
          {fill => (
            <View>
              <Text style={{fontSize: SIZES.h3}}>{fill}</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '30%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: '10%',
          marginRight: '10%'
        }}>
        <Text style={{fontSize: SIZES.h2, marginLeft: 10}}>ความจุลานจอด</Text>
        <Text style={{fontSize: SIZES.h2, marginRight: '10%'}}>กำลังจอด</Text>
        {/* <Text style={{fontSize: SIZES.h1}}>
          จอดได้อีก : {maximumPark - count}
        </Text> */}
      </View>
    </View>
  );
};

export default HomeScreen;
