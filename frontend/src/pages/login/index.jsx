import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!email || !senha) {
            setError('Por favor preencha todos os campos.')
            return
        }

        try {
            const response = await api.post('/login', { email, senha })
            const { token, user } = response.data

            localStorage.setItem('token', token)
            console.log("token:", token)
            localStorage.setItem('user', JSON.stringify(user))
            console.log("user:", user)

            if (user.isAdmin) {
                navigate('/perfil-admin');
            } else {
                navigate('/perfil');
            }
        } catch (err) {
            console.error('Erro no login:', err)
            const msg = err.response?.data?.message || 'Erro ao fazer login.'
            setError(msg)
        }
    }

    return (
        <div className='max-w-md mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-6 text-center text-gray-800'>Login</h2>
            {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <input
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder='Email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder='Senha'
                    type='password'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button
                    type='submit'
                    className='w-full bg-gray-300/100 py-2 px-4 rounded-md hover:bg-gray-200'
                >
                    Entrar
                </button>
            </form>

            <Link
                to="/"
                className="text-blue-500 hover:underline mt-4 block text-center"
            >
                Não tem uma conta? Faça o cadastro
            </Link>
        </div>
    )
}