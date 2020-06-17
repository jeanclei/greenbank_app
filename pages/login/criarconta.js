import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Form, Container, Content, Input, Item, Label } from 'native-base';
import DatePicker from 'react-native-datepicker'
import RNPickerSelect from 'react-native-picker-select';

import { api } from '../../api'

import { mask, unMask } from 'remask';
import { AuthContext } from '../../Context/Context';

export default function CriarConta({ route, navigation }) {

  const { authContext } = React.useContext(AuthContext);
  const { signIn } = authContext

  const { cpf } = route.params;
  const [nome, setnome] = React.useState('');
  const [dtnasc, setdtnasc] = React.useState('');
  const [sexo, setsexo] = React.useState('');
  const [nomemae, setnomemae] = React.useState('');
  const [email, setemail] = React.useState('');
  const [celular, setcelular] = React.useState('');
  const [pass, setpass] = React.useState('');
  const [pass2, setpass2] = React.useState('');

  const validacelular = celular => {
    setcelular(mask(unMask(celular), ['(99) 9 9999-9999']))
  }

  const enviacadastro = async () => {

    try {
      let response = await api({
        method: 'post',
        url: '/',
        data: {
          query:
            `mutation {
            createPessoaFisica(input:{
              nome: "${nome}"
              cpf: "${unMask(cpf)}"
              dtnasc: "${dtnasc}"
              sexo: "${sexo}"
              nomemae: "${nomemae}"
              email: "${email}"
              celular: "${unMask(celular)}"
              pass: "${pass}"
            })
            {
              token id cpf nome
            }
          }`
        },
        timeout: 5000
      });

      if (response.data.data.createPessoaFisica) {
        alert('Parabéns, sua conta foi criada! \n' +
          'Verifique os próximos passos para ativar seu cadastro e começar a investir.')
        signIn(response.data.data.createPessoaFisica)
      } else {
        console.log(response.data)
        alert(`Ocorreu algum erro, verifique se preencheu todos os dados corretamente! \n${response.data.errors}`)
      }

    } catch (error) {
      alert(`Ocorreu algum erro, verifique se preencheu todos os dados corretamente! \n${error}`)
      console.log(error)
    }

  }

  return (
    <Container>
      <Content>
        <Form style={{ marginTop: 10, marginBottom: 50 }} >

          <Item floatingLabel
            style={nome == '' ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })} >
            <Label style={styles.inputlabel} >Nome Completo</Label>
            <Input style={styles.input} onChangeText={setnome} value={nome} />
          </Item>
          <Item floatingLabel
            style={cpf == '' ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })} >
            <Label style={styles.inputlabel}>CPF</Label>
            <Input style={styles.input} disabled={true} value={mask(cpf, '999.999.999-99')} />
          </Item>
          <View style={{ flexDirection: 'row' }}>
            <Item style={
              [{ flexDirection: 'column', alignItems: 'flex-start' },
              dtnasc == '' ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })]} >
              <Label style={styles.inputlabel}>Data de Nascimento</Label>
              <DatePicker
                style={{ width: 150 }}
                date={dtnasc}
                mode="date"
                androidMode="spinner"
                placeholder="Selecione"
                format="DD/MM/YYYY"
                minDate="01/01/1900"
                maxDate="31/12/2016"
                locale="pt-BR"
                confirmBtnText="Ok"
                cancelBtnText="Cancelar"
                customStyles={{
                  // dateIcon: {
                  //   position: 'relative',
                  //   left: 0,
                  //   top: 4,
                  //   marginLeft: 5
                  // },
                  dateInput: {
                    // marginLeft: 36,
                    borderWidth: 0,
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => { setdtnasc(date) }}
              />
            </Item>
            <Item style={
              [{ flexDirection: 'column', flex: 1, alignItems: 'flex-start' },
              sexo == '' ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })]}>
              <Label style={styles.inputlabel}>Sexo</Label>
              <RNPickerSelect
                onValueChange={(value) => setsexo(value)}
                doneText="Concluído"
                style={{ inputIOS: { paddingTop: 10, paddingLeft: 10 } }}
                placeholder={{ label: 'Selecione', value: '', color: 'orange' }}
                items={[
                  { label: 'Masculino', value: 'M' },
                  { label: 'Feminino', value: 'F' },
                ]}
              />
            </Item>
          </View>

          <Item floatingLabel
            style={nomemae == '' ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })} >
            <Label style={styles.inputlabel}>Nome da Mãe</Label>
            <Input style={styles.input} value={nomemae} onChangeText={setnomemae} />
          </Item>
          <Item floatingLabel
            style={email.indexOf("@") == -1 || email.indexOf(".") == -1 ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })} >
            <Label style={styles.inputlabel}>Email</Label>
            <Input style={styles.input} value={email} onChangeText={setemail}
              keyboardType="email-address" autoCapitalize="none" />
          </Item>
          <Item floatingLabel
            style={celular.length !== 16 ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })} >
            <Label style={styles.inputlabel}>Celular</Label>
            <Input style={styles.input} keyboardType="numeric" value={celular} onChangeText={validacelular} />
          </Item>
          <Item floatingLabel
            style={pass.length < 8 ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })} >
            <Label style={styles.inputlabel}>{`Crie uma senha (Mínimo 8 caracteres)`}</Label>
            <Input style={styles.input} secureTextEntry={true} value={pass} onChangeText={setpass}
              autoCapitalize="none" autoCorrect={false} />
          </Item>
          <Item floatingLabel
            style={pass2.length < 8 || pass !== pass2 ? ({ borderBottomColor: "red" }) : ({ borderBottomColor: "green" })} >
            <Label style={styles.inputlabel}>Confirmar senha</Label>
            <Input style={styles.input} secureTextEntry={true} value={pass2} onChangeText={setpass2}
              autoCapitalize="none" autoCorrect={false} />
          </Item>

        </Form>
        <View style={{ flex: 0, width: "100%", paddingHorizontal: 30 }}
          opacity={pass != pass2 || pass.length < 8 ? 0.6 : 1} >
          < TouchableOpacity
            disabled={pass != pass2 || pass.length < 8 ? true : false}
            style={{
              width: "100%", justifyContent: "center", alignItems: "center", height: 50,
              borderRadius: 20, backgroundColor: "#4789ff",
            }}
            onPress={() => {
              enviacadastro()
            }}
          >
            <Text style={{ color: "white", fontSize: 25 }}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  inputlabel: {
    fontSize: 15,
    padding: 5
  },
  input: {
    marginLeft: 15,
  }
});