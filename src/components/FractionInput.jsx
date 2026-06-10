const FractionInput = ({ fraction, index, onChange }) => {
  const update = (field, value) => {
    const number = parseInt(value || '0', 10);
    onChange(index, { ...fraction, [field]: field === 'd' && number === 0 ? 1 : number });
  };
  return (
    <div className="frac-editor text-center">
      <div className="small fw-bold text-muted mb-2">Fração {index + 1}</div>
      <input aria-label={`Numerador da fração ${index + 1}`} className="form-control input-mini mx-auto mb-2" type="number" value={fraction.n} onChange={(e)=>update('n', e.target.value)} />
      <div className="border-top border-3 border-dark mx-auto mb-2" style={{width:'82px'}}></div>
      <input aria-label={`Denominador da fração ${index + 1}`} className="form-control input-mini mx-auto" type="number" min="1" value={fraction.d} onChange={(e)=>update('d', e.target.value)} />
    </div>
  );
};
