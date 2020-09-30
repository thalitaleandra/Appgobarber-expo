import 'react-native-gesture-handler';
import React, { useCallback, useRef, useState } from 'react';
import { Image, Alert, TextInput, KeyboardAvoidingView, Platform, View, ScrollView } from 'react-native'
import Input from '../../components/Input';
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { useAuth } from '../../hooks/auth'
import { FormHandles } from '@unform/core';
import { Container, Title, ForgotPassWord, ForgotPassWordText, CreateAccountButton, CreateAccountButtonText } from './styles';
import { Feather } from '@expo/vector-icons';
import logoImg from '../../assets/Logo.png'
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import api from '../../services/api';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors'

const fetchFonts = () => {
  return Font.loadAsync({
    'roboto-medium': require('../../../fonts/RobotoSlab-Medium.ttf'),
    'roboto-regular': require('../../../fonts/RobotoSlab-Regular.ttf')
  });
};

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { signIn, user } = useAuth();
  //console.log(user);
  const [dataLoaded, setDataLoaded] = useState(false);
  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current ?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail é obrigatório').email('Digite um E-mail válido.'),
        password: Yup.string().required('Senha obrigatória.')
      });
      await schema.validate(data, {
        abortEarly: false, // aborda todos os erros de uma vez só
      });


      await signIn({
        email: data.email,
        password: data.password,
      });
      // history.push('/dashboard')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current ?.setErrors(errors);

        return;
      }
      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque as credenciais'
      );
    }
  }, [signIn]);

  if (!dataLoaded) {
    return (<AppLoading
      startAsync={fetchFonts}
      onFinish={() => setDataLoaded(true)}
    />
    )
  }


  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled

      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title style={{ fontFamily: 'roboto-medium' }}>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current ?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current ?.submitForm();
                }}
              />
              <Button onPress={() => {
                formRef.current ?.submitForm();
              }}>
                Entrar
              </Button>
            </Form>
            <ForgotPassWord onPress={() => { }} />
            <ForgotPassWordText style={{ fontFamily: 'roboto-regular' }}>Esqueci minha senha</ForgotPassWordText>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Feather name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText style={{ fontFamily: 'roboto-regular' }}>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>

    </>
  )
}


export default SignIn;
