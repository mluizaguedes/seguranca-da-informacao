import React from 'react';
import { IMaskInput } from 'react-imask';

export default function EditableEmergencyContact({
  contato = { nome: '', telefone: '' },
  onChange,
  onRemove
}) {
  const handleField = field => e =>
    onChange({ ...contato, [field]: e.target.value });

  const handlePhoneAccept = val =>
    onChange({ ...contato, telefone: val });

  return (
    <div className="space-y-4 p-4 border rounded max-w-md relative">
      {/* Botão de remover no canto superior direito */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          Remover
        </button>
      )}

      <label className="block font-semibold text-lg">Contato de Emergência</label>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Nome</label>
        <input
          type="text"
          placeholder="Nome do contato"
          value={contato.nome}
          onChange={handleField('nome')}
          className="w-full border p-2 rounded focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Telefone</label>
        <IMaskInput
          mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]}
          value={contato.telefone}
          onAccept={handlePhoneAccept}
          placeholder="(00) 00000-0000"
          className="w-full border p-2 rounded focus:outline-none"
        />
      </div>
    </div>
  );
}