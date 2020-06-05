import * as React from 'react';
import { StyleSheet, Button, Text, TextInput, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from '../../Context/Context'

export default function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View>
      <Text style={{ fontSize: 20 }}>
        {
          `Olá, \nSeja bem vindo! \nEsta é a sua tela inicial ` +
          `\nRepare que depois que você fez login, não será necessário fazer novamente, mesmo que ` +
          `você desligue o celular, eu já sei quem é você :) ` +
          `\nA não ser que você clique em LOGOFF, se fizer isso, os dados de acesso serão apagados ` +
          `\nEste é o comportamento esperado, avise o desenvolvedor se eu estiver meio quebrado`
        }
      </Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ margin: 10, flex: 1 }}>

          <Button
            title="Meus dados"
            onPress={() => navigation.navigate('DadosPerfil')}
          />
        </View>
        <View style={{ margin: 10, flex: 1 }}>
          <Button
            title="Logoff" onPress={signOut}
          />
        </View>
      </View>
    </View>
  );
}