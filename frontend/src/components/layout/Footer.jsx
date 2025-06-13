import { Link } from 'react-router-dom'

export default function Footer({ onOpenPrivacySettings }) {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 mt-12 border-t">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Faculdade Exemplo. Todos os direitos reservados.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0 text-sm">
          <Link to="/politica-de-privacidade" className="hover:underline hover:text-blue-600">
            POLÍTICA DE PRIVACIDADE
          </Link>
          {' '}
          <Link to="/termos-de-uso" className="hover:underline hover:text-blue-600">
            TERMOS DE USO
          </Link>
          {' '}
          <span
            onClick={onOpenPrivacySettings}
            className="text-gray-600 hover:underline hover:text-blue-600 cursor-pointer"
          >
            CONFIGURAÇÕES DE PRIVACIDADE
          </span>
        </div>
      </div>
    </footer>
  );
}