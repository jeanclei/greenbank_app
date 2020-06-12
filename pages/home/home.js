import * as React from 'react';
import { StyleSheet, Button, Text, TextInput, View, SafeAreaView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
//import Icon from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../../Context/Context'
import { Header, Left, Icon, Container, Content, Right, Body } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation }) {
  const { authContext, state } = React.useContext(AuthContext);
  const { signOut } = authContext

  return (

    <Container >

      <Header style={{ justifyContent: "flex-start" }}>
        <TouchableOpacity style={{ padding: 15 }} onPress={navigation.openDrawer}>
          <Icon name="ios-menu" ></Icon>
        </TouchableOpacity>
      </Header>

      
      <Text style={{ fontSize: 20 }}>
        {
          `Olá, ${state.userNome}\nSeja bem vindo! \nEsta é a sua tela inicial ` +
          `\nRepare que depois que você fez login, não será necessário fazer novamente, mesmo que ` +
          `você desligue o celular, eu já sei quem é você :) ` +
          `\nA não ser que você clique em LOGOFF, se fizer isso, os dados de acesso serão apagados ` +
          `\nEste é o comportamento esperado, avise o desenvolvedor se eu estiver meio quebrado`

        }
      </Text>
    </Container>
  );
}