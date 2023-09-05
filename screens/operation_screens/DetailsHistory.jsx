import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, onValue} from 'firebase/database';

const DetailsHistory = ({route}) => {
  const [historyData, setHistoryData] = useState([]);
  const {itemKey} = route.params;
  // console.log('itemKey >>> ', itemKey);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, `/history/${userId}/historyId/${itemKey}`);
    onValue(historyRef, snapshot => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        // const newHistoryData = Object.keys(historyData).map(key => ({
        //   id: key,
        //   ...historyData[key],
        // }));
        setHistoryData([
          {
            name: historyData.Name,
            lastName: historyData.LastName,
            hisDate: historyData.HisDate,
            dateTo: historyData.DateTo,
            inTime: historyData.InTime,
            outTime: historyData.OutTime,
            status: historyData.Status,
            price: historyData.Money,
          },
        ]);
        console.log('newHistoryData', historyData);
      } else {
        setHistoryData([]);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Parking Code</Text>
      <Text style={{textAlign: 'center', marginTop: 30}}>
        <AntDesign name="qrcode" size={100} color={'#BEBEBE'} />
      </Text>
      {historyData.map((item, index) => (
        <View key={index}>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>Name</Text>
            <Text style={styles.fontTitle}>Surname</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{item.name}</Text>
            <Text style={styles.fontName}>{item.lastName}</Text>
          </View>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>InTime</Text>
            <Text style={styles.fontTitle}>OutTime</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{item.inTime}</Text>
            <Text style={styles.fontName}>{item.outTime}</Text>
          </View>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>Date From</Text>
            <Text style={styles.fontTitle}>Date To</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{item.hisDate}</Text>
            <Text style={styles.fontName}>{item.dateTo}</Text>
          </View>
          <View style={styles.listTitle}>
            <Text style={styles.fontTitle}>Status</Text>
            <Text style={styles.fontTitle}>Price</Text>
          </View>
          <View style={styles.listName}>
            <Text style={styles.fontName}>{item.status}</Text>
            <Text style={styles.fontName}>{item.price}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#EEF7FF'
    //alignItems: 'center',
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 100,
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
    fontSize: 16,
    color: '#000000',
  },
});

export default DetailsHistory;
