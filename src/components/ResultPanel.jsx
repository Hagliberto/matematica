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

const ResultPanel = ({ operation, result }) => (
  <div className="result-box h-100">
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
      <span className="badge-soft"><i className="bi bi-stars me-1"></i> Resultado atualizado</span>
      <span className="fw-bold text-primary">{FractionMath.label[operation]}</span>
    </div>
    <div className="math-line mb-3">
      <ExpressionView fractions={result.fractions} operation={operation} />
      <span className="operator-bubble bg-success-subtle text-success">=</span>
      <FractionView f={result.simplified} />
    </div>
    <div className="row g-3">
      <div className="col-md-4"><div className="p-3 rounded-4 bg-white"><div className="small text-muted fw-bold">Fração</div><div className="h4 mb-0">{result.text}</div></div></div>
      <div className="col-md-4"><div className="p-3 rounded-4 bg-white"><div className="small text-muted fw-bold">Decimal</div><div className="h4 mb-0">{result.decimal}</div></div></div>
      <div className="col-md-4"><div className="p-3 rounded-4 bg-white"><div className="small text-muted fw-bold">Porcentagem</div><div className="h4 mb-0">{result.percent}</div></div></div>
    </div>
  </div>
);
