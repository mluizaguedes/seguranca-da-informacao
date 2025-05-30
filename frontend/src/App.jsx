import React from 'react';
import LogTable from './components/LogTable';
import UserForm from './components/UserForm';

function App() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-6">Dashboard de Incidentes</h1>
      <UserForm />
      <LogTable />
    </div>
  );
}

export default App;

