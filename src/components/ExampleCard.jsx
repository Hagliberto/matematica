const ExampleCard = ({ example, operation, selected, onSelect }) => {
  const result = FractionMath.calc(operation, example.fractions);
  const denominators = result.fractions.map(f=>f.d).join(', ');
  return (
    <div className={`example-card panel p-3 ${selected ? 'selected' : ''}`} onClick={()=>onSelect(example)}>
      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
        <span className="badge-soft">{example.title}</span>
        <span className="example-count">{example.fractions.length} frações</span>
      </div>
      <div className="math-line compact mb-2">
        {result.fractions.map((f,idx)=>(
          <React.Fragment key={idx}>
            {idx>0 && <span className="operator-bubble small-op">{FractionMath.symbol[operation]}</span>}
            <span className="fraction mini"><span>{f.n}</span><span className="bar"></span><span>{f.d}</span></span>
          </React.Fragment>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 mb-2">
        <span className="clean-pill">Fração: <strong>{result.text}</strong></span>
        <span className="clean-pill">Decimal: <strong>{result.decimal}</strong></span>
      </div>
      <div className="small text-muted">
        Denominadores: {denominators}. {operation === 'soma' || operation === 'subtracao' ? `MMC: ${result.raw.common}.` : 'Sem MMC nesta operação.'}
      </div>
    </div>
  );
};
