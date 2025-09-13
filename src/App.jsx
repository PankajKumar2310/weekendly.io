// src/App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './redux/store';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import PreviewPage from './pages/PreviewPage';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout key="home"><HomePage /></Layout>} />
            <Route path="/preview" element={<Layout key="preview"><PreviewPage /></Layout>} />
          </Routes>
        </Router>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;