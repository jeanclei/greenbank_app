import 'react-native-gesture-handler';
import React from 'react';
import { Image, TextInput, TouchableOpacity, Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import AsyncStorage from '@react-native-community/async-storage';
const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (

    <View style={styles.container}>

      <View>
        <Button
          title="Meus dados"
          onPress={() => navigation.navigate('MeusDados')}
        />
      </View>
      <View>
        <Text></Text>
      </View>
      <View>
        <Button
          title="Logoff"
         
        />
      </View>

    </View>
  );
}

function DadosScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Página do perfil</Text>
    </View>
  );
}

function LoginScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
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
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
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
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
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
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            <>
              <Stack.Screen name="Entrar" component={LoginScreen} options={{
                title: 'Entrar',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push'
              }} />

            </>
          ) : (
                <>
                  <Stack.Screen name="Inicio" component={HomeScreen} options={{
                    title: 'Meu Plano'
                  }} />
                  <Stack.Screen name="MeusDados" component={DadosScreen} options={{ title: 'Meus Dados' }} />

                </>

              )}

        </Stack.Navigator>


      </NavigationContainer>
    </AuthContext.Provider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botoesLogin: {
  }
});
