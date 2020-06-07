import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet'

import axios from 'axios';

import './styles.css';
import Logo from '../../assets/logo.svg';

import api from '../../services/api';
import { LeafletMouseEvent } from 'leaflet';

import Dropzone from '../../components/Dropzone';

interface ItemsProps{
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFProps {
  sigla: string;
}

interface IBGECitiesProps {
  nome: string;
}

interface FormDataProps{
  name: string;
  email: string;
  whatsapp: string;
}
const CreatePoint: React.FC = () => {

  const [items, setItems] = useState<ItemsProps[]>([]);
  
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  const [initialPosition, setInitialPosition] = useState<[number,number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0, 0]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [formData, setFormData] = useState<FormDataProps>({name:'', email:'', whatsapp:''});
  
  const[selectedFile, setSelectedFile] = useState<File>();
  
  const history = useHistory();

  useEffect(() => {
    api.get<ItemsProps[]>('/items').then(({data}) => {
      setItems(data);
    })
  }, [])

  useEffect(()=>{
    axios.get<IBGEUFProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(({data})=>{
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

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords})=>{
      setInitialPosition([coords.latitude, coords.longitude]);
    })
  }, []);


  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target;
    setFormData({...formData, [name]: value});
  }

  function handleSelectedItem(id: number){

    if(selectedItems.includes(id)){
      const items = selectedItems.filter(item => item !== id);
      setSelectedItems(items);
    }else{
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    const {name, whatsapp, email} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('whatsapp', whatsapp);
    data.append('email', email);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    selectedFile && data.append('image', selectedFile);

    await api.post('/point', data);
    alert('Ponto de coleta criado!');
    history.goBack();

  }

  return (
    <div id="page-create-point">
      <header>
        <img src={Logo} alt="Ecoleta"/>
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>
        <Dropzone onFileUploaded={setSelectedFile}/>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">
              Nome da entidade
            </label>
            <input 
              onChange={handleInputChange}
              type="text" 
              name="name" 
              id="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">
                E-mail
              </label>
              <input 
                onChange={handleInputChange}
                type="email" 
                name="email" 
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">
                Whatsapp
              </label>
              <input 
                onChange={handleInputChange}
                type="text" 
                name="whatsapp" 
                id="whatsapp"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition} />

            </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf"> Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf} >{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map((city, index)=>(
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li 
              key={item.id} 
              onClick={()=>handleSelectedItem(item.id)}
              className={selectedItems.includes(item.id)?'selected': ''}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
            
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>

    </div>
  )
}

export default CreatePoint;