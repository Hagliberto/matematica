const FractionMath = (() => {
  const abs = Math.abs;
  const gcd = (a,b) => { a=abs(Number(a)||0); b=abs(Number(b)||0); while(b){ [a,b]=[b,a%b]; } return a || 1; };
  const lcm = (a,b) => abs(a*b) / gcd(a,b);
  const normalize = (f) => {
    let d = Number(f.d) || 1;
    if(d === 0) d = 1;
    let n = Number(f.n) || 0;
    let w = Number(f.w) || 0;
    if(f.mixed){
      const sign = w < 0 || n < 0 ? -1 : 1;
      n = sign * (abs(w) * abs(d) + abs(n));
    }
    if(d < 0){ n *= -1; d *= -1; }
    return { n, d, original: f };
  };
  const simplify = (f) => {
    f = normalize(f);
    const g = gcd(f.n, f.d);
    return { n: f.n / g, d: f.d / g };
  };
  const fracText = (f) => {
    f = simplify(f);
    return f.d === 1 ? String(f.n) : `${f.n}/${f.d}`;
  };
  const mixedText = (f) => {
    f = simplify(f);
    const sign = f.n < 0 ? '-' : '';
    const n = abs(f.n);
    if(f.d === 1) return `${f.n}`;
    if(n < f.d) return `${sign}${n}/${f.d}`;
    const whole = Math.floor(n / f.d);
    const rem = n % f.d;
    return rem === 0 ? `${sign}${whole}` : `${sign}${whole} ${rem}/${f.d}`;
  };
  const decimalText = (f) => {
    f = simplify(f);
    const v = f.n / f.d;
    return Number.isInteger(v) ? String(v) : v.toFixed(4).replace(/0+$/,'').replace(/\.$/,'');
  };
  const percentText = (f) => {
    f = simplify(f);
    const v = (f.n / f.d) * 100;
    return `${Number.isInteger(v) ? v : v.toFixed(2).replace(/0+$/,'').replace(/\.$/,'')}%`;
  };
  const primeFactorList = (value) => {
    let n = abs(Number(value) || 1);
    const factors = [];
    let divisor = 2;
    while(n > 1 && divisor * divisor <= n){
      while(n % divisor === 0){ factors.push(divisor); n = n / divisor; }
      divisor++;
    }
    if(n > 1) factors.push(n);
    return factors.length ? factors : [1];
  };
  const factorMap = (value) => {
    const map = {};
    primeFactorList(value).filter(v=>v!==1).forEach(v => map[v] = (map[v] || 0) + 1);
    return map;
  };
  const factorText = (value) => {
    const factors = primeFactorList(value);
    if(factors[0] === 1) return '1';
    const grouped = factorMap(value);
    return Object.keys(grouped).map(k => grouped[k] > 1 ? `${k}²`.replace('²', `^${grouped[k]}`) : k).join(' × ');
  };
  const lcmDetails = (denominators) => {
    const maps = denominators.map(factorMap);
    const merged = {};
    maps.forEach(map => Object.entries(map).forEach(([prime, exp]) => {
      merged[prime] = Math.max(merged[prime] || 0, exp);
    }));
    const parts = Object.entries(merged).map(([prime, exp]) => ({ prime:Number(prime), exp }));
    const value = parts.reduce((acc, p) => acc * Math.pow(p.prime, p.exp), 1);
    return { denominators, maps, parts, value: value || 1 };
  };
  const calc = (operation, fractions) => {
    const fs = fractions.map(normalize);
    let raw;
    if(operation === 'soma' || operation === 'subtracao'){
      const common = fs.reduce((acc, f) => lcm(acc, f.d), 1);
      const nums = fs.map((f, idx) => {
        const value = f.n * (common / f.d);
        return operation === 'subtracao' && idx > 0 ? -value : value;
      });
      raw = { n: nums.reduce((a,b)=>a+b,0), d: common, common, nums };
    }
    if(operation === 'multiplicacao'){
      raw = { n: fs.reduce((acc,f)=>acc*f.n,1), d: fs.reduce((acc,f)=>acc*f.d,1) };
    }
    if(operation === 'divisao'){
      let current = { ...fs[0] };
      for(let i=1;i<fs.length;i++) current = { n: current.n * fs[i].d, d: current.d * fs[i].n };
      raw = current;
    }
    const simplified = simplify(raw);
    return { fractions: fs, raw, simplified, decimal: decimalText(simplified), percent: percentText(simplified), text: fracText(simplified), mixed: mixedText(simplified) };
  };
  const makeExamples = (operation, total=50) => {
    const examples = [];
    for(let i=1;i<=total;i++){
      const count = i % 2 === 0 ? 3 : 2;
      const fractions = Array.from({length:count}, (_,j) => ({
        n: ((i * (j+2) + j + 1) % 11) + 1,
        d: ((i * (j+3) + j + 4) % 10) + 2,
        mixed: false,
        w: 0
      }));
      if(i % 7 === 0) fractions[0].n += fractions[0].d;
      if(operation === 'subtracao'){
        const result = calc('subtracao', fractions).simplified;
        if(result.n < 0) fractions.sort((a,b)=>(b.n/b.d)-(a.n/a.d));
      }
      examples.push({ id:`${operation}-${i}`, title:`Exemplo ${String(i).padStart(2,'0')}`, fractions });
    }
    return examples;
  };
  const symbol = { soma:'+', subtracao:'−', multiplicacao:'×', divisao:'÷' };
  const label = { soma:'Soma', subtracao:'Subtração', multiplicacao:'Multiplicação', divisao:'Divisão' };
  return { gcd, lcm, simplify, fracText, mixedText, decimalText, percentText, calc, makeExamples, symbol, label, primeFactorList, factorText, lcmDetails, normalize };
})();
