import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {auth, db} from '../../firebase/firebaseConfig';
import {ref, onValue, remove} from 'firebase/database';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const History = ({navigation}) => {
  const [historyData, setHistoryData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(historyData);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, `/history/${userId}/historyId`);
    onValue(historyRef, snapshot => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        const newHistoryData = Object.keys(historyData).map(key => {
          return {
            key: key,
            ...historyData[key],
          };
        });
        setHistoryData(newHistoryData);
        // console.log('newHistoryData', historyData);
      } else {
        setHistoryData([]);
      }
    });
  }, []);

  useEffect(() => {
    const filteredResult = historyData.filter((item) =>
      item.key.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredResult);
  }, [searchText, historyData]);

  const deleteListHistory = hisId => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, `/history/${userId}/historyId/${hisId}`);
    remove(historyRef)
      .then(() => {
        console.log('ลบข้อมูลเรียบร้อยแล้ว');
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล: ', error);
      });
    // console.log('deleteList >>>', hisId);
  };

  const alertClearAllHistory = () => {
    Alert.alert('Confirm', 'Clear History?', [
      {
        text: 'Yes',
        onPress: () => clearAllHistory(),
      },
      {
        text: 'No',
      },
    ]);
  };

  const clearAllHistory = () => {
    const userId = auth.currentUser.uid;
    const historyRef = ref(db, `/history/${userId}/historyId`);
    remove(historyRef)
      .then(() => {
        console.log('ลบข้อมูลเรียบร้อยแล้ว');
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล: ', error);
      });
  };

  return (
    <View>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: 'black',
          }}>
          HISTORY
        </Text>
        <Feather
          name="trash-2"
          size={25}
          color={'#BEBEBE'}
          onPress={alertClearAllHistory}
        />
      </View>
      <View style={{marginHorizontal: 20}}>
        <TextInput 
        placeholder='Search'
        clearButtonMode='always'
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        style={styles.searchBox}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={filteredData}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <View style={styles.listItem}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DetailsHistory', {itemKey: item.key})
                }>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  {item.key}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => deleteListHistory(item.key)}>
              <View>
                <Ionicons name="trash-bin" size={20} color={'#BEBEBE'} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#EEF7FF'
    //alignItems: 'center',
  },
  header: {
    paddingTop: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 30,
    paddingLeft: 20,
  },
  listItem: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  searchBox: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8
  }
})

export default History;
