import * as React from 'react';
import { StyleSheet, Button, TextInput, View } from 'react-native';


export default function CriarConta({ route, navigation }) {

  const { cpf } = route.params;
  
  return (
    <View style={styles.container} >
      <TextInput style={styles.inputs}
        placeholder="Nome"
      />
      <TextInput style={styles.inputs}
        placeholder="CPF"
      />
      <TextInput style={styles.inputs}
        placeholder="Celular"
      />
      <Button title=" Próximo >>" onPress={() => alert('Nao podemos criar sua conta ainda!')} />
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