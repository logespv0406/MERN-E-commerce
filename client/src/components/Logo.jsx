const Logo = ({ size = 'md' }) => {
  const dimensions = {
    sm: { box: 40, font: 18, text: 16, tracking: '2px' },
    md: { box: 72, font: 34, text: 28, tracking: '3px' },
    lg: { box: 96, font: 46, text: 36, tracking: '4px' },
  };
  const d = dimensions[size];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={d.box} height={d.box} viewBox="0 0 72 72">
        <rect x="1" y="1" width="70" height="70" fill="none" stroke="#1a1a1a" strokeWidth="1" />
        <text
          x="36"
          y="47"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize={d.font}
          fill="#1a1a1a"
        >
          K
        </text>
      </svg>
      <p
        className="font-serif text-neutral-900 m-0"
        style={{ fontSize: d.text, letterSpacing: d.tracking }}
      >
        KASTRA
      </p>
    </div>
  );
};

export default Logo;