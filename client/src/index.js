import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import reducer from './store/reducers/index';

const store = createStore(reducer, {}, applyMiddleware(reduxThunk));
const client = new ApolloClient({
  link: createUploadLink({
    uri:'http://localhost:4000/graphql'
  }),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
      <Provider store={store}>
           <App />
       </Provider>
     </ApolloProvider>
     ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
