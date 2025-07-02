import React from "react";

export default function Footer() {

  return (
    <>
      <footer className="bg-gray-100 text-gray-600 py-6 mt-12 border-t">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} Faculdade Exemplo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}