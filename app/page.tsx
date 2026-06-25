import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configura estas vari    asd  ables en tu entorno de Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RedEmergencia() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  
  // Estado para el formulario de registro
  const [form, setForm] = useState({ nombre_completo: '', cedula: '', hospital_clinica: '', estado: '' });

  // Buscador para familiares
  const buscarFamiliar = async (e) => {
    e.preventDefault();
    const { data } = await supabase
      .from('heridos')
      .select('*')
      .or(`cedula.eq.${busqueda},nombre_completo.ilike.%${busqueda}%`);
      
    if (data) setResultados(data);
  };

  // Registro de pacientes (Para voluntarios)
  const registrarPaciente = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('heridos').insert([form]);
    if (!error) {
      alert('Paciente registrado en el sistema.');
      setForm({ nombre_completo: '', cedula: '', hospital_clinica: '', estado: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold text-red-700 mb-8 border-b pb-2">
        Registro Nacional de Pacientes - Emergencia 24J
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* SECCIÓN DE BÚSQUEDA */}
        <div className="p-6 bg-gray-50 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Buscador de Familiares</h2>
          <form onSubmit={buscarFamiliar} className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Ingresa Cédula o Nombre..." 
              className="border p-2 w-full rounded"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Buscar
            </button>
          </form>

          <div className="space-y-3">
            {resultados.map(paciente => (
              <div key={paciente.id} className="p-4 bg-white border border-l-4 border-l-blue-500 rounded">
                <p className="text-lg font-bold">{paciente.nombre_completo}</p>
                <p className="text-sm text-gray-600">C.I: {paciente.cedula}</p>
                <p className="mt-2"><strong>Ubicación:</strong> {paciente.hospital_clinica}</p>
                <p><strong>Estado:</strong> {paciente.estado}</p>
              </div>
            ))}
            {resultados.length === 0 && busqueda && <p className="text-gray-500">No hay registros aún.</p>}
          </div>
        </div>

        {/* SECCIÓN DE REGISTRO */}
        <div className="p-6 bg-red-50 border border-red-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-red-800">Registro Clínico (Uso Interno)</h2>
          <form onSubmit={registrarPaciente} className="flex flex-col gap-4">
            <input 
              type="text" placeholder="Nombre completo" className="border p-2 rounded"
              value={form.nombre_completo} onChange={e => setForm({...form, nombre_completo: e.target.value})} required
            />
            <input 
              type="text" placeholder="Cédula de Identidad" className="border p-2 rounded"
              value={form.cedula} onChange={e => setForm({...form, cedula: e.target.value})} required
            />
            <input 
              type="text" placeholder="Hospital o Clínica (Ej. Hospital Central)" className="border p-2 rounded"
              value={form.hospital_clinica} onChange={e => setForm({...form, hospital_clinica: e.target.value})} required
            />
            <select 
              className="border p-2 rounded"
              value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} required>
              <option value="">Seleccione el estado...</option>
              <option value="Estable">Estable</option>
              <option value="Crítico">Crítico</option>
              <option value="Dado de alta">Dado de alta</option>
            </select>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold">
              Registrar Herido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}