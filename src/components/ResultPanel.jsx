const FractionView = ({ f }) => (
  <span className="fraction"><span>{f.n}</span><span className="bar"></span><span>{f.d}</span></span>
);

const ExpressionView = ({ fractions, operation }) => (
  <span>
    {fractions.map((f, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <span className="operator-bubble">{FractionMath.symbol[operation]}</span>}
        <FractionView f={f} />
      </React.Fragment>
    ))}
  </span>
);

const ResultPill = ({ label, value, icon }) => (
  <span className="result-pill clean-result-pill">
    <i className={`bi ${icon}`}></i>
    <span>{label}</span>
    <strong>{value}</strong>
  </span>
);

const ResultPanel = ({ operation, result }) => {
  const gcdValue = FractionMath.gcd(result.raw.n, result.raw.d);
  const hasMixed = result.fractions.some(f => f.original && f.original.mixed);
  const mmcText = operation === 'soma' || operation === 'subtracao' ? `MMC ${result.raw.common}` : 'sem MMC';
  return (
    <div className="result-box h-100">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
        <span className="badge-soft small-badge"><i className="bi bi-stars me-1"></i>Resultado</span>
        <span className="clean-pill">{FractionMath.label[operation]}</span>
      </div>
      <div className="math-line result-expression mb-2">
        <ExpressionView fractions={result.fractions} operation={operation} />
        <span className="operator-bubble bg-success-subtle text-success">=</span>
        <FractionView f={result.simplified} />
      </div>
      <div className="result-pills mb-2">
        <ResultPill label="Fração" value={result.text} icon="bi-vinyl" />
        <ResultPill label="Mista" value={result.mixed} icon="bi-layers" />
        <ResultPill label="Decimal" value={result.decimal} icon="bi-123" />
        <ResultPill label="%" value={result.percent} icon="bi-percent" />
      </div>
      <div className="result-mini-steps">
        <span>1. {hasMixed ? 'converter mistas' : 'ler frações'}</span>
        <span>2. {mmcText}</span>
        <span>3. MDC {gcdValue}</span>
        <span>4. decimal e %</span>
      </div>
    </div>
  );
};
