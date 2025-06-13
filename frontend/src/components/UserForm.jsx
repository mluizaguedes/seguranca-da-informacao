{/*import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'


export default function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');
    try {
      const res = await axios.post('http://localhost:3000/register', { name, email });
      setStatus('Usuário cadastrado com sucesso!');
      setName('');
      setEmail('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setStatus(`Erro: ${err.response.data.error}`);
      } else {
        setStatus('Erro ao cadastrar');
      }
    }
  };

  return (
    <div className="p-4 border rounded mb-6">
      <h2 className="text-xl mb-4">Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nome:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}*/}
