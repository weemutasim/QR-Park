import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, onValue, update, set} from 'firebase/database';
import QRCode from 'react-native-qrcode-svg';

import {COLORS, SIZES} from '.././component/Themes';
import { IdContext } from '../../App';

const DetailsScreen = () => {
  const { adminKey } = useContext(IdContext);

  const [getName, setGetName] = useState({});
  const [getDetail, setGetDetail] = useState({});
  const [timeOuts, setTimeOuts] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [settingPrice, setSettingPrices] = useState(0);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const usersRef = ref(db, 'users/' + userId);
    onValue(usersRef, snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const newInputs = {
          fullname: userData.fullname,
          lastname: userData.lastname,
        };
        setGetName(newInputs);
      } else {
        setGetName({fullname: null, lastname: null});
      }
    });

    const historyRef = ref(db, 'history/' + adminKey + userId);
    onValue(historyRef, snapshot => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        const newInputs = {
          date: historyData.HisDate,
          timeIn: historyData.InTime,
          status: historyData.Status,
          uid: historyData.Uid
        }
        setGetDetail(newInputs);
      } else {
        setGetDetail({date: null, timeIn: null, status: null, aid: null})
      }
    });

    const settingRef = ref(db, '/setting');
    onValue(settingRef, snapshot => {
      if (snapshot.exists()) {
        const settingData = snapshot.val();
        setSettingPrices(settingData.price);
        // console.log('settingPrice >>>>', settingPrice);
      } else {
        setSettingPrices(null);
      }
    });
  }, []);

  const outTime = () => {
    const newCurrent = new Date();
    setDateTo(newCurrent);
    setTimeOuts(newCurrent);
    Calculate();
    updateHistory();
    WriteNewHistoryUser();
    WriteNewHistoryAdmin();
  };

  const updateHistory = () => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, 'history/' + adminKey + userId);
    const updatedHistory = {
      OutTime: timeOuts.toLocaleTimeString(),
      Money: Calculate(),
      Status: 'out',
    };
    update(historyRef, updatedHistory)
      .then(() => {
        console.log('Data has been updated successfully:', updatedHistory);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const WriteNewHistoryUser = () => {
    const inputDate = getDetail.date;
    const formattedDate = inputDate.replace(/\//g, '-');
    const userId = auth.currentUser.uid;
    const historyRef = ref(
      db,
      `history/${adminKey}${userId}/historyUser/${formattedDate} ${getDetail.timeIn}`,
    );
    const newUpdatedHistory = {
      Name: getName.fullname,
      LastName: getName.lastname,
      HisDate: getDetail.date,
      DateTo: dateTo.toLocaleDateString(),
      InTime: getDetail.timeIn,
      OutTime: timeOuts.toLocaleTimeString(),
      Status: 'out',
      Money: Calculate(),
      Uid: getDetail.uid,
    };
    set(historyRef, newUpdatedHistory)
      .then(() => {
        console.log('เพิ่มกิ่งใหม่สำเร็จ');
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการเพิ่มกิ่งใหม่:', error);
      });
  };

  const WriteNewHistoryAdmin = () => {
    const inputDate = getDetail.date;
    const formattedDate = inputDate.replace(/\//g, '-');
    const userId = auth.currentUser.uid;
    const historyRef = ref(
      db,
      `history/${adminKey}${userId}/historyAdmin/${getName.fullname} ${getName.lastname} ${formattedDate}`,
    );
    const newUpdatedHistory = {
      Name: getName.fullname,
      LastName: getName.lastname,
      HisDate: getDetail.date,
      DateTo: dateTo.toLocaleDateString(),
      InTime: getDetail.timeIn,
      OutTime: timeOuts.toLocaleTimeString(),
      Status: 'out',
      Money: Calculate(),
      Uid: getDetail.uid,
    };
    set(historyRef, newUpdatedHistory)
      .then(() => {
        console.log('เพิ่มกิ่งใหม่สำเร็จ');
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการเพิ่มกิ่งใหม่:', error);
      });
  }

  const Calculate = () => {
    const timePartsIn = getDetail.timeIn.split(':');
    const startHours = parseInt(timePartsIn[0]);
    const startMinutes = parseInt(timePartsIn[1]);

    const timeString = timeOuts.toLocaleTimeString();
    const timePartsOut = timeString.split(':');
    const endHours = parseInt(timePartsOut[0]);
    const endMinutes = parseInt(timePartsOut[1]);

    const totalStartMinutes = startHours * 60 + startMinutes;
    const totalEndMinutes = endHours * 60 + endMinutes;
    const sumMinutes = Math.abs(totalEndMinutes - totalStartMinutes);

    let part = 0,
      price = 0,
      houreAll = 0,
      houre = 0,
      minute = 0;
    let timeDifferenceInMinutes = 0;

    if (sumMinutes >= 30) {
      //จอดน้อยกว่า 30 นาที่ ไม่คิดค่าบริการ
      if (startHours >= 21 && endHours < 6) {
        part = 50;
        console.log('(if 0) จอดเกิน 3 ทุ่ม แต่ไม่เกิน 6 โมงเช้า ========');
      } else if (startHours >= 21 && endHours >= 6) {
        part = 50;
        timeDifferenceInMinutes = Math.abs(totalEndMinutes - 360);
        houreAll = timeDifferenceInMinutes / 60;
        houre = Math.floor(houreAll);
        minute = Math.round((houreAll - houre) * 60);

        console.log('(if 1) จอดเกิน 3 ทุ่ม แต่เกิน 6 โมงเช้า ========');
        if (minute >= 15) {
          houre += 1;
        }
      } else if (startHours >= 6 && endHours >= 21 && endHours <= 24) {
        part = 50;
        timeDifferenceInMinutes = Math.abs(totalEndMinutes - totalStartMinutes);
        houreAll = timeDifferenceInMinutes / 60 - (endHours - 21);
        houre = Math.floor(houreAll);
        minute = Math.round((houreAll - houre) * 60);

        console.log(
          '(if 2) จอดหลัง 6 โมงเช้า แต่เกิน 3 ทุ่มถึงเทียงคืน ========',
        );
        if (minute >= 15) {
          houre += 1;
        }
      } else if (startHours >= 6 && endHours >= 1 && endHours < 6) {
        let newHours = 21;
        part = 50;
        houre = Math.abs(startHours - newHours);

        console.log(
          '(if 3) จอดหลัง 6 โมงเช้า แต่เกินเทียงคืนถึง 6 โมงเช้า ========',
        );
      } else {
        timeDifferenceInMinutes = Math.abs(totalEndMinutes - totalStartMinutes);
        houreAll = timeDifferenceInMinutes / 60;
        houre = Math.floor(houreAll);
        minute = Math.round((houreAll - houre) * 60);

        console.log('(if 4) จอดหลัง 6 โมงเช้า แต่ไม่เกิน 3 ทุ่ม ========');
        if (minute >= 15) {
          houre += 1;
        }
      }
    } else {
      console.log('ไม่คิดค่าบริการ');
    }
    price = houre * settingPrice + part;
    return price;

    // console.log("เวลาเดิน = " + timeIn);
    // console.log("เวลาหยุด = " + timeOut);
    // console.log("นาที่รวม = " + sumMinutes);
    // console.log("ช.ม.รวม = " + houre);
    // console.log("ค่าจอดแบบเหมาจ่าย = " + part);
    // console.log("ราคา = " + price);
    // console.log("นาที่ที่ตัด = " + minute);
    // console.log("\n");
  };

  return (
    <View style={styles.container}>
      {getDetail.status === 'in' ? (
        <View>
          <Text style={styles.textTitle}>Parking Code</Text>
          <View style={{marginTop: 30, alignItems: 'center'}}>
            <QRCode value={getDetail.aid} />
          </View>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>Name</Text>
            <Text style={styles.fontTitle}>Surname</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{getName.fullname}</Text>
            <Text style={styles.fontName}>{getName.lastname}</Text>
          </View>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>InTime</Text>
            <Text style={styles.fontTitle}>OutTime</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{getDetail.timeIn}</Text>
            {getDetail.status === 'in' ? null : (
              <Text style={styles.fontName}>
                {timeOuts.toLocaleTimeString()}
              </Text>
            )}
          </View>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>Date From</Text>
            <Text style={styles.fontTitle}>Date To</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{getDetail.date}</Text>
            {getDetail.status === 'in' ? null : (
              <Text style={styles.fontName}>{dateTo.toLocaleDateString()}</Text>
            )}
          </View>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>Status</Text>
            <Text style={styles.fontTitle}>Price</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{getDetail.status}</Text>
            {getDetail.status === 'in' ? null : (
              <Text style={styles.fontName}>{Calculate()}</Text>
            )}
          </View>
          <View
            style={{
              height: 50,
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
              marginLeft: 60,
              marginRight: 60,
            }}>
            <Button onPress={outTime} title="Out" color="#097AFF" />
          </View>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Ionicons
            name="file-tray-outline"
            style={{fontSize: 100, color: COLORS.blue}}
          />
          <Text>ไม่มีข้อมูล</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    //alignItems: 'center',
  },
  textTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    marginTop: 70,
    textAlign: 'center',
    color: '#000000',
  },
  qr: {
    marginTop: 30,
    textAlign: 'center',
    color: '#000000',
    // width: 170,
    // height: 170
  },
  listTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 45,
    marginLeft: 60,
    marginRight: 60,
  },
  listName: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 60,
    marginRight: 60,
  },
  fontTitle: {
    fontSize: 13,
  },
  fontName: {
    fontSize: SIZES.h2,
    color: '#000000',
  },
});

export default DetailsScreen;
