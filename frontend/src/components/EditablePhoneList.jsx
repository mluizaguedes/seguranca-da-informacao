import React, { useState, useEffect, useRef } from 'react';
import { IMaskInput } from 'react-imask';

function EditablePhoneList({ phones = [], onSave }) {
  const [current, setCurrent] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    const inicial = Array.isArray(phones) && phones.length > 0
      ? phones.map(p => p || '') // garante string
      : [''];
    setCurrent(inicial);
    setEditingIdx(null);
  }, [phones]);

  useEffect(() => {
    if (editingIdx !== null && inputRefs.current[editingIdx]) {
      inputRefs.current[editingIdx].focus();
    }
  }, [editingIdx]);

  const startEdit = idx => setEditingIdx(idx);

  const finishEdit = () => {
    const limpa = current
      .map(s => (s || '').trim())
      .filter(s => s !== '');
    setCurrent(limpa.length ? limpa : ['']);
    setEditingIdx(null);
    onSave(limpa);
  };

  const changePhone = (idx, val) => {
    const copia = [...current];
    copia[idx] = val || '';
    setCurrent(copia);
  };

  const addPhone = () => {
    setCurrent([...current, '']);
    setEditingIdx(current.length);
  };

  const removePhone = idx => {
    const copia = current.filter((_, i) => i !== idx);
    const limpa = copia
      .map(s => (s || '').trim())
      .filter(s => s !== '');
    setCurrent(limpa.length ? limpa : ['']);
    if (editingIdx === idx) setEditingIdx(null);
    else if (editingIdx > idx) setEditingIdx(editingIdx - 1);
    onSave(limpa);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600 block mb-1">Telefone(s)</label>
      {current.map((tel, idx) => {
        const safeTel = (tel || '').trim();
        return (
          <div key={idx} className="flex items-center gap-2">
            {editingIdx === idx ? (
              <IMaskInput
                mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]}
                value={tel}
                onAccept={val => changePhone(idx, val)}
                onBlur={finishEdit}
                onKeyDown={e => e.key === 'Enter' && finishEdit()}
                inputRef={el => (inputRefs.current[idx] = el)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none"
              />
            ) : (
              <span
                className="flex-1 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md border border-transparent"
                onClick={() => startEdit(idx)}
              >
                {safeTel || 'Adicionar telefone'}
              </span>
            )}

            {(current.length > 1 || (current.length === 1 && safeTel !== '')) && (
              <button
                type="button"
                onClick={() => removePhone(idx)}
                className="text-red-500 text-sm hover:underline"
              >
                Remover
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={addPhone}
        className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-sm text-blue-700"
      >
        + Adicionar Telefone
      </button>
    </div>
  );
}

export default EditablePhoneList;