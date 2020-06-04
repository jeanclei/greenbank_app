import * as React from 'react';
import { StyleSheet, Button, Text, TextInput, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Carregando...</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
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

function DadosScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Página do perfil</Text>
      <Text>{`Que pena, ainda não tem nada aqui! \nAinda está tudo por fazer :/`}</Text>
    </View>
  );
}

function CriarConta() {
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

function SignInScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={{ flex: 2, justifyContent: "center" }}>
        <TextInput style={styles.inputs}
          placeholder="CPF"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput style={styles.inputs}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          title="Entrar" onPress={() => signIn({ username, password })} />
      </View>

      <View style={{ padding: 10, flex: 0.5 }}>
        <Button
          title="Criar conta" onPress={() => navigation.navigate('CriarConta')} />
      </View>

    </View>
  );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        alert('sem token')
        // Restoring token failed
      }
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy toke  
        await SecureStore.setItemAsync('userToken', 'dummyauthtoken');
        dispatch({ type: 'SIGN_IN', token: 'dummyauthtoken' });
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync('userToken')
        } catch (error) {
          alert(error)
        }

        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        //await SecureStore.setItemAsync(key, value)
        dispatch({ type: 'SIGN_IN', token: 'dummyauthtoken' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} options={{ title: 'Carregando...' }} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  title: 'Entrar',
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
              <Stack.Screen
                name="CriarConta"
                component={CriarConta}
                options={{
                  title: 'Criar minha conta'
                }}
              />
            </>
          ) : (
                // User is signed in
                <>
                  <Stack.Screen name="Início" component={HomeScreen} options={{ title: 'Início' }}
                  // options={({ navigation, route }) => ({
                  //   headerTitle: props => <LogoTitle {...props} />,
                  // })}
                  />
                  <Stack.Screen name="DadosPerfil" component={DadosScreen} options={{ title: 'Meus Dados' }} />
                </>
              )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
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