const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 72 72">
            <rect x="1" y="1" width="70" height="70" fill="none" stroke="#1a1a1a" strokeWidth="1" />
            <text x="36" y="47" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="34" fill="#1a1a1a">K</text>
          </svg>
          <span className="font-serif text-lg text-neutral-900">Kastra</span>
        </div>
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          © {new Date().getFullYear()} Kastra. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;