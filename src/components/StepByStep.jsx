const StepBlock = ({ number, title, children, defaultOpen }) => (
  <details className="step-expander" open={defaultOpen}>
    <summary>
      <span className="step-number">{number}</span>
      <strong>{title}</strong>
      <i className="bi bi-chevron-down ms-auto"></i>
    </summary>
    <div className="step-body">{children}</div>
  </details>
);

const FigureFraction = ({ numerator, denominator, label, colorClass = 'color-a', detail, simplified = false }) => {
  const safeDen = Math.max(1, Math.abs(Number(denominator) || 1));
  const safeNum = Math.max(0, Math.abs(Number(numerator) || 0));
  const displayDen = Math.min(safeDen, 18);
  const fillCount = Math.max(0, Math.min(displayDen, Math.round((safeNum / safeDen) * displayDen)));
  const compacted = safeDen > displayDen;
  return (
    <div className="figure-card compact-figure">
      {label && <div className="figure-label">{label}</div>}
      <div className={`figure-bar ${colorClass}`}>
        {Array.from({ length: displayDen }).map((_, idx) => (
          <span key={idx} className={`figure-segment ${idx < fillCount ? 'filled' : ''}`}></span>
        ))}
      </div>
      <div className="figure-caption">
        <strong>{numerator}/{denominator}</strong>
        {detail ? <span className="text-muted d-block mt-1">{detail}</span> : null}
        {compacted ? <span className="text-muted d-block small">Figura compacta para caber na tela.</span> : null}
        {simplified ? <span className="clean-pill success mt-2">equivalente</span> : null}
      </div>
    </div>
  );
};

const MiniFraction = ({ f }) => <span className="mini-frac"><span>{f.n}</span><b></b><span>{f.d}</span></span>;

const MultiplesBox = ({ value, highlight }) => {
  const limit = Math.max(6, Math.min(14, Math.ceil(highlight / value)));
  const multiples = Array.from({ length: limit }, (_, idx) => value * (idx + 1));
  if(!multiples.includes(highlight)) multiples.push(highlight);
  return (
    <div className="multiples-box compact-box">
      <div className="fw-bold mb-1">Múltiplos de {value}</div>
      <div className="d-flex flex-wrap gap-1">
        {multiples.map((m, idx) => <span key={idx} className={`multiple-pill ${m === highlight ? 'hit' : ''}`}>{m}</span>)}
      </div>
    </div>
  );
};

const GcdExplanation = ({ n, d, gcdValue }) => {
  let a = Math.abs(n), b = Math.abs(d);
  const steps = [];
  while(b){
    steps.push({ a, b, r: a % b });
    [a,b] = [b, a % b];
  }
  return (
    <>
      <p>Para simplificar, usamos o <strong>MDC</strong>, que é o maior número que divide o numerador e o denominador ao mesmo tempo.</p>
      <div className="calc-strip">MDC({Math.abs(n)}, {Math.abs(d)}) = <strong>{gcdValue}</strong></div>
      <div className="small text-muted mb-2">Pelo método das divisões sucessivas:</div>
      {steps.slice(0,5).map((s,idx)=>(
        <div className="calc-strip slim" key={idx}>{s.a} ÷ {s.b} deixa resto <strong>{s.r}</strong></div>
      ))}
      <div className="calc-strip">Então dividimos em cima e embaixo por {gcdValue}: <strong>{n}/{d} → {n / gcdValue}/{d / gcdValue}</strong></div>
    </>
  );
};

