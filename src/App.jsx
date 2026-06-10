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
      <header className="appbar container-fluid no-print">
        <div className="appbar-inner d-flex align-items-center justify-content-between gap-2">
          <a href="#/soma" className="text-decoration-none text-dark d-flex align-items-center gap-2 brand-wrap">
            <span className="brand-icon"><i className="bi bi-calculator-fill"></i></span>
            <div className="fw-black brand-title mb-0">Frações Divertidas</div>
          </a>
          <nav className="nav-scroll d-flex gap-2">
            {Object.entries(routes).map(([path, r]) => <a key={path} href={path} className={`nav-pill ${hash===path ? 'active' : ''}`}><i className={`bi ${r.icon}`}></i><span>{r.label}</span></a>)}
          </nav>
        </div>
      </header>
      <main className="container-fluid px-2 px-lg-5 pb-4 main-content">{current.component}</main>
      <footer className="container-fluid px-5 pb-4 text-center no-print small">Página didática com exemplos, edição manual e passo a passo automático.</footer>
    </div>
  );
};
