import React, { useState } from 'react';
import { Container, ButtonText } from './styles'
import { RectButtonProperties } from 'react-native-gesture-handler'
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

interface ButtonProps extends RectButtonProperties {
  children: string;
}

const fetchFonts = () => {
  return Font.loadAsync({
    'roboto-medium': require('../../../fonts/RobotoSlab-Medium.ttf'),
    'roboto-regular': require('../../../fonts/RobotoSlab-Regular.ttf')
  });
};


const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  if (!dataLoaded) {
    return (<AppLoading
      startAsync={fetchFonts}
      onFinish={() => setDataLoaded(true)}
    />
    )
  }

  return (
    <Container {...rest} >
      <ButtonText style={{ fontFamily: 'roboto-medium' }} >
        {children}
      </ButtonText>
    </Container>
  );
}

export default Button;
