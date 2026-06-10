const OperationLayout = ({ operation, title, subtitle, icon, color }) => {
  const examples = React.useMemo(()=>FractionMath.makeExamples(operation, 50), [operation]);
  const [selected, setSelected] = React.useState(examples[0]);
  const [fractions, setFractions] = React.useState(examples[0].fractions.slice(0,2).map(f=>({...f})));
  const [query, setQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('passos');
  const [allowMixed, setAllowMixed] = React.useState(false);

  React.useEffect(()=>{
    setSelected(examples[0]);
    setFractions(examples[0].fractions.slice(0,2).map(f=>({...f})));
    setQuery('');
    setActiveTab('passos');
    setAllowMixed(false);
  }, [operation]);

  const result = React.useMemo(()=>FractionMath.calc(operation, fractions), [operation, fractions]);
  const filtered = examples.filter(ex => {
    const r = FractionMath.calc(operation, ex.fractions);
    const hay = `${ex.title} ${r.text} ${r.decimal} ${r.percent} ${ex.fractions.map(f=>`${f.n}/${f.d}`).join(' ')}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });
  const choose = (ex) => {
    setSelected(ex);
    setFractions(ex.fractions.slice(0, Math.min(5, ex.fractions.length)).map(f=>({...f, mixed:false, w:0})));
    setActiveTab('passos');
    window.scrollTo({top:120, behavior:'smooth'});
  };
  const updateFraction = (idx, next) => setFractions(prev => prev.map((f,i)=>i===idx ? next : f));
  const addFraction = () => fractions.length < 5 && setFractions(prev => [...prev, {n:1,d:2,w:0,mixed:false}]);
  const removeFraction = () => fractions.length > 2 && setFractions(prev => prev.slice(0,-1));
  const toggleMixedGlobal = (checked) => {
    setAllowMixed(checked);
    if(!checked){
      setFractions(prev => prev.map(f => {
        if(!f.mixed) return {...f, mixed:false, w:0};
        const d = Math.max(1, Number(f.d)||1);
        return {...f, n:(Math.abs(Number(f.w)||0)*d) + Math.abs(Number(f.n)||0), w:0, mixed:false};
      }));
    }
  };

  return (
    <>
      <section className="hero hero-clean mb-3">
        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
          <div>
            <div className="h4 fw-black route-title mb-1"><i className={`bi ${icon} me-2`}></i>{title}</div>
            <p className="mb-0 text-muted small">MMC quando necessário • edição até 5 frações • resultado automático</p>
          </div>
          <span className="clean-pill big"><i className="bi bi-lightning-charge"></i>50 exemplos</span>
        </div>
      </section>

      <section className="row g-3 mb-3">
        <div className="col-xl-4">
          <div className="panel p-3 p-lg-4 h-100 lab-panel">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <h3 className="route-title mb-0 h4">Laboratório</h3>
              <div className="btn-group no-print compact-btns">
                <button className="btn btn-sm btn-outline-primary" onClick={addFraction} disabled={fractions.length>=5}><i className="bi bi-plus-circle me-1"></i>Adicionar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={removeFraction} disabled={fractions.length<=2}><i className="bi bi-dash-circle me-1"></i>Remover</button>
              </div>
            </div>
            <p className="text-muted mb-2 small">Começa com 2 frações. Você pode editar e adicionar até 5.</p>
            <div className="mixed-option mb-3">
              <label className="d-flex align-items-start gap-2 mb-0">
                <input className="form-check-input mt-1" type="checkbox" checked={allowMixed} onChange={e=>toggleMixedGlobal(e.target.checked)} />
                <span><strong>Frações mistas</strong><br/><small className="text-muted">Ex.: 1 2/3 → vira imprópria antes do cálculo.</small></span>
              </label>
            </div>
            <div className="row g-2">
              {fractions.map((f,idx)=><div className="col-6 col-md-4 col-xl-6" key={idx}><FractionInput fraction={f} index={idx} onChange={updateFraction} allowMixed={allowMixed} /></div>)}
            </div>
          </div>
        </div>
        <div className="col-xl-8"><ResultPanel operation={operation} result={result} /></div>
      </section>

      <section className="panel p-2 p-lg-4 mb-4 content-panel">
        <ul className="nav nav-pills fraction-tabs no-print mb-3" role="tablist">
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${activeTab==='passos' ? 'active' : ''}`} onClick={()=>setActiveTab('passos')} type="button"><i className="bi bi-list-check me-1"></i>Passo a passo</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${activeTab==='exemplos' ? 'active' : ''}`} onClick={()=>setActiveTab('exemplos')} type="button"><i className="bi bi-grid-3x3-gap me-1"></i>Exemplos</button>
          </li>
        </ul>
        {activeTab === 'passos' ? (
          <StepByStep operation={operation} result={result} />
        ) : (
          <div>
            <div className="d-flex justify-content-between gap-2 align-items-center flex-wrap mb-3 no-print">
              <h3 className="route-title mb-0 h4">Cards de exemplos</h3>
              <input aria-label="Pesquisar exemplos" className="form-control form-control-sm search-examples" placeholder="Pesquisar fração, resultado ou porcentagem..." value={query} onChange={e=>setQuery(e.target.value)} />
            </div>
            <div className="row g-3 examples-grid">
              {filtered.map(ex => <div className="col-md-6 col-xl-4" key={ex.id}><ExampleCard example={ex} operation={operation} selected={selected && selected.id===ex.id} onSelect={choose} /></div>)}
              {filtered.length === 0 && <div className="empty-state">Nenhum exemplo encontrado.</div>}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
