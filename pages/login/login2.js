import * as React from 'react';
import {
  StyleSheet, Text, TextInput, View, ImageBackground,
  KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { AuthContext } from '../../Context/Context';
import api from '../../api'


export default function SignInScreen({ route, navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pass, setPass] = React.useState('');
  const { cpf } = route.params;

  const { signIn } = React.useContext(AuthContext);

  return (
    <ImageBackground source={require('../../assets/splash.png')}
      style={{ width: '100%', height: '100%' }}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({
          ios: 'padding',
          android: null,
        })} >

        <Text style={
          { flex: 0, margin: 10, fontSize: 40, color: "#888" }
        }>Agora, sua senha:</Text>

        <TextInput width="100%" type="cpf"
          onSubmitEditing={() => signIn({ username, password } )}
          style={styles.inputs}
          secureTextEntry={true}
          placeholder="Senha"
          value={pass}
          onChangeText={setPass}
        />

        <View style={{ flex: 0, padding: 5, width: "100%" }} opacity={pass.length < 8 ? 0.6 : 1} >
          < TouchableOpacity disabled={pass.length < 8}
            style={{
              width: "100%", justifyContent: "center", alignItems: "center", height: 70,
              borderRadius: 20, backgroundColor: "#4789ff"
            }}
            //onPress={}
             >
            <Text style={{ color: "white", fontSize: 25 }}>Entrar</Text>
          </TouchableOpacity>

        </View>


      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    opacity: 0.96,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputs: {
    textAlign: "center",
    fontSize: 30,
    flex: 1
  }
});