import * as React from 'react';
import { Button, TextInput, View } from 'react-native';
import styles from './login_styles'

export default function CriarConta() {
    return (
      <View style={styles.container}>
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