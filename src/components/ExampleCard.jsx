const ExampleCard = ({ example, operation, selected, onSelect }) => {
  const result = FractionMath.calc(operation, example.fractions);
  return (
    <div className={`card example-card ${selected ? 'selected' : ''}`} onClick={()=>onSelect(example)} role="button" tabIndex="0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge-soft">{example.title}</span>
          <i className="bi bi-cursor-fill text-primary"></i>
        </div>
        <div className="math-line">
          <ExpressionView fractions={example.fractions} operation={operation} />
        </div>
        <div className="mt-3 small text-muted fw-bold">Clique para abrir o passo a passo</div>
        <div className="mt-2 fw-bold text-success">= {result.text} | {result.decimal} | {result.percent}</div>
      </div>
    </div>
  );
};
