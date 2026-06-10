const OperationLayout = ({ operation, title, subtitle, icon, color }) => {
  const examples = React.useMemo(()=>FractionMath.makeExamples(operation, 50), [operation]);
  const [selected, setSelected] = React.useState(examples[0]);
  const [fractions, setFractions] = React.useState(examples[0].fractions);
  const [query, setQuery] = React.useState('');
  React.useEffect(()=>{ setSelected(examples[0]); setFractions(examples[0].fractions); setQuery(''); }, [operation]);
  const result = React.useMemo(()=>FractionMath.calc(operation, fractions), [operation, fractions]);
  const filtered = examples.filter(ex => ex.title.toLowerCase().includes(query.toLowerCase()) || FractionMath.calc(operation, ex.fractions).text.includes(query));
  const choose = (ex) => { setSelected(ex); setFractions(ex.fractions.map(f=>({...f}))); window.scrollTo({top:260, behavior:'smooth'}); };
  const updateFraction = (idx, next) => setFractions(prev => prev.map((f,i)=>i===idx ? next : f));
  const addFraction = () => fractions.length < 3 && setFractions(prev => [...prev, {n:1,d:2}]);
  const removeFraction = () => fractions.length > 2 && setFractions(prev => prev.slice(0,-1));
  return (
    <>
      <section className="hero mb-4">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <div className="display-5 fw-black route-title"><i className={`bi ${icon} me-2`}></i>{title}</div>
            <p className="lead mb-0">{subtitle}</p>
          </div>
          <div className="col-lg-4 text-lg-end"><span className="badge rounded-pill bg-light text-dark fs-6 p-3">50 exemplos • 2 e 3 frações</span></div>
        </div>
      </section>
      <section className="row g-4 mb-4">
        <div className="col-xl-5">
          <div className="panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h3 className="route-title mb-0">Laboratório</h3>
              <div className="btn-group no-print">
                <button className="btn btn-sm btn-outline-primary" onClick={addFraction} disabled={fractions.length>=3}><i className="bi bi-plus-circle me-1"></i>3ª fração</button>
                <button className="btn btn-sm btn-outline-danger" onClick={removeFraction} disabled={fractions.length<=2}><i className="bi bi-dash-circle me-1"></i>Remover</button>
              </div>
            </div>
            <p className="text-muted">Troque numeradores e denominadores. O cálculo muda automaticamente.</p>
            <div className="row g-3">
              {fractions.map((f,idx)=><div className="col-6 col-md-4" key={idx}><FractionInput fraction={f} index={idx} onChange={updateFraction} /></div>)}
            </div>
          </div>
        </div>
        <div className="col-xl-7"><ResultPanel operation={operation} result={result} /></div>
      </section>
      <section className="row g-4 mb-4">
        <div className="col-xl-6"><StepByStep operation={operation} result={result} /></div>
        <div className="col-xl-6">
          <div className="panel p-4 h-100">
            <div className="d-flex justify-content-between gap-3 align-items-center flex-wrap mb-3 no-print">
              <h3 className="route-title mb-0">Cards de exemplos</h3>
              <input aria-label="Pesquisar exemplos" className="form-control" style={{maxWidth:'270px'}} placeholder="Pesquisar exemplo ou resultado..." value={query} onChange={e=>setQuery(e.target.value)} />
            </div>
            <div className="row g-3" style={{maxHeight:'720px', overflow:'auto', paddingRight:'6px'}}>
              {filtered.map(ex => <div className="col-md-6" key={ex.id}><ExampleCard example={ex} operation={operation} selected={selected && selected.id===ex.id} onSelect={choose} /></div>)}
              {filtered.length === 0 && <div className="empty-state">Nenhum exemplo encontrado.</div>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
