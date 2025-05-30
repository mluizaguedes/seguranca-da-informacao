import React, { useEffect, useState } from 'react';
import { fetchLogs } from '../api';

export default function LogTable() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs().then(res => setLogs(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Logs de Notificações</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>ID Incidente</th><th>Descrição</th><th>Email</th><th>Enviado em</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l,i) => (
            <tr key={i}>
              <td>{l.incidentId}</td>
              <td>{l.description}</td>
              <td>{l.email}</td>
              <td>{new Date(l.sentAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