const ConversionExplanation = ({ result }) => {
  const f = result.simplified;
  const decimalRaw = f.n / f.d;
  const percentRaw = decimalRaw * 100;
  return (
    <>
      <p>Depois da fração simplificada, fazemos duas conversões: decimal e porcentagem.</p>
      <div className="conversion-grid">
        <div className="conversion-card">
          <span className="clean-pill">Decimal</span>
          <p className="mb-2 mt-2">Para transformar em decimal, dividimos o numerador pelo denominador.</p>
          <div className="calc-strip">{f.n} ÷ {f.d} = <strong>{result.decimal}</strong></div>
          <small className="text-muted">Valor calculado: {decimalRaw.toFixed(6).replace(/0+$/,'').replace(/\.$/,'')}</small>
        </div>
        <div className="conversion-card">
          <span className="clean-pill">Porcentagem</span>
          <p className="mb-2 mt-2">Para transformar em porcentagem, multiplicamos o decimal por 100.</p>
          <div className="calc-strip">{result.decimal} × 100 = <strong>{result.percent}</strong></div>
          <small className="text-muted">Valor calculado: {percentRaw.toFixed(4).replace(/0+$/,'').replace(/\.$/,'')}%</small>
        </div>
      </div>
    </>
  );
};

const StepByStep = ({ operation, result }) => {
  const fs = result.fractions;
  const colors = ['color-a', 'color-b', 'color-c', 'color-d', 'color-e'];
  const opName = FractionMath.label[operation].toLowerCase();
  const opSymbol = FractionMath.symbol[operation];
  const gcdValue = FractionMath.gcd(result.raw.n, result.raw.d);
  const hasMixed = fs.some(f => f.original && f.original.mixed);
  const isAddSub = operation === 'soma' || operation === 'subtracao';
  const common = isAddSub ? result.raw.common : null;
  const multipliers = isAddSub ? fs.map(f => common / f.d) : [];
  const converted = isAddSub ? fs.map((f, idx) => ({ n: f.n * multipliers[idx], d: common })) : [];
  const lcmInfo = isAddSub ? FractionMath.lcmDetails(fs.map(f=>f.d)) : null;
  const defaultOpen = window.innerWidth > 768;

  const expression = (items, symbol = opSymbol) => items.map((f, idx)=>(
    <React.Fragment key={idx}>{idx>0 && <span className="mx-2 fw-bold">{symbol}</span>}<MiniFraction f={f}/></React.Fragment>
  ));

  const renderIntro = () => (
    <StepBlock number="0" title="Leitura das frações e preparação" defaultOpen={defaultOpen}>
      <p>Primeiro identificamos cada fração. O <strong>numerador</strong> mostra quantas partes foram usadas. O <strong>denominador</strong> mostra em quantas partes iguais o inteiro foi dividido.</p>
      {hasMixed && <div className="calc-strip"><strong>Fração mista:</strong> antes do cálculo, convertemos para imprópria usando: inteiro × denominador + numerador. Ex.: 1 2/3 = (1 × 3 + 2)/3 = 5/3.</div>}
      <div className="formula-line compact-formula">{expression(fs)}</div>
      <div className="row g-2 mt-2">
        {fs.map((f, i)=>(
          <div className="col-6 col-md" key={i}>
            <FigureFraction numerator={Math.abs(f.n)} denominator={f.d} label={`Fração ${i + 1}`} detail={`${Math.abs(f.n)} parte(s) de ${f.d}.`} colorClass={colors[i % colors.length]} />
          </div>
        ))}
      </div>
    </StepBlock>
  );

  const renderAddSub = () => (
    <>
      {renderIntro()}
      <StepBlock number="1" title="Antes e depois do MMC: por que ele é necessário" defaultOpen={defaultOpen}>
        <p>Na {opName}, as frações precisam ter partes do <strong>mesmo tamanho</strong>. Quando os denominadores são diferentes, cada figura está cortada de um jeito. O MMC cria um denominador comum, ou seja, um mesmo tamanho de pedaço para todas.</p>
        <div className="before-after-grid">
          <div>
            <h6 className="fw-bold">Antes</h6>
            <div className="row g-2">
              {fs.map((f,i)=><div className="col-6" key={i}><FigureFraction numerator={Math.abs(f.n)} denominator={f.d} label={`${f.n}/${f.d}`} detail={`partes de 1/${f.d}`} colorClass={colors[i%colors.length]}/></div>)}
            </div>
          </div>
          <div>
            <h6 className="fw-bold">Depois do MMC = {common}</h6>
            <div className="row g-2">
              {converted.map((f,i)=><div className="col-6" key={i}><FigureFraction numerator={Math.abs(f.n)} denominator={f.d} label={`${fs[i].n}/${fs[i].d} → ${f.n}/${f.d}`} detail={`agora em partes de 1/${common}`} colorClass={colors[i%colors.length]} simplified/></div>)}
            </div>
          </div>
        </div>
      </StepBlock>

      <StepBlock number="2" title="Como calcular o MMC de forma didática e correta" defaultOpen={defaultOpen}>
        <p>O <strong>MMC</strong> é o menor número que é múltiplo de todos os denominadores. Podemos conferir pelos múltiplos e também pela decomposição em fatores primos.</p>
        <div className="row g-2">
          {fs.map((f,idx)=><div className="col-md" key={idx}><MultiplesBox value={f.d} highlight={common}/></div>)}
        </div>
        <div className="calc-strip mt-3"><strong>Denominadores:</strong> {fs.map(f=>f.d).join(', ')}. O menor múltiplo comum encontrado foi <strong>{common}</strong>.</div>
        <div className="factor-grid">
          {fs.map((f,idx)=>(
            <div className="factor-card" key={idx}>
              <strong>{f.d}</strong>
              <span>{FractionMath.factorText(f.d)}</span>
            </div>
          ))}
        </div>
        <div className="calc-strip">Pegamos cada fator primo com o <strong>maior expoente</strong>: {lcmInfo.parts.map(p=>`${p.prime}${p.exp>1 ? '^'+p.exp : ''}`).join(' × ') || '1'} = <strong>{common}</strong>.</div>
      </StepBlock>

      <StepBlock number="3" title="Transformação visual em frações equivalentes" defaultOpen={defaultOpen}>
        <p>Agora cada fração ganha o denominador <strong>{common}</strong>. Para manter o mesmo valor, multiplicamos o numerador e o denominador pelo mesmo multiplicador.</p>
        {fs.map((f, idx)=>(
          <div className="equivalence-row responsive-equivalence" key={idx}>
            <FigureFraction numerator={Math.abs(f.n)} denominator={f.d} label={`Original: ${f.n}/${f.d}`} detail={`Denominador ${f.d}`} colorClass={colors[idx%colors.length]} />
            <div className="equivalence-arrow"><span>× {multipliers[idx]}</span><i className="bi bi-arrow-right"></i><small>{common} ÷ {f.d}</small></div>
            <FigureFraction numerator={Math.abs(converted[idx].n)} denominator={converted[idx].d} label={`Equivalente: ${converted[idx].n}/${converted[idx].d}`} detail={`Mesmo valor, agora com denominador ${common}.`} colorClass={colors[idx%colors.length]} simplified />
          </div>
        ))}
      </StepBlock>

      <StepBlock number="4" title={`Fazemos a ${opName} e simplificamos`} defaultOpen={defaultOpen}>
        <p>Como os denominadores já são iguais, mantemos o denominador <strong>{common}</strong> e calculamos apenas os numeradores.</p>
        <div className="formula-line compact-formula">
          {operation === 'soma'
            ? converted.map((f, idx)=><React.Fragment key={idx}>{idx>0 && <span className="mx-2 fw-bold">+</span>}{f.n}</React.Fragment>)
            : result.raw.nums.map((n, idx)=><React.Fragment key={idx}>{idx>0 && <span className="mx-2 fw-bold">{n < 0 ? '−' : '+'}</span>}{Math.abs(n)}</React.Fragment>)}
          <span className="mx-2 fw-bold">=</span><strong>{result.raw.n}</strong>
        </div>
        <div className="calc-strip">Fração encontrada antes da simplificação: <strong>{result.raw.n}/{result.raw.d}</strong></div>
        <GcdExplanation n={result.raw.n} d={result.raw.d} gcdValue={gcdValue}/>
      </StepBlock>

      <StepBlock number="5" title="Conversão para decimal e porcentagem" defaultOpen={defaultOpen}>
        <ConversionExplanation result={result}/>
      </StepBlock>
    </>
  );

  const renderMult = () => {
    const nums = fs.map(f=>f.n);
    const dens = fs.map(f=>f.d);
    return <>
      {renderIntro()}
      <StepBlock number="1" title="Aqui não precisa de MMC" defaultOpen={defaultOpen}><p>Na multiplicação não juntamos partes de tamanhos diferentes. Multiplicamos numerador com numerador e denominador com denominador.</p></StepBlock>
      <StepBlock number="2" title="Multiplicamos os numeradores" defaultOpen={defaultOpen}><div className="calc-strip">{nums.join(' × ')} = <strong>{result.raw.n}</strong></div></StepBlock>
      <StepBlock number="3" title="Multiplicamos os denominadores" defaultOpen={defaultOpen}><div className="calc-strip">{dens.join(' × ')} = <strong>{result.raw.d}</strong></div><div className="formula-line compact-formula">Resultado inicial: <strong>{result.raw.n}/{result.raw.d}</strong></div></StepBlock>
      <StepBlock number="4" title="Simplificação pelo MDC" defaultOpen={defaultOpen}><GcdExplanation n={result.raw.n} d={result.raw.d} gcdValue={gcdValue}/></StepBlock>
      <StepBlock number="5" title="Conversão para decimal e porcentagem" defaultOpen={defaultOpen}><ConversionExplanation result={result}/></StepBlock>
    </>;
  };

  const renderDiv = () => {
    const inverted = fs.map((f, idx) => idx === 0 ? f : { n:f.d, d:f.n });
    const nums = inverted.map(f=>f.n);
    const dens = inverted.map(f=>f.d);
    return <>
      {renderIntro()}
      <StepBlock number="1" title="Aqui não precisa de MMC" defaultOpen={defaultOpen}><p>Na divisão de frações, a estratégia é transformar a divisão em multiplicação. Mantemos a primeira fração e invertemos as próximas.</p></StepBlock>
      <StepBlock number="2" title="Conserva a primeira e inverte as demais" defaultOpen={defaultOpen}>{fs.slice(1).map((f,idx)=><div className="calc-strip" key={idx}>{f.n}/{f.d} vira <strong>{f.d}/{f.n}</strong></div>)}<div className="formula-line compact-formula">{expression(inverted, '×')}</div></StepBlock>
      <StepBlock number="3" title="Multiplicamos numeradores e denominadores" defaultOpen={defaultOpen}><div className="calc-strip">Numeradores: {nums.join(' × ')} = <strong>{result.raw.n}</strong></div><div className="calc-strip">Denominadores: {dens.join(' × ')} = <strong>{result.raw.d}</strong></div></StepBlock>
      <StepBlock number="4" title="Simplificação pelo MDC" defaultOpen={defaultOpen}><GcdExplanation n={result.raw.n} d={result.raw.d} gcdValue={gcdValue}/></StepBlock>
      <StepBlock number="5" title="Conversão para decimal e porcentagem" defaultOpen={defaultOpen}><ConversionExplanation result={result}/></StepBlock>
    </>;
  };

  return (
    <div className="steps-wrap">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h3 className="route-title mb-0"><i className="bi bi-list-check me-2"></i>Passo a passo</h3>
        <span className="badge-soft">explicado por etapas</span>
      </div>
      {isAddSub ? renderAddSub() : operation === 'multiplicacao' ? renderMult() : renderDiv()}
    </div>
  );
};
