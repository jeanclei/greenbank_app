import * as React from 'react';
import { StyleSheet, TouchableOpacity, Button, View, Text } from 'react-native';
import { Form, Container, Content, Input, Item, Label, Picker, Icon } from 'native-base';
import DatePicker from 'react-native-datepicker'

import { api } from '../../api'

import { mask, unMask } from 'remask';
import { AuthContext } from '../../Context/Context';

export default function CriarConta({ route, navigation }) {

  const { authContext } = React.useContext(AuthContext);
  const { signIn } = authContext

  const { cpf } = route.params;
  const [nome, setnome] = React.useState('');
  const [dtnasc, setdtnasc] = React.useState('');
  const [sexo, setsexo] = React.useState('N');
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

          <Item floatingLabel >
            <Label style={styles.inputlabel} >Nome Completo</Label>
            <Input style={styles.input} onChangeText={setnome} value={nome} />
          </Item>
          <Item floatingLabel>
            <Label style={styles.inputlabel}>CPF</Label>
            <Input style={styles.input} disabled={true} value={mask(cpf, '999.999.999-99')} />
          </Item>
          <View style={{ flexDirection: 'row' }}>
          <Item style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Label style={styles.inputlabel}>Sexo</Label>
              <Picker
                mode="dropdown"
                selectedValue={sexo}
                style={{ width: 150 }}
                onValueChange={(itemValue, itemIndex) => setsexo(itemValue)}
              >
                <Picker.Item label="Selecione" value="N" />
                <Picker.Item label="Masculino" value="M" />
                <Picker.Item label="Feminino" value="F" />
              </Picker>
            </Item>
            <Item style={{ flexDirection: 'column', alignItems: 'flex-start' }} >
              <Label style={styles.inputlabel}>Data de Nascimento</Label>
              <DatePicker
                style={{ width: 200 }}
                date={dtnasc}
                mode="date"
                placeholder="Selecione"
                format="DD-MM-YYYY"
                minDate="01-01-1900"
                maxDate="01-01-2016"
                locale="pt-BR"
                confirmBtnText="Ok"
                cancelBtnText="Cancela"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => { setdtnasc(date) }}
              />
            </Item>            
          </View>

          <Item floatingLabel>
            <Label style={styles.inputlabel}>Nome da Mãe</Label>
            <Input style={styles.input} value={nomemae} onChangeText={setnomemae} />
          </Item>
          <Item floatingLabel>
            <Label style={styles.inputlabel}>Email</Label>
            <Input style={styles.input} value={email} onChangeText={setemail}
              keyboardType="email-address" autoCapitalize="none" />
          </Item>
          <Item floatingLabel>
            <Label style={styles.inputlabel}>Celular</Label>
            <Input style={styles.input} keyboardType="numeric" value={celular} onChangeText={validacelular} />
          </Item>
          <Item floatingLabel>
            <Label style={styles.inputlabel}>{`Crie uma senha (Mínimo 8 caracteres)`}</Label>
            <Input style={styles.input} secureTextEntry={true} value={pass} onChangeText={setpass}
              autoCapitalize="none" autoCorrect={false} />
          </Item>
          <Item floatingLabel>
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