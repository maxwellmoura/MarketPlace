export default function Footer(){
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Marketplace. Todos os direitos reservados.
      </div>
    </footer>
  );
}
