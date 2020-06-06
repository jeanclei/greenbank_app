import * as React from 'react';
import { StyleSheet, Button, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../Context/Context'

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View style={styles.container} >

        <TextInput style={styles.inputs}
          placeholder="Digite seu CPF"
          value={username}
          onChangeText={setUsername}
        />
        <Button
          title="Começar" onPress={() => signIn({ username, password })} />    


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