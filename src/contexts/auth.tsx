import React, {createContext, useState, useEffect, useContext} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import * as auth from '../services/auth';
import api from '../services/api';

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  loading: boolean;
  user: User | null;
  signIn(): Promise<void>;
  signOut(): void;
  
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
      const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

      if (storagedUser && storagedToken) {
        api.defaults.headers.authorization = `Bearer ${storagedToken}`
        setUser(JSON.parse(storagedUser));
        setLoading(false);
      }
    }
  }, [])

  async function signIn () {
    const response = await auth.signIn();

    setUser(response.user);

    api.defaults.headers.authorization = `Bearer ${response.token}`

    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@RNAuth:token', response.token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
  
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}