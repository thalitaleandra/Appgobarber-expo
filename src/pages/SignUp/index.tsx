import 'react-native-gesture-handler';
import React, { useState, useCallback, useRef, } from 'react';
import { Image, Alert, KeyboardAvoidingView, TextInput, Platform, View, ScrollView } from 'react-native'
import Input from '../../components/Input';
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';
import { Feather } from '@expo/vector-icons';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
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
interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  // const handleSignIn = useCallback((data: object) => {
  //  console.log(data);
  //}, []);
  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current ?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório.'),
        email: Yup.string().required('E-mail é obrigatório').email('Digite um E-mail válido.'),
        password: Yup.string().min(6, 'No minimo 6 digitos')
      });
      await schema.validate(data, {
        abortEarly: false, // aborda todos os erros de uma vez só
      });
      await api.post('/users', data);

      Alert.alert('Cadastro realizado com sucesso!',
        'Você já pode fazer login na aplicação')
      navigation.goBack();
      //history.push('/');

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current ?.setErrors(errors);

        return;
      }
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer cadastro, tente novamente'
      );

    }
  }, [navigation]);

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
              <Title style={{ fontFamily: 'roboto-medium' }}>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current ?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
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
                secureTextEntry
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current ?.submitForm();
                }}
              />
              <Button onPress={() => {
                formRef.current ?.submitForm();
              }}
              >Cadastrar</Button>
            </Form>


          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={20} color="#fff" />
        <BackToSignInText style={{ fontFamily: 'roboto-regular' }}>Voltar para o logon.</BackToSignInText>
      </BackToSignIn>

    </>
  )
}


export default SignUp;

