export default function Login() {
    return (
        <div className='max-w-md mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-6 text-center text-gray-800'>Login</h2>
            <form className='flex flex-col gap-5'>
                <input
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder="Email"
                    type="email"
                />
                <input
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                    placeholder="Senha"
                    type="password"
                />
                <button className='w-full bg-gray-300/100 py-2 px-4 rounded-md hover:bg-gray-200'>Entrar</button>
            </form>
        </div>
    )
}