import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Linking } from 'react-native';
import {Feather as Icon, FontAwesome} from '@expo/vector-icons';

import {useNavigation, useRoute} from '@react-navigation/native';
import { TouchableOpacity, RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services';

interface Params{
   point_id: number;
}

interface DataProps{
  point:{
    name: string;
    image: string;
    image_url: string;
    whatsapp: string;
    email: string;
    city: string;
    uf: string;
  },
  items:{
    title: string
  }[]
}

const Detail:React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  const [data, setData] = useState<DataProps>({} as DataProps);

  useEffect(() => {
    api.get<DataProps>(`/point/${routeParams.point_id}`).then(({data}) => {
      setData(data);
    });
  }, []);

  function handleNavigateBack(){
    navigation.goBack();
  }

  function handleEmail(){
    MailComposer.composeAsync({
      recipients:[data.point.email],
      subject: 'Interesse na coleta de resíduos.'
    })
  }

  function handleWhatsApp(){
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse na coelta de resíduos.`);
  }

  if(!data.point){
    return null
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{uri: data.point.image_url}}/>
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>{data.items.map(item=>item.title).join(', ')}</Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatsApp}>
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={handleEmail}>
            <Icon name="mail" size={20} color="#fff" />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>
    </SafeAreaView>
  )
}

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});