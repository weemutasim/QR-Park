import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, onValue} from 'firebase/database';

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const [maximumPark, setMaximumPark] = useState(0);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, `/history/${userId}`);
    onValue(historyRef, snapshot => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        const count = Object.values(historyData).filter(
          item => item === 'in',
        ).length;
        // if(historyData.Status === 'in') {
        //     console.log('มีคีย์ "in" ใน historyData');
        // } else {
        //     console.log('ไม่มีคีย์ "in" ใน historyData');
        // }
        setCount(count);
        console.log('count >>> ', count);
      } else {
        console.log('ไม่มีข้อมูลในตำแหน่งนี้');
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

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 26, fontWeight: 'bold'}}>Home Screen</Text>
      <Text style={{fontSize: 15}}>ความจุลานจอด {maximumPark}</Text>
      <Text style={{fontSize: 15}}>กำลังจอด : {count}</Text>
      <Text style={{fontSize: 15}}>จอดได้อีก : {maximumPark - count}</Text>
    </View>
  );
}
