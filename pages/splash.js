import { StyleSheet, View, Text } from 'react-native';
import * as React from 'react';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text>Carregando...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputs: {
        fontSize: 25,
        padding: 20,
        flex: 0
    }
});