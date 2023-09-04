import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../../firebase/firebaseConfig';
import { ref, onValue } from "firebase/database";

const History = () => {
    const [historyData, setHistoryData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const userId = auth.currentUser.uid;
        const usersRef = ref(db, `/users/${userId}`);
        onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                setUserData([{
                    name: userData.name,
                    lastname: userData.lastname,
                }]);
            } else {
                setUserData([]);
            }
        });

        const historyRef = ref(db, `/history/${userId}`);
        onValue(historyRef, (snapshot) => {
            if (snapshot.exists()) {
                const historyData = snapshot.val();
                setHistoryData([{
                    hisdate: historyData.Hisdate,
                    inTime: historyData.InTime,
                    outTime: historyData.OutTime,
                    status: historyData.Status,
                    money: historyData.Mpney
                }])
            } else {
                setHistoryData([]);
            }
        });
    }, [])

  return (
    <View>
        {historyData.map((history, index) => (
            <View key={index}>
                        <Text style={styles.textTitle}>Parking Code</Text>
                        <Text style={{textAlign: 'center', marginTop: 30}}><Icon name="qrcode" size={100} color={'#BEBEBE'}></Icon></Text>
                        <View style={styles.listTitle}> 
                            <Text style={styles.fontTitle}>Name</Text>
                            <Text style={styles.fontTitle}>Surname</Text>
                        </View>
                        {userData.map((user, index) => (
                            <View style={styles.listName} key={index}>
                                <Text style={styles.fontName}>{user.name}</Text>
                                <Text style={styles.fontName}>{user.lastname}</Text>
                            </View>
                        ))}
                        <View style={styles.listTitle}>
                            <Text style={styles.fontTitle}>InTime</Text>
                            <Text style={styles.fontTitle}>OutTime</Text>
                        </View>
                        <View style={styles.listName}>
                            <Text style={styles.fontName}>{history.InTime}</Text>
                            <Text style={styles.fontName}>{history.OutTime}</Text>
                        </View>
                        <View style={styles.listTitle}>
                            <Text style={styles.fontTitle}>Date From</Text>
                            <Text style={styles.fontTitle}>Date To</Text>
                        </View>
                        <View style={styles.listName}>
                            <Text style={styles.fontName}>{history.Hisdate}</Text>
                            <Text style={styles.fontName}>{toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.listTitle}>
                            <Text style={styles.fontTitle}>Status</Text>
                            <Text style={styles.fontTitle}>Price</Text>
                        </View>
                        <View style={styles.listName}>
                            <Text style={styles.fontName}>{history.Status}</Text>
                            <Text style={styles.fontName}>{history.Mpney}</Text>
                        </View>
                    </View>
                    ))}
    </View>
  )
}

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
        color: '#000000'
    },
    qr: {
        marginTop: 30,
        textAlign: 'center',
        color: '#000000'
        // width: 170,
        // height: 170
    },
    listTitle: {
        display: 'flex',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 45,
        marginLeft: 60,
        marginRight: 60
    },
    listName: {
        display: 'flex',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginLeft: 60,
        marginRight: 60,
    },
    fontTitle: {
        fontSize: 13
    },
    fontName: {
        fontSize: 16,
        color: '#000000'
    }
})

export default History