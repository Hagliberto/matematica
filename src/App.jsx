const App = () => {
  const routes = {
    '#/soma': { label:'Soma', icon:'bi-plus-lg', component:<SomaPage /> },
    '#/subtracao': { label:'Subtração', icon:'bi-dash-lg', component:<SubtracaoPage /> },
    '#/multiplicacao': { label:'Multiplicação', icon:'bi-x-lg', component:<MultiplicacaoPage /> },
    '#/divisao': { label:'Divisão', icon:'bi-slash-lg', component:<DivisaoPage /> }
  };
  const [hash, setHash] = React.useState(window.location.hash || '#/soma');
  React.useEffect(() => {
    if(!window.location.hash) window.location.hash = '#/soma';
    const onHash = () => setHash(window.location.hash || '#/soma');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const current = routes[hash] || routes['#/soma'];
  return (
    <div className="app-shell">
      <header className="container-fluid py-3 no-print">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <a href="#/soma" className="text-decoration-none text-dark d-flex align-items-center gap-2">
            <span className="bg-primary text-white rounded-4 d-inline-flex align-items-center justify-content-center" style={{width:48,height:48}}><i className="bi bi-calculator-fill fs-4"></i></span>
            <div><div className="fw-black h4 mb-0">Frações Divertidas</div><div className="small text-muted">React + Bootstrap • modo wide</div></div>
          </a>
          <nav className="d-flex flex-wrap gap-2">
            {Object.entries(routes).map(([path, r]) => <a key={path} href={path} className={`nav-pill ${hash===path ? 'active' : ''}`}><i className={`bi ${r.icon}`}></i>{r.label}</a>)}
          </nav>
        </div>
      </header>
      <main className="container-fluid px-3 px-lg-5 pb-4">{current.component}</main>
      <footer className="container-fluid px-5 pb-4 text-center no-print">Página didática com 200 exemplos, edição manual dos valores e passo a passo automático.</footer>
    </div>
  );
};
