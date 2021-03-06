import React, {useState, useEffect} from 'react';
import { View, Image, StyleSheet, ImageBackground, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUFProps {
  sigla: string;
}

interface IBGECitiesProps {
  nome: string;
}

const Home: React.FC = () => {

  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  const handleNavigateToPoints = ()=>{
    navigation.navigate('Points', {city: selectedCity, uf: selectedUf});
  }

  function handleSelectUf(uf: string){
    setSelectedUf(uf);
  }

  function handleSelectCity(city: string){
    setSelectedCity(city);
  }


  useEffect(()=>{
    axios.get<IBGEUFProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(({data})=>{
      const ufInitials = data.map(uf => uf.sigla);
      setUfs(ufInitials);
    })
  }, []);

  useEffect(()=>{
    if(selectedUf === '0'){
      return;
    }

    axios.get<IBGECitiesProps[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`).then(({data})=>{ 
    const citiesNames = data.map(city => city.nome);
      setCities(citiesNames);
    })
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding': undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')}
        imageStyle={{width: 274, height: 368}}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
        <RNPickerSelect
            value={selectedUf}
            style={stylesSelected}
            onValueChange={handleSelectUf}
            placeholder={{label: "Estado (UF)", value:'0'}}
            items={ufs.map(uf=>({ label: uf, value: uf }))}
            Icon={() => ( <Icon name="chevron-down" size={22} color="gray" />)}
        />
        <RNPickerSelect
            value={selectedCity}
            style={stylesSelected}
            onValueChange={handleSelectCity}
            placeholder={{label: "Cidade", value:'0'}}
            items={cities.map(uf=>({ label: uf, value: uf }))}
            Icon={() => ( <Icon name="chevron-down" size={22} color="gray" />)}
        />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const stylesSelected = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16
  },
  inputAndroid:{
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16
  },
  iconContainer: {
    top: 20,
    right: 15,
  }
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;