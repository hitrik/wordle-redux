const Letter = ({ letter, color = "transparent" }) => (
  <div style={{ backgroundColor: color }} className="letter">
    {letter}
  </div>
);

const Line = ({ letters, colors }) => {
  return (
    <div className="line">
      {letters.map((letter, index) => (
        <Letter key={index} letter={letter} color={colors[index]} />
      ))}
    </div>
  );
};

export { Letter, Line };
