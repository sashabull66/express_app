import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Layout } from './shared/components/layout';

const rootSelector = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
rootSelector.render(
  <Provider store={store}>
    <BrowserRouter>
      <Layout>
        <Router />
      </Layout>
    </BrowserRouter>
  </Provider>,
);
