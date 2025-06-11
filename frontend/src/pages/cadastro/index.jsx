import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios';

export default function Cadastro({ cookieConsent }) {
    const [telefones, setTelefones] = useState([''])
    const [cursos, setCursos] = useState([])

    const nomeRef = useRef()
    const emailRef = useRef()
    const senhaRef = useRef()
    const dataRef = useRef()
    const cpfRef = useRef()
    const cursoRef = useRef(null)

    //opt in opt out
    const [optInNews, setOptInNews] = useState(false);
    const [optInShare, setOptInShare] = useState(false);
    const [optInTerms, setOptInTerms] = useState(false);

    /*useEffect(() => {
        axios.get('/cursos')
            .then(response => {
                setCursos(response.data)
            })
            .catch(error => {
                console.error('Erro ao buscar cursos:', error)
            })
    }, [])*/

    function handleTelefoneChange(index, value) {
        const novosTelefones = [...telefones]
        novosTelefones[index] = value
        setTelefones(novosTelefones)
    }

    function adicionarTelefone() {
        setTelefones([...telefones, ''])
    }

    const removerTelefone = (index) => {
        const novosTelefones = telefones.filter((_, i) => i !== index)
        setTelefones(novosTelefones)
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (cookieConsent === null) {
            alert('Consentimento ainda não carregado. Tente novamente em instantes.');
            return;
        }

        if (!optInTerms) {
            alert('Você precisa aceitar os Termos de Uso para continuar.');
            return;
        }

        try {
            const userData = await axios.post('http://localhost:3000/register', {
            nome: nomeRef.current.value,
            email: emailRef.current.value,
            senha: senhaRef.current.value,
            data: dataRef.current.value,
            cpf: cpfRef.current.value,
            curso: cursoRef.current.value,
            telefone: telefones, 
            optInNews,
            optInShare,
            optInTerms,
            cookies: cookieConsent,
            });
            alert('Aluno cadastrado com sucesso.')
            console.log("Dados enviados:", userData); 

        } catch (error) {
            alert('Erro ao cadastrar.')
        }
    }

    return (
        <div className='max-w-md mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-6 text-center text-gray-800'>Cadastro</h2>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>

                <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder="Nome Completo"
                    type="text"
                    ref={nomeRef}
                />

                <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder="Email"
                    type="email"
                    ref={emailRef}
                />

                <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder="Senha"
                    type="password"
                    ref={senhaRef}
                />

                <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder="Data de nascimento"
                    type="date"
                    ref={dataRef}
                />

                <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder="CPF"
                    type="text"
                    ref={cpfRef}
                />

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    ref={cursoRef}
                >
                    <option value="">Selecione um curso</option>
                    {cursos.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                            {curso.nome}
                        </option>
                    ))}
                </select>

                {/* Telefones com remover */}
                {telefones.map((telefone, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            placeholder={`Telefone ${index + 1}`}
                            type="text"
                            value={telefone}
                            onChange={(e) => handleTelefoneChange(index, e.target.value)}
                        />
                        {telefones.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removerTelefone(index)}
                                className="text-red-500 text-sm hover:underline"
                            >
                                Remover
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={adicionarTelefone}
                    className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded text-sm text-blue-700"
                >
                    + Adicionar Telefone
                </button>

                <div className="space-y-4 mt-4">
                    {/* Termo 1 - Novidades */}
                    <div className="border border-gray-200 rounded-md p-3">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={optInNews}
                                onChange={(e) => setOptInNews(e.target.checked)}
                                className="mt-1"
                            />
                            <div>
                                <p className="font-medium">Quero receber novidades e avisos por e-mail (Opcional)</p>
                                <p className="text-sm text-gray-600">
                                    Ao marcar esta opção, você autoriza o envio de novidades, atualizações e comunicados por e-mail.
                                    Isso nos ajuda a mantê-lo informado sobre oportunidades e eventos importantes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Termo 2 - Compartilhamento */}
                    <div className="border border-gray-200 rounded-md p-3">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={optInShare}
                                onChange={(e) => setOptInShare(e.target.checked)}
                                className="mt-1"
                            />
                            <div>
                                <p className="font-medium">Autorizo o compartilhamento dos meus dados com parceiros educacionais (Opcional)</p>
                                <p className="text-sm text-gray-600">
                                    Permite que seus dados sejam compartilhados com instituições parceiras com o objetivo de oferecer conteúdos ou benefícios educacionais.
                                    Esta permissão é totalmente opcional e revogável a qualquer momento.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Termo 3 - Termos de Uso */}
                <div className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={optInTerms}
                            onChange={(e) => setOptInTerms(e.target.checked)}
                            className="mt-1"
                        />
                        <div>
                            <p className="text-sm text-gray-700">
                                Eu li e concordo com os <Link to="/termos-de-uso" className="text-blue-500 underline">Termos de Uso</Link> e a <Link to="/politica-de-privacidade" className="text-blue-500 underline">Política de Privacidade</Link>.
                            </p>
                        </div>
                    </div>
                </div>
                
                <button className='w-full bg-gray-300/100 py-2 px-4 rounded-md hover:bg-gray-200'>Cadastrar-se</button>
            </form>
            
            <Link to="/login" className='text-blue-400 hover:underline mt-4 block text-center'>Já tem uma conta? Faça login</Link>
        </div>
    )
}