const StepByStep = ({ operation, result }) => {
  const fs = result.fractions;
  const stepTitle = {
    soma:'Somar frações', subtracao:'Subtrair frações', multiplicacao:'Multiplicar frações', divisao:'Dividir frações'
  }[operation];
  const renderAddSub = () => (
    <>
      <div className="step-card"><span className="step-number">1</span><strong>Igualamos os denominadores.</strong><p className="mb-0 mt-2">O MMC dos denominadores é <strong>{result.raw.common}</strong>. Assim todas as frações passam a falar a mesma “língua”.</p></div>
      <div className="step-card"><span className="step-number">2</span><strong>Ajustamos os numeradores.</strong><p className="mb-0 mt-2">Os novos numeradores são: <strong>{result.raw.nums.join(operation === 'soma' ? ' + ' : ' − ').replace('− -','+ ')}</strong>.</p></div>
      <div className="step-card"><span className="step-number">3</span><strong>Calculamos.</strong><p className="mb-0 mt-2">Ficou <strong>{result.raw.n}/{result.raw.d}</strong>. Depois simplificamos para <strong>{result.text}</strong>.</p></div>
    </>
  );
  const renderMult = () => (
    <>
      <div className="step-card"><span className="step-number">1</span><strong>Multiplicamos os numeradores.</strong><p className="mb-0 mt-2">{fs.map(f=>f.n).join(' × ')} = <strong>{result.raw.n}</strong>.</p></div>
      <div className="step-card"><span className="step-number">2</span><strong>Multiplicamos os denominadores.</strong><p className="mb-0 mt-2">{fs.map(f=>f.d).join(' × ')} = <strong>{result.raw.d}</strong>.</p></div>
      <div className="step-card"><span className="step-number">3</span><strong>Simplificamos.</strong><p className="mb-0 mt-2">A fração <strong>{result.raw.n}/{result.raw.d}</strong> vira <strong>{result.text}</strong>.</p></div>
    </>
  );
  const renderDiv = () => (
    <>
      <div className="step-card"><span className="step-number">1</span><strong>Mantemos a primeira fração.</strong><p className="mb-0 mt-2">A primeira fração continua igual.</p></div>
      <div className="step-card"><span className="step-number">2</span><strong>Invertemos as próximas frações.</strong><p className="mb-0 mt-2">Dividir por uma fração é multiplicar pelo inverso dela.</p></div>
      <div className="step-card"><span className="step-number">3</span><strong>Multiplicamos e simplificamos.</strong><p className="mb-0 mt-2">Chegamos em <strong>{result.raw.n}/{result.raw.d}</strong>, que simplifica para <strong>{result.text}</strong>.</p></div>
    </>
  );
  return (
    <div className="panel p-4 h-100">
      <h3 className="route-title mb-3"><i className="bi bi-magic me-2 text-warning"></i>{stepTitle} passo a passo</h3>
      {operation === 'soma' || operation === 'subtracao' ? renderAddSub() : operation === 'multiplicacao' ? renderMult() : renderDiv()}
      <div className="step-card bg-light mb-0"><span className="step-number bg-success">✓</span><strong>Também em decimal e porcentagem:</strong><p className="mb-0 mt-2">Decimal: <strong>{result.decimal}</strong> | Porcentagem: <strong>{result.percent}</strong>.</p></div>
    </div>
  );
};
