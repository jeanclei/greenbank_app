import * as React from 'react';
import { StyleSheet, Button, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { api, apptoken } from './api'

//import Icon from 'react-native-vector-icons/FontAwesome';


import SplashScreen from './pages/splash'
import Login from './pages/login/login'
import CriarConta from './pages/login/criarconta'

import HomeScreen from './pages/home/home'

import DadosScreen from './pages/home/dados_plano'


import { AuthContext } from './Context/Context'
import { Container, Header, Body } from 'native-base';

const StackNavi = createStackNavigator();

const Drawer = createDrawerNavigator();


export default function App({ navigation }) {



  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            userID: action.id,
            userNome: action.nome,
            userCpf: action.cpf,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userID: action.id,
            userNome: action.nome,
            userCpf: action.cpf,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userID: null,
            userNome: null,
            userCpf: null,
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
      let userToken, userid, usernome, usercpf;

      try {
        userToken = await SecureStore.getItemAsync('cadprevtoken');
        userid = await SecureStore.getItemAsync('cadprevuserid');
        usernome = await SecureStore.getItemAsync('cadprevnome');
        usercpf = await SecureStore.getItemAsync('cadprevcpf');
        if (userToken)
          api.defaults.headers.authorization = userToken
        else
          api.defaults.headers.authorization = apptoken
      } catch (e) {
        console.debug('app - useeffects', e)
        // Restoring token failed
      }
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({
        type: 'RESTORE_TOKEN',
        token: userToken,
        id: userid,
        nome: usernome,
        cpf: usercpf
      });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({

      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy toke  
        try {
          api.defaults.headers.authorization = data.token
          await SecureStore.setItemAsync('cadprevtoken', data.token);
          await SecureStore.setItemAsync('cadprevuserid', String(data.id));
          await SecureStore.setItemAsync('cadprevnome', data.nome);
          await SecureStore.setItemAsync('cadprevcpf', data.cpf);
          dispatch({
            type: 'SIGN_IN',
            token: data.token,
            id: String(data.id),
            nome: data.nome,
            cpf: data.cpf
          });
        } catch (error) {
          console.debug('signin', error)
        }

      },
      signOut: async () => {
        try {
          api.defaults.headers.authorization = apptoken
          await SecureStore.deleteItemAsync('cadprevtoken');
          await SecureStore.deleteItemAsync('cadprevuserid');
          await SecureStore.deleteItemAsync('cadprevnome');
          await SecureStore.deleteItemAsync('cadprevcpf');
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

  const myContentDrawer = (props) => {
    return (
      <Container>
        <Header style={{ height: 100, backgroundColor: 'white', justifyContent: "flex-start" }}>
          <Text>{`\nFaz de conta que aqui tem um header bem bonito..`}</Text>
        </Header>
        <DrawerItemList {...props} />

        <View style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity onPress={() => {
            props.navigation.closeDrawer()
            authContext.signOut()
          }
          } style={{
            backgroundColor: '#922', padding: 20, width: 150,
            borderTopRightRadius: 30
          }}>
            <Text>{`<<< Sair`}</Text>
          </TouchableOpacity>

        </View>
      </Container>
    )
  }

  return (
    <AuthContext.Provider value={{ authContext: authContext, state: state }}>

      {state.isLoading ? (
        <>
          <NavigationContainer>
            <StackNavi.Navigator>
              {/* We haven't finished checking for the token yet */}
              <StackNavi.Screen name="Splash" component={SplashScreen} options={{ title: 'Carregando...' }} />
            </StackNavi.Navigator>
          </NavigationContainer>
        </>
      ) : state.userToken == null ? (
        // No token found, user isn't signed in
        <>
          <NavigationContainer>
            <StackNavi.Navigator>
              <StackNavi.Screen
                name="SignIn" component={Login}
                options={{
                  title: 'Entrar',
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
              <StackNavi.Screen
                name="CriarConta"
                component={CriarConta}
                options={{
                  title: 'Criar minha conta'
                }}
              />
            </StackNavi.Navigator>
          </NavigationContainer>
        </>
      ) : (
            // User is signed in
            <>
              <NavigationContainer>
                <Drawer.Navigator edgeWidth={100} drawerContent={myContentDrawer} >
                  <Drawer.Screen name="Início" component={HomeScreen}
                  />
                  <Drawer.Screen name="DadosPerfil" component={DadosScreen}
                  // options={{ title: 'Meus Dados' }} 
                  />
                </Drawer.Navigator>
              </NavigationContainer>
            </>
          )}

    </AuthContext.Provider>
  );
}
