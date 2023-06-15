import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import logger from 'redux-logger';
import createSagaMiddleware from '@redux-saga/core';
import {takeLatest, put} from 'redux-saga/effects';
import axios from 'axios';

// this startingPlantArray should eventually be removed
// const startingPlantArray = [
//   { id: 1, name: 'Rose' },
//   { id: 2, name: 'Tulip' },
//   { id: 3, name: 'Oak' }
// ];

const plantList = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return action.payload
    default:
      return state;
  }
};
function* fetchPlants(){
  try{
    const plantResponse = yield axios.get('/api/plant')

    yield put ({type: 'ADD_PLANT', payload: plantResponse.data});
    console.log(plantResponse.data);
  }catch(error){
    console.log('problem fetching plants=>', error);
  }
}
function* postPlants(action){
  try{
    yield axios.post('/api/plant', action.payload)
    yield put({type: 'FETCH_PLANTS'})
  }catch(error){
    console.log('error in the post=>', error);
  }
}
function* deletePlant(action){
  try{
    yield axios.delete(`/api/plant/${action.payload}`)

    yield put({type:'FETCH_PLANTS'});
  }catch(error){
    console.log('problem in deletePlant=>', error);
  }
}
function* rootSaga(){
  yield takeLatest('FETCH_PLANTS', fetchPlants);
  yield takeLatest('POST_PLANTS', postPlants);
  yield takeLatest('DELETE_PLANT', deletePlant);
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({ plantList }),
  applyMiddleware(sagaMiddleware, logger)
);
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);