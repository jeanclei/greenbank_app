
import * as React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { api } from '../../api'

import { Header, Left, Icon, Container, Content, Right } from 'native-base';

import { AuthContext } from '../../Context/Context'

export default function DadosScreen({ navigation }) {

  const { state } = React.useContext(AuthContext);


  
  return (
    <Container style={{ flex: 1, width: "100%" }}>
      <Header style={{ justifyContent: "flex-start" }}>
        <TouchableOpacity style={{ padding: 15 }} onPress={navigation.openDrawer}>
          <Icon name="ios-menu" ></Icon>
        </TouchableOpacity>
      </Header>

      <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
        <Text>{`Página do perfil\n\n`}</Text>
        <Text>{`Nome: ${state.userNome} \nCPF: ${state.userCpf}\n`}</Text>
        <Text>{`Token: \n${api.defaults.headers.authorization}`})</Text>


      </View>
    </Container>
  );
}