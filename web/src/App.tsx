//import React, {useEffect, useState} from 'react';
import React from 'react';
import './App.css';
import Routes from './routes';
//import api from './services/api';

function App() {
  // const [users, setUsers] = useState([]);
  // useEffect(() => {
  //   const getUsers = async():Promise<void> => {
  //     const result = await api.get('/users');
  //     setUsers(result.data);
  //   }
  //   getUsers()
  // },[]);


  return (<Routes />);
}

export default App;
