const FractionInput = ({ fraction, index, onChange, allowMixed }) => {
  const update = (field, value) => {
    const number = parseInt(value || '0', 10);
    onChange(index, { ...fraction, [field]: field === 'd' && number === 0 ? 1 : number });
  };
  const toggleMixed = (checked) => {
    const next = { ...fraction, mixed: checked };
    if(checked){
      const n = Math.abs(Number(fraction.n)||0);
      const d = Math.max(1, Math.abs(Number(fraction.d)||1));
      next.w = Math.floor(n / d);
      next.n = n % d || 1;
      next.d = d;
    } else {
      const w = Math.abs(Number(fraction.w)||0);
      const n = Math.abs(Number(fraction.n)||0);
      const d = Math.max(1, Math.abs(Number(fraction.d)||1));
      next.n = w * d + n;
      next.w = 0;
      next.d = d;
    }
    onChange(index, next);
  };
  return (
    <div className="frac-editor text-center">
      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
        <div className="small fw-bold text-muted">Fração {index + 1}</div>
        {allowMixed && (
          <label className="form-check-label small d-flex align-items-center gap-1">
            <input className="form-check-input mt-0" type="checkbox" checked={!!fraction.mixed} onChange={(e)=>toggleMixed(e.target.checked)} />
            mista
          </label>
        )}
      </div>

      {fraction.mixed && allowMixed ? (
        <div className="mixed-editor d-flex align-items-center justify-content-center gap-2">
          <input aria-label={`Parte inteira da fração ${index + 1}`} className="form-control input-mini input-whole" type="number" value={fraction.w || 0} onChange={(e)=>update('w', e.target.value)} />
          <div>
            <input aria-label={`Numerador da fração ${index + 1}`} className="form-control input-mini mx-auto mb-2" type="number" value={fraction.n} onChange={(e)=>update('n', e.target.value)} />
            <div className="border-top border-3 border-dark mx-auto mb-2" style={{width:'82px'}}></div>
            <input aria-label={`Denominador da fração ${index + 1}`} className="form-control input-mini mx-auto" type="number" min="1" value={fraction.d} onChange={(e)=>update('d', e.target.value)} />
          </div>
        </div>
      ) : (
        <>
          <input aria-label={`Numerador da fração ${index + 1}`} className="form-control input-mini mx-auto mb-2" type="number" value={fraction.n} onChange={(e)=>update('n', e.target.value)} />
          <div className="border-top border-3 border-dark mx-auto mb-2" style={{width:'82px'}}></div>
          <input aria-label={`Denominador da fração ${index + 1}`} className="form-control input-mini mx-auto" type="number" min="1" value={fraction.d} onChange={(e)=>update('d', e.target.value)} />
        </>
      )}
      {fraction.mixed && allowMixed && <div className="small text-muted mt-2">Parte inteira + fração própria</div>}
    </div>
  );
};
