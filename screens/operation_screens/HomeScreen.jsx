import * as React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen({ route }) {
    const sendDetails = route.params || {};

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen</Text>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{sendDetails.outTime}</Text>
        </View>
    );
}
