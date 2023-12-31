import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React from 'react'

import { COLORS, SIZES } from './component/Themes'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Screen
// import Splash from './Splash';
// import SplashEasy from './SplashEasy';
// import SplashFast from './SplashFast';
import Welcome from './Welcome'
import Login from './Login';
import Regis from './Regis';
import DetailsHistory from './operation_screens/DetailsHistory'
import ForgotPassword from './ForgotPassword'
import ChangePassword from './operation_screens/ChangePassword'


//Operation_Screen
import HomeScreen from './operation_screens/HomeScreen';
import DetailsScreen from './operation_screens/DetailsScreen';
import QRScreen from './operation_screens/QRScreen';
import ProfileScreen from './operation_screens/ProfileScreen';
import History from './operation_screens/History'
import SettingsScreen from './operation_screens/SettingsScreen';

const homeName = "Home";
const detailsName = "Details";
const qrName = "Scan"
const historyName = "History";
const settingsName = "Settings";

const Operation_Screen = () => {
  return(
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({route}) => ({
        tabBarInactiveTintColor: COLORS.black,
        tabBarActiveTintColor: COLORS.blue,
        tabBarLabelStyle: { paddingBottom: 10, fontSize: SIZES.h4},
        tabBarStyle: { padding: 10, height: 70, borderTopLeftRadius: 30, borderTopRightRadius: 30},
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';

          } else if (rn === detailsName) {
            iconName = focused ? 'list' : 'list-outline';

          } else if (rn === qrName) {
            iconName = focused ? 'scan-outline' : 'scan-sharp';

          } else if (rn === historyName) {
            iconName = focused ? 'reorder-two' : 'reorder-two-outline';
            
          }else if (rn === settingsName) {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      >
      
      <Tab.Screen name={homeName} component={HomeScreen} options={{headerShown: false}} />
      <Tab.Screen name={detailsName} component={DetailsScreen} options={{headerShown: false}} />
      <Tab.Screen name={qrName} component={QRScreen} options={{headerShown: false}} />
      <Tab.Screen name={historyName} component={History} options={{headerShown: false}}/>
      <Tab.Screen name={settingsName} component={SettingsScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
  )
}

const MainContainer = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name= "Welcome" component={Welcome} options={{headerShown: false}}/>
          {/* <Stack.Screen name= "Splash" component={Splash} options={{headerShown: false}}/>
          <Stack.Screen name= "SplashEasy" component={SplashEasy} options={{headerShown: false}}/>
          <Stack.Screen name= "SplashFast" component={SplashFast} options={{headerShown: false}}/> */}
          <Stack.Screen name= "Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name= "Regis" component={Regis} options={{headerShown: false}}/>
          <Stack.Screen name= "Operation_Screen" component={Operation_Screen} options={{headerShown: false}}/>
          <Stack.Screen name= "DetailsHistory" component={DetailsHistory} options={{headerShown: false}} />
          <Stack.Screen name= "ProfileScreen" component={ProfileScreen} options={{headerShown: false}} />
          <Stack.Screen name= "ForgotPassword" component={ForgotPassword} options={{headerShown: false}} />
          <Stack.Screen name= "ChangePassword" component={ChangePassword} options={{headerShown: false}} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainContainer