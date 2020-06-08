import * as React from 'react';
import * as Animatable from 'react-native-animatable'
import {
  StyleSheet, Text, TextInput, View, ImageBackground,
  KeyboardAvoidingView, Platform, TouchableOpacity, Modal, SafeAreaView
} from 'react-native';
import { mask, unMask } from 'remask';
import { apivalidacpf } from '../../apivalidacpf'
import { AuthContext } from '../../Context/Context';

const AnimatableBtn = Animatable.createAnimatableComponent(TouchableOpacity)
const AnimatableModal = Animatable.createAnimatableComponent(Modal)

export default function SignInScreen({ navigation }) {
  const { signIn } = React.useContext(AuthContext);
  const btnComecar = React.useRef();

  const [cpf, setCPF] = React.useState('');
  const [pass, setPass] = React.useState('');
  const onChangeCPF = ev => {
    if (unMask(ev).length == 11) {
      btnComecar.current.pulse()
    }
    setCPF(mask(unMask(ev), ['999.999.999-99']))
  }
  const [digitarSenha, setdigitarSenha] = React.useState(false);

  const validaCPF = async () => {
    btnComecar.current.bounceOutRight(1500)
    try { // Chama a API para verificar o CPF, com um time out de 5 segundos.
      // se a api nao responder, retorna um erro para o usuario
      let response = await apivalidacpf({
        method: 'post',
        url: '/postvalidacpf',
        headers: { "validacpf": unMask(cpf) },
        timeout: 5000
      });
      btnComecar.current.wobble()
      if (response.data == '250') { //resposta da API com o codigo 250 quer dizer CPF invalido
        await btnComecar.current.bounceInRight()
        alert('CPF Inválido')
      } else if (response.data == 'OK') {
        // resposta 200 OK significa que o cpf é valido mas que nao existe na base
        //entao encaminha para tela de cadastro        
        navigation.navigate('CriarConta', { cpf: unMask(cpf) })
      } else if (response.data.cpf) {
        // quando o cpf ja existe, a api devolve este mesmo cpf no body      
        // entao pode pegar a senha e fazer o login
        setdigitarSenha(true)
      }
    } catch (error) {
      await btnComecar.current.bounceInRight()
      alert('Ocorreu um erro, verifique sua conexão com a internet.')
    }
  }

  const apiLogin = async () => {
    setdigitarSenha(false)
    try {
      let response = await apivalidacpf({
        method: 'post',
        url: '/postauthorization',
        headers: { "cpf": unMask(cpf), pass: pass },
        timeout: 5000
      });
      //erros da API ou de senha caen no catch, entao se nao entrar nesse if, quer dizer que 
      //nao deu erro na api, mas nao tem um token, e isso é uma probabilidade muito remota!
      if (response.data.token) {
        signIn({ data: response.data })
      } else {
        alert('Ocorreu um erro inesperado, tente novamente mais tarde.')
      }

    } catch (error) {
      const { status } = error.response || error
      if (status == 401) {
        alert('Senha inválida')
      } else {
        alert('Ocorreu um erro, verifique sua conexão com a internet.')
      }
    } finally {
      setPass('')
    }

  }

  return (
    <ImageBackground source={require('../../assets/splash.png')}
      style={{ width: '100%', height: '100%' }}>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.select({
        ios: 'padding',
        android: null,
      })} >

        <Text style={
          { flex: 0, margin: 10, fontSize: 40, color: "#888" }
        }>Olá, seja bem vindo!</Text>
        <Text style={
          { flex: 0, margin: 10, fontSize: 30, color: "#888" }
        }>Primeiro, digite seu CPF:</Text>

        <Animatable.View animation="bounceInDown" ref={btnComecar} style={{ flex: 1, width: "100%" }}>
          <TextInput width="100%" keyboardType="numeric"
            onSubmitEditing={() => {
              if (cpf.length == 14) {
                validaCPF()
              }
            }}
            style={styles.inputs}
            placeholder="CPF"
            value={cpf}
            onChangeText={onChangeCPF}
          />

          <View style={{ flex: 0, padding: 30, width: "100%" }} opacity={cpf.length < 14 ? 0.6 : 1} >
            < AnimatableBtn useNativeDriver
              disabled={cpf.length < 14}
              style={{
                width: "100%", justifyContent: "center", alignItems: "center", height: 50,
                borderRadius: 20, backgroundColor: "#4789ff"
              }}
              onPress={async () => {
                validaCPF()
              }}
            >
              <Text style={{ color: "white", fontSize: 25 }}>Começar</Text>
            </AnimatableBtn>
          </View>
        </Animatable.View>

        {/* Modal para digitar a senha... */}
        <AnimatableModal animationType="slide" transparent={false} visible={digitarSenha}
          onRequestClose={() => {
            setdigitarSenha(false)
            setPass('')
          }}
        >
          <Text style={
            { flex: 0, margin: 10, fontSize: 40, color: "#888" }
          }>Agora, digite sua senha:</Text>

          <TextInput width="100%" type="cpf"
            onSubmitEditing={() => {
              if (pass.length > 7) {
                apiLogin()
              }
            }}
            style={styles.inputs}
            secureTextEntry={true}
            placeholder="Senha"
            value={pass}
            onChangeText={setPass}
          />

          <View style={{ flex: 0, width: "100%", paddingHorizontal: 30 }}
            opacity={pass.length < 8 ? 0.6 : 1} >
            < TouchableOpacity
              disabled={pass.length < 8}
              style={{
                width: "100%", justifyContent: "center", alignItems: "center", height: 50,
                borderRadius: 20, backgroundColor: "#4789ff",
              }}
              onPress={() => {
                apiLogin()
              }}
            >
              <Text style={{ color: "white", fontSize: 25 }}>Entrar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 0, alignItems: "center", padding: 20 }}>
            <Text style={{ fontSize: 18, color: "red" }}>Esqueci minha senha</Text>
          </TouchableOpacity>

        </AnimatableModal>
        {/* <SafeAreaView></SafeAreaView> */}
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