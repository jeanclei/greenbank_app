import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './pages/splash'
import DadosScreen from './pages/home/dados_plano'
import HomeScreen from './pages/home/home'

import CriarConta from './pages/login/criarconta'
import SignInScreen from './pages/login/login'

import { AuthContext } from './Context/Context'
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
