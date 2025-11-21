import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplets, 
  Bot, 
  Menu, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Beaker, 
  Ruler, 
  Send,
  Settings,
  ArrowUpCircle,
  ArrowDownCircle,
  LogOut,
  History,
  CloudSun,
  Lock,
  ChevronRight,
  Waves,
  Info,
  ShieldAlert,
  X,
  Calculator,
  ScanLine,
  Zap,
  User,
  Mail,
  Key,
  Loader2
} from 'lucide-react';

// --- 1. FUNÇÕES SEGURAS DE ARMAZENAMENTO ---
const safeStorage = {
  getItem: (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } },
  setItem: (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} },
  removeItem: (key) => { try { localStorage.removeItem(key); } catch (e) {} }
};

// --- 2. DADOS TÉCNICOS DE PRODUTOS ---
const BRANDS_DB = {
  cloro: [
    { id: 'hth_trad', brand: 'HTH', name: 'Cloro Tradicional (65%)', type: 'linear', factor: 1.6, shockDose: 14, unit: 'g', desc: 'Hipoclorito de Cálcio.' },
    { id: 'hth_10x1', brand: 'HTH', name: 'Cloro Aditivado 10 em 1', type: 'linear', factor: 2.0, shockDose: 18, unit: 'g', desc: 'Multiação.' },
    { id: 'genco_le', brand: 'Genco', name: 'Cloro Granulado LE', type: 'linear', factor: 2.5, shockDose: 28, unit: 'g', desc: 'Dicloro (3 em 1).' },
    { id: 'genco_3em1', brand: 'Genco', name: 'Cloro Múltipla Ação', type: 'linear', factor: 2.5, shockDose: 28, unit: 'g', desc: 'Dicloro.' },
    { id: 'cris_cloro', brand: 'Cris Água', name: 'Cloro Granulado', type: 'linear', factor: 3.0, shockDose: 20, unit: 'g', desc: 'Dicloro padrão.' },
    { id: 'generic', brand: 'Genérico', name: 'Cloro Comum', type: 'linear', factor: 4.0, shockDose: 25, unit: 'g', desc: 'Menor concentração.' }
  ],
  ph_up: [
    { id: 'hth_elev', brand: 'HTH', name: 'Elevador de pH (Pó)', type: 'table', unit: 'g', desc: 'Carbonato de Sódio.', ranges: [ { max: 6.8, dose: 10 }, { max: 7.0, dose: 5 }, { max: 7.2, dose: 5 } ] },
    { id: 'genco_mais', brand: 'Genco', name: 'pH+ Mais Barrilha', type: 'table', unit: 'g', desc: 'Barrilha Leve.', ranges: [ { max: 6.4, dose: 40 }, { max: 6.8, dose: 30 }, { max: 7.0, dose: 20 }, { max: 7.2, dose: 10 } ] },
    { id: 'cris_barrilha', brand: 'Cris Água', name: 'Elevador de pH', type: 'table', unit: 'g', desc: 'Barrilha.', ranges: [ { max: 6.8, dose: 20 }, { max: 7.2, dose: 10 } ] }
  ],
  ph_down: [
    { id: 'hth_red', brand: 'HTH', name: 'Redutor de Alc. e pH', type: 'table', unit: 'ml', desc: 'Extra Forte.', ranges: [ { min: 8.0, dose: 10 }, { min: 7.4, dose: 5 } ] },
    { id: 'genco_menos', brand: 'Genco', name: 'pH- Menos Líquido', type: 'table', unit: 'ml', desc: 'Ácido Muriático.', ranges: [ { min: 8.0, dose: 20 }, { min: 7.8, dose: 10 }, { min: 7.4, dose: 5 } ] },
    { id: 'cris_redutor', brand: 'Cris Água', name: 'Redutor de pH', type: 'table', unit: 'ml', desc: 'Baseado no Rótulo.', ranges: [ { min: 8.0, dose: 10 }, { min: 7.6, dose: 5 } ] }
  ],
  alc_up: [
    { id: 'hth_alc', brand: 'HTH', name: 'Elevador de Alcalinidade', type: 'linear_alc', factor: 17.0, unit: 'g', desc: 'Bicarbonato.' },
    { id: 'genco_certo', brand: 'Genco', name: 'pH Certo (Elevador Alc)', type: 'linear_alc', factor: 17.0, unit: 'g', desc: 'Estabilizante.' },
    { id: 'cris_alc', brand: 'Cris Água', name: 'Alcalinidade+', type: 'linear_alc', factor: 17.0, unit: 'g', desc: 'Bicarbonato.' }
  ],
  alc_down: [
    { id: 'hth_red_alc', brand: 'HTH', name: 'Redutor de Alc. e pH', type: 'linear_alc_down', factor: 5.0, unit: 'ml', desc: 'Extra Forte (5ml/10ppm).' },
    { id: 'genco_menos_alc', brand: 'Genco', name: 'pH- Menos Líquido', type: 'linear_alc_down', factor: 10.0, unit: 'ml', desc: '10ml baixa 10ppm.' },
    { id: 'cris_redutor_alc', brand: 'Cris Água', name: 'Redutor de pH', type: 'linear_alc_down', factor: 10.0, unit: 'ml', desc: '10ml baixa 10ppm.' }
  ]
};

// --- 3. COMPONENTES DE UI AUXILIARES ---

const NavIcon = ({ icon, label, active, onClick, isMain, isLocked }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-14 transition-all relative ${active ? 'text-cyan-600' : 'text-slate-400 hover:text-slate-600'} ${isMain ? '-mt-8' : ''}`}>
    {isMain ? (
      <div className="bg-cyan-600 text-white p-4 rounded-full shadow-lg shadow-cyan-200 border-4 border-slate-50 transform hover:-translate-y-1 transition-transform">{icon}</div>
    ) : (
      <div className={`p-1 rounded-xl ${active ? 'bg-cyan-50' : ''}`}>{icon} {isLocked && <Lock className="w-3 h-3 absolute top-0 right-2 text-slate-400" />}</div>
    )}
    <span className={`text-[10px] font-bold mt-1 ${isMain ? 'text-cyan-700' : ''}`}>{label}</span>
  </button>
);

const NavBar = ({ activeTab, setActiveTab, isPremium }) => (
  <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-2 pb-6 flex justify-around z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
    <NavIcon icon={<Menu />} label="Início" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
    <NavIcon icon={<Ruler />} label="Config" active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} />
    <NavIcon icon={<Beaker />} label="Dose" active={activeTab === 'dosage'} onClick={() => setActiveTab('dosage')} isMain />
    <NavIcon icon={<History />} label="Hist." active={activeTab === 'history'} onClick={() => setActiveTab('history')} isLocked={!isPremium} />
    <NavIcon icon={<Bot />} label="IA" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} isLocked={!isPremium} />
  </nav>
);

const CardHeader = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-4 text-slate-800"><div className="bg-cyan-100 p-2 rounded-lg text-cyan-700">{icon}</div><h2 className="text-xl font-bold">{title}</h2></div>
);

const TabButton = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${active ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{label}</button>
);

const InputGroup = ({ label, value, onChange, placeholder }) => (
  <div><label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">{label}</label><input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition-all" /></div>
);

const ArrowRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);

const formatLargeNumber = (val, unit) => {
  if (val < 1000) return `${val} ${unit}`;
  const major = Math.floor(val / 1000);
  const remainder = val % 1000;
  const majorUnit = unit === 'ml' ? 'Litro' : 'kg';
  if (remainder === 0) return `${major} ${majorUnit}`;
  return `${major} ${majorUnit} e ${remainder} ${unit}`;
};

const MenuCard = ({ title, desc, icon, color, onClick }) => {
  const colors = { emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300', violet: 'bg-violet-50 text-violet-600 border-violet-100 hover:border-violet-300' };
  const iconBg = { emerald: 'bg-emerald-500', violet: 'bg-violet-500' };
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl border text-left transition-all active:scale-95 ${colors[color]} group`}>
      <div className={`${iconBg[color]} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>{icon}</div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-xs opacity-70 mt-1 leading-tight">{desc}</p>
    </button>
  );
};

// --- 4. TELAS DO APLICATIVO ---

function LoginScreen({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: name || "Usuário Aqua", email });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <Droplets className="w-12 h-12 text-blue-600 fill-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">AquaSmart</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Controle profissional no seu bolso.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold uppercase ml-1 mb-1 text-slate-500">Nome</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Seu nome" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase ml-1 mb-1 text-slate-500">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="seu@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase ml-1 mb-1 text-slate-500">Senha</label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-95 mt-6">
            {isRegistering ? 'Criar Conta Grátis' : 'Entrar no App'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            {isRegistering ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Home({ setActiveTab, poolVolume, isPremium, setIsPremium }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 pb-24">
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-blue-100 overflow-hidden relative">
        {!isPremium && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
            <Lock className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-600 mb-2">Previsão & Dicas Diárias</p>
            <button onClick={() => setActiveTab('ai')} className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-900">Desbloquear Premium</button>
          </div>
        )}
        <div className="p-5 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <CloudSun className="w-5 h-5" />
              <span className="font-bold text-sm">Hoje: 28°C • Sol</span>
            </div>
            <p className="text-xs text-slate-500 max-w-[200px]">Dia quente! O cloro evapora 2x mais rápido.</p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Droplets className="w-6 h-6 text-indigo-500" />
          </div>
        </div>
      </div>

      <div onClick={() => setActiveTab('calculator')} className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${poolVolume > 0 ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'bg-white border-orange-200 shadow-sm'}`}>
        {poolVolume > 0 ? (
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-cyan-100 text-xs font-bold uppercase tracking-wider mb-1">Sua Piscina</p>
              <h3 className="text-2xl font-bold">{poolVolume.toLocaleString('pt-BR')} <span className="text-sm font-normal opacity-80">Litros</span></h3>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Configure sua Piscina</h3>
              <p className="text-sm text-slate-500 mt-1">Precisamos saber o volume de água para calcular as doses.</p>
              <span className="text-orange-600 text-xs font-bold mt-2 block flex items-center gap-1">Configurar agora <ChevronRight className="w-3 h-3" /></span>
            </div>
          </div>
        )}
        {poolVolume > 0 && <Waves className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10 rotate-12" />}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MenuCard title="Calcular Dose" desc="Cloro, pH e Alcalinidade" icon={<Beaker className="w-6 h-6" />} color="emerald" onClick={() => setActiveTab('dosage')} />
        <MenuCard title="Histórico" desc="Registro de tratamentos" icon={<History className="w-6 h-6" />} color="violet" onClick={() => setActiveTab('history')} />
      </div>

      {!isPremium && (
        <div onClick={() => setIsPremium(true)} className="mt-4 bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-400" /> Seja Premium</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[200px]">IA avançada, histórico ilimitado e dicas de economia.</p>
            </div>
            <button className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform">Assinar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function VolumeCalculator({ setPoolVolume }) {
  const [shape, setShape] = useState('rect');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [depth, setDepth] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    try {
      const savedData = JSON.parse(safeStorage.getItem('aqua_pool_data') || '{}');
      if (savedData.shape) setShape(savedData.shape);
      if (savedData.length) setLength(savedData.length);
      if (savedData.width) setWidth(savedData.width);
      if (savedData.diameter) setDiameter(savedData.diameter);
      if (savedData.depth) setDepth(savedData.depth);
    } catch(e) {}
  }, []);

  const calculate = () => {
    let vol = 0;
    const d = parseFloat(depth.replace(',','.'));
    if (shape === 'rect') {
      const l = parseFloat(length.replace(',','.'));
      const w = parseFloat(width.replace(',','.'));
      if(l && w && d) vol = l * w * d * 1000;
    } else {
      const dia = parseFloat(diameter.replace(',','.'));
      if(dia && d) {
        const r = dia / 2;
        vol = Math.PI * (r * r) * d * 1000;
      }
    }
    if(vol > 0) {
      const finalVol = Math.round(vol);
      setPoolVolume(finalVol);
      safeStorage.setItem('aqua_pool_vol', finalVol);
      safeStorage.setItem('aqua_pool_data', JSON.stringify({ shape, length, width, diameter, depth }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-24">
      <CardHeader title="Calculadora de Litros" icon={<Ruler className="w-5 h-5" />} />
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
        {showSuccess && (
          <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center text-sm font-bold py-2 rounded-t-2xl animate-in slide-in-from-top-2">
            <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Medidas salvas com sucesso!</span>
          </div>
        )}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 mt-4">
          <TabButton active={shape === 'rect'} onClick={() => setShape('rect')} label="Retangular" />
          <TabButton active={shape === 'round'} onClick={() => setShape('round')} label="Redonda" />
        </div>
        <div className="space-y-4">
          {shape === 'rect' ? (
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Comprimento (m)" value={length} onChange={setLength} placeholder="Ex: 6.0" />
              <InputGroup label="Largura (m)" value={width} onChange={setWidth} placeholder="Ex: 3.0" />
            </div>
          ) : (
            <InputGroup label="Diâmetro (m)" value={diameter} onChange={setDiameter} placeholder="Ex: 3.5" />
          )}
          <InputGroup label="Profundidade Média (m)" value={depth} onChange={setDepth} placeholder="Ex: 1.4" />
          <button onClick={calculate} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-200 transition-all mt-2 active:scale-95">Salvar e Calcular</button>
          <p className="text-center text-xs text-slate-400 mt-2">Suas medidas ficarão salvas para a próxima vez.</p>
        </div>
      </div>
    </div>
  );
}

function ChemicalDosage({ poolVolume, onSave, setActiveTab }) {
  const [chemType, setChemType] = useState('cloro');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [result, setResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [waterCondition, setWaterCondition] = useState('clean');
  const [labelDoseAmount, setLabelDoseAmount] = useState('');
  const [labelDoseVolume, setLabelDoseVolume] = useState('1000');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [needsAction, setNeedsAction] = useState(null);

  useEffect(() => {
    const current = parseFloat(currentLevel.replace(',', '.'));
    if (isNaN(current) || currentLevel === '') {
      setFilteredProducts([]);
      setNeedsAction(null);
      setResult(null);
      return;
    }

    let products = [];
    let status = 'ok';

    if (chemType === 'cloro') {
      if (waterCondition === 'shock') {
        status = 'up';
        products = BRANDS_DB.cloro;
      } else {
        if (current < 3.0) {
          status = 'up';
          products = BRANDS_DB.cloro;
        } else if (current > 5.0) {
          status = 'wait';
        }
      }
    } 
    else if (chemType === 'ph') {
      if (current < 7.2) {
        status = 'up';
        products = BRANDS_DB.ph_up;
      } else if (current > 7.6) {
        status = 'down';
        products = BRANDS_DB.ph_down;
      }
    } 
    else if (chemType === 'alc') {
      if (current < 80) {
        status = 'up';
        products = BRANDS_DB.alc_up;
      } else if (current > 120) {
        status = 'down';
        products = BRANDS_DB.alc_down;
      }
    }

    setNeedsAction(status);
    setFilteredProducts(products);
    
    if (products.length > 0) {
      setSelectedProductId(products[0].id);
    } else {
      setSelectedProductId('');
    }
    setLabelDoseAmount('');
  }, [currentLevel, chemType, waterCondition]);

  if (poolVolume === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="bg-orange-100 p-4 rounded-full mb-4 animate-pulse"><Ruler className="w-8 h-8 text-orange-500" /></div>
        <h3 className="font-bold text-slate-800 text-lg">Configure a Piscina</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-[250px]">Para calcular a dose exata, precisamos saber quantos litros sua piscina tem.</p>
        <button onClick={() => setActiveTab('calculator')} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200">Ir para Configuração</button>
      </div>
    );
  }

  const getPlaceholder = () => {
    if (chemType === 'cloro') return 'Ex: 1.0';
    if (chemType === 'ph') return 'Ex: 7.8';
    if (chemType === 'alc') return 'Ex: 60';
    return '';
  };

  const calculate = () => {
    const current = parseFloat(currentLevel.replace(',', '.'));
    const vol = Number(poolVolume);
    if (isNaN(current) || !vol) return;

    if (needsAction === 'wait' || needsAction === 'ok') {
        let msg = 'Tudo certo!';
        if (chemType === 'cloro' && current > 5) msg = 'Nível alto. Aguarde o cloro evaporar naturalmente.';
        else if (chemType === 'ph' && current >= 7.2 && current <= 7.6) msg = 'pH está na faixa ideal.';
        else if (chemType === 'alc' && current >= 80 && current <= 120) msg = 'Alcalinidade equilibrada.';
        setResult({ action: needsAction === 'ok' ? 'ok' : 'wait', msg });
        return;
    }

    if (!selectedProductId) return;

    let amount = 0;
    let unit = 'g';
    let productName = '';
    let message = '';
    let warning = false;

    if (selectedProductId === 'custom') {
        const labelDose = parseFloat(labelDoseAmount.replace(',', '.'));
        if (isNaN(labelDose) || labelDose <= 0) {
            alert("Por favor, insira a dosagem do rótulo.");
            return;
        }
        amount = Math.round((labelDose / parseInt(labelDoseVolume)) * vol);
        unit = (chemType === 'ph' && needsAction === 'down') || (chemType === 'alc' && needsAction === 'down') ? 'ml' : 'g';
        productName = 'Produto do Rótulo';
        message = `Dose calculada baseada na instrução de ${labelDose}${unit} para ${parseInt(labelDoseVolume)}L.`;
    } 
    else {
        const prod = filteredProducts.find(p => p.id === selectedProductId);
        if (!prod) return;
        
        unit = prod.unit;
        productName = prod.name;
        
        if (prod.type === 'linear') {
            if (chemType === 'cloro' && waterCondition === 'shock') {
                const dose = prod.shockDose || 20;
                amount = Math.round(dose * (vol / 1000));
                message = 'Dose de Choque (Água Verde).';
                warning = true;
            } else {
                const diff = 3.0 - current;
                amount = Math.round(diff * prod.factor * (vol / 1000));
                message = 'Ajuste fino para 3.0 PPM.';
            }
        }
        else if (prod.type === 'linear_alc') {
            const target = 80;
            const diff = target - current;
            amount = Math.round((diff / 10) * prod.factor * (vol / 1000));
            message = 'Dose para atingir o mínimo ideal (80 ppm).';
        }
        else if (prod.type === 'linear_alc_down') {
            const target = 120;
            const diff = current - target;
            amount = Math.round((diff / 10) * prod.factor * (vol / 1000));
            message = 'Baixar para 120 ppm.';
            warning = true;
        }
        else if (prod.type === 'table') {
            let dosePerM3 = 0;
            if (prod.ranges) {
                if (prod.ranges[0].min !== undefined) {
                    const ranges = [...prod.ranges].sort((a, b) => b.min - a.min);
                    for (let r of ranges) {
                        if (current >= r.min) {
                            dosePerM3 = r.dose;
                            break;
                        }
                    }
                } else if (prod.ranges[0].max !== undefined) {
                    const ranges = [...prod.ranges].sort((a, b) => a.max - b.max);
                    for (let r of ranges) {
                        if (current < r.max) {
                            dosePerM3 = r.dose;
                            break;
                        }
                    }
                }
                if (dosePerM3 === 0 && prod.ranges.length > 0) {
                     dosePerM3 = prod.ranges[prod.ranges.length - 1].dose;
                }
            }
            amount = Math.round(dosePerM3 * (vol / 1000));
            message = 'Dose de correção conforme fabricante.';
            if (chemType === 'alc' && needsAction === 'down') warning = true;
        }
    }

    const finalWarning = warning && chemType === 'alc' && needsAction === 'down' 
        ? "Ao reduzir a alcalinidade, o pH também cairá. Corrija o pH DEPOIS." 
        : (warning ? 'Dose de tratamento de choque.' : null);

    setResult({
        amount: Math.max(0, amount),
        unit,
        action: 'add',
        product: productName,
        msg: message,
        warning: finalWarning
    });
    setShowGuide(false);
    
    if (amount > 0) {
        onSave({
            date: new Date().toLocaleDateString(),
            type: chemType,
            value: current,
            action: 'add',
            product: productName,
            amount: `${amount}${unit}`
        });
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-24">
      <CardHeader title="Calculadora Química" icon={<Beaker className="w-5 h-5" />} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        
        <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">1. O que você mediu?</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['cloro', 'ph', 'alc'].map(type => (
                <button key={type} onClick={() => { setChemType(type); setResult(null); setCurrentLevel(''); setNeedsAction(null); setWaterCondition('clean'); }} className={`py-2 rounded-xl text-sm font-bold capitalize transition-all ${chemType === type ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {type === 'alc' ? 'Alcalin.' : type}
                </button>
              ))}
            </div>

            {chemType === 'cloro' && (
                <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Condição da Água</label>
                    <div className="flex gap-2">
                        <button onClick={() => setWaterCondition('clean')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${waterCondition === 'clean' ? 'bg-green-500 text-white shadow-sm' : 'bg-white text-slate-500'}`}>
                            <CheckCircle2 className="w-3 h-3" /> Limpa
                        </button>
                        <button onClick={() => setWaterCondition('shock')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${waterCondition === 'shock' ? 'bg-red-500 text-white shadow-sm' : 'bg-white text-slate-500'}`}>
                            <Zap className="w-3 h-3" /> Verde (Choque)
                        </button>
                    </div>
                </div>
            )}

            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Resultado do Teste</label>
            <input type="number" value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} placeholder={getPlaceholder()} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none" />
        </div>

        {needsAction && (needsAction === 'up' || needsAction === 'down') && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">2. Qual produto você tem?</label>
                <div className="mb-4 relative">
                    <select 
                        value={selectedProductId} 
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
                    >
                        {filteredProducts.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.brand} - {p.name}
                            </option>
                        ))}
                        <option value="custom">Outro / Calculadora de Rótulo</option>
                    </select>
                    <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 rotate-90 pointer-events-none" />
                </div>

                {selectedProductId === 'custom' && (
                    <div className="mb-4 bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in zoom-in-95">
                        <label className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-1">
                             <ScanLine className="w-3 h-3" /> O que diz no rótulo?
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-blue-900">Use</span>
                            <input type="number" value={labelDoseAmount} onChange={(e) => setLabelDoseAmount(e.target.value)} placeholder="Ex: 10" className="w-20 bg-white border border-blue-200 rounded-lg p-2 text-center font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 outline-none" />
                            <span className="text-sm text-blue-900 font-bold">{((chemType === 'ph' && needsAction === 'down') || (chemType === 'alc' && needsAction === 'down')) ? 'ml' : 'g'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-blue-900">Para cada</span>
                            <select value={labelDoseVolume} onChange={(e) => setLabelDoseVolume(e.target.value)} className="bg-white border border-blue-200 rounded-lg p-2 text-sm text-slate-800 outline-none">
                                <option value="1000">1.000 Litros (1m³)</option>
                                <option value="10000">10.000 Litros (10m³)</option>
                            </select>
                        </div>
                        <p className="text-[10px] text-blue-600 mt-2 opacity-80">O app fará a conta exata para os seus {poolVolume.toLocaleString('pt-BR')} Litros.</p>
                    </div>
                )}

                <button onClick={calculate} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-xl shadow-lg shadow-cyan-200 transition-transform active:scale-95 font-bold text-lg flex items-center justify-center gap-2">
                    <Calculator className="w-5 h-5" /> Calcular Dose
                </button>
            </div>
        )}

        {needsAction && (needsAction === 'ok' || needsAction === 'wait') && (
             <button onClick={calculate} className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl shadow-lg shadow-green-200 transition-transform active:scale-95 font-bold text-lg mt-4">
                Verificar Status
            </button>
        )}

      </div>

      {result && (
        <div className="animate-in zoom-in-95 duration-300 space-y-4">
          {result.action === 'add' ? (
            <div className="bg-white border-l-8 border-cyan-500 rounded-r-2xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-10"><Beaker className="w-24 h-24 text-cyan-500" /></div>
              
              {result.warning && (
                <div className="mb-4 bg-red-50 border border-red-100 p-3 rounded-lg flex gap-3 items-start">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-red-800">Atenção</h4>
                    <p className="text-xs text-red-700 leading-tight mt-1">{result.warning}</p>
                  </div>
                </div>
              )}

              <h4 className="text-cyan-600 font-bold text-xs uppercase mb-1">Aplicar na Piscina</h4>
              <div className="text-4xl font-bold text-slate-800 mb-1 tracking-tight">
                {formatLargeNumber(result.amount, result.unit)}
              </div>
              <p className="text-lg font-medium text-slate-600 mb-3">de {result.product}</p>
              <div className="h-px w-full bg-slate-100 mb-3"></div>
              <p className="text-sm text-slate-500 flex items-start gap-2 mb-4"><Info className="w-4 h-4 mt-0.5 text-cyan-500 shrink-0" />{result.msg}</p>
              <button onClick={() => setShowGuide(true)} className="w-full bg-slate-50 text-slate-700 text-sm font-bold py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">Ver Guia de Aplicação</button>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl flex items-center gap-4 shadow-lg ${result.warning ? 'bg-red-50 text-red-800' : result.action === 'wait' ? 'bg-orange-50 text-orange-800' : 'bg-green-50 text-green-800'}`}>
              {result.warning ? <ShieldAlert className="w-8 h-8" /> : result.action === 'wait' ? <AlertCircle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
              <div>
                <h3 className="font-bold text-lg">{result.warning ? 'Cuidado' : result.action === 'wait' ? 'Atenção' : 'Tudo Perfeito!'}</h3>
                <p className="text-sm opacity-80">{result.msg || 'Sua piscina está equilibrada.'}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showGuide && result && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Beaker className="w-5 h-5 text-cyan-600" /> Como Aplicar</h3>
              <button onClick={() => setShowGuide(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">1</div><p><strong>Segurança:</strong> Nunca misture produtos químicos. Use luvas e óculos se possível.</p></div>
              <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">2</div><p><strong>Dissolução:</strong> Pegue um balde com água da própria piscina. Adicione o produto no balde e misture até dissolver.</p></div>
              <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">3</div><p><strong>Aplicação:</strong> Espalhe o conteúdo do balde ao redor da piscina.</p></div>
              <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">4</div><p><strong>Filtragem:</strong> Deixe filtrar por 1h (líquidos) ou 4h (granulados).</p></div>
            </div>
            <button onClick={() => setShowGuide(false)} className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl mt-6 hover:bg-cyan-700">Entendi</button>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryScreen({ history, isPremium, setIsPremium }) {
  if (!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-violet-100 p-5 rounded-full mb-6 animate-pulse"><Lock className="w-10 h-10 text-violet-600" /></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Histórico Bloqueado</h2>
        <p className="text-slate-500 mb-8">Assine o Premium para manter um registro completo da saúde da sua piscina e gerar relatórios.</p>
        <button onClick={() => setIsPremium(true)} className="w-full max-w-xs bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all">Desbloquear Premium</button>
      </div>
    );
  }
  const getLabel = (type) => { switch(type) { case 'alc': return 'Alcalinidade'; case 'ph': return 'pH'; case 'cloro': return 'Cloro'; default: return type; } };
  return (
    <div className="animate-in slide-in-from-right duration-300 pb-24">
      <CardHeader title="Histórico de Tratamento" icon={<History className="w-5 h-5" />} />
      {history.length === 0 ? (
        <div className="text-center p-8 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed"><p>Nenhum registro ainda.</p><p className="text-xs mt-1">Faça um cálculo de dosagem para salvar aqui.</p></div>
      ) : (
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${item.type === 'cloro' ? 'bg-blue-500' : item.type === 'ph' ? 'bg-orange-500' : 'bg-purple-500'}`}></span>
                  <span className="font-bold text-slate-700">{getLabel(item.type)}</span>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{item.date}</span>
                </div>
                <p className="text-sm text-slate-500">Medição: <strong>{item.value}</strong> • Produto: {item.product || 'Nenhum'}</p>
              </div>
              {item.amount !== '-' && <div className="bg-cyan-50 text-cyan-700 font-bold px-3 py-1 rounded-lg text-sm border border-cyan-100">+{item.amount}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AIAssistant({ isPremium, setIsPremium }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Olá! Sou o AquaBot. Como está a água da sua piscina hoje?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!apiKey) {
             // Fallback para simulação se não tiver chave
             setTimeout(() => {
                let reply = "Para ativar minha inteligência real, configure a chave de API no arquivo .env.";
                const lower = userMsg.toLowerCase();
                if(lower.includes('verde')) reply = "Água verde? Isso é alga. 1. Ajuste pH para 7.2. 2. Escove as paredes. 3. Aplique Algicida de Choque. (Simulação)";
                else if(lower.includes('turva')) reply = "Turbidez geralmente é pH alto ou areia do filtro suja. Meça o pH; se estiver acima de 7.6, use Redutor. (Simulação)";
                setMessages(prev => [...prev, { role: 'ai', text: reply }]);
                setLoading(false);
             }, 1000);
             return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Você é o AquaBot, um especialista técnico em piscinas. Responda de forma curta, amigável e instrutiva. Pergunta do usuário: ${userMsg}` }] }]
            })
        });
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua resposta agora.";
        setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'ai', text: "Erro ao conectar com a IA. Verifique sua conexão." }]);
    } finally {
        setLoading(false);
    }
  };

  if(!isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-full mb-6 shadow-lg shadow-indigo-200"><Bot className="w-10 h-10 text-white" /></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Consultor IA 24h</h2>
        <p className="text-slate-500 mb-8">Tire dúvidas complexas, identifique problemas na água e receba instruções passo a passo.</p>
        <button onClick={() => setIsPremium(true)} className="w-full max-w-xs bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"><Sparkles className="w-4 h-4 text-yellow-400" /> Desbloquear IA</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-400" /><span className="font-bold">AquaBot Premium</span></div>
        <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">Online</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white shadow-sm text-slate-700 rounded-tl-none'}`}>{m.text}</div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" /> Digitando...
                </div>
            </div>
        )}
      </div>
      <div className="p-3 bg-white border-t flex gap-2">
        <input 
            className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none" 
            placeholder="Digite sua dúvida..." 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && !loading && send()} 
            disabled={loading}
        />
        <button onClick={send} disabled={loading} className="bg-cyan-600 text-white p-2 rounded-xl disabled:opacity-50"><Send className="w-5 h-5" /></button>
      </div>
    </div>
  );
}

// --- 5. COMPONENTE PRINCIPAL (WRAPPER) ---
function AquaSmart() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [poolVolume, setPoolVolume] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);

  useEffect(() => {
    const savedVol = safeStorage.getItem('aqua_pool_vol');
    if (savedVol && !isNaN(parseInt(savedVol))) {
      setPoolVolume(parseInt(savedVol));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setIsPremium(false);
  };

  const saveMeasurement = (record) => {
    setTreatmentHistory([record, ...treatmentHistory]);
  };

  if (!user) {
    // WRAPPER RESPONSIVO PARA PC (LOGIN)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:p-4">
        <div className="w-full h-full md:h-[850px] md:max-w-[400px] bg-white relative overflow-hidden md:rounded-[3rem] shadow-2xl">
           <LoginScreen onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:p-4">
      {/* CONTAINER PRINCIPAL QUE SIMULA CELULAR NO PC */}
      <div className="w-full h-full md:h-[850px] md:max-w-[400px] bg-slate-50 relative overflow-hidden md:rounded-[3rem] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-b-[3rem] shadow-xl z-0"></div>
        <header className="relative z-10 px-6 pt-8 pb-4 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">AquaSmart</h1>
            </div>
            <p className="text-cyan-100 text-sm font-medium opacity-90">
              Olá, {user.name.split(' ')[0]}!
            </p>
          </div>
          <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-md">
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </header>

        {/* Conteúdo com Scroll */}
        <main className="relative z-10 px-4 mt-2 flex-1 overflow-y-auto scrollbar-hide">
          {activeTab === 'home' && <Home setActiveTab={setActiveTab} poolVolume={poolVolume} isPremium={isPremium} setIsPremium={setIsPremium} />}
          {activeTab === 'calculator' && <VolumeCalculator setPoolVolume={setPoolVolume} />}
          {activeTab === 'dosage' && <ChemicalDosage poolVolume={poolVolume} onSave={saveMeasurement} setActiveTab={setActiveTab} />}
          {activeTab === 'ai' && <AIAssistant isPremium={isPremium} setIsPremium={setIsPremium} />}
          {activeTab === 'history' && <HistoryScreen history={treatmentHistory} isPremium={isPremium} setIsPremium={setIsPremium} />}
        </main>

        {/* NavBar Fixa na base do Container */}
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} isPremium={isPremium} />
      
      </div>
    </div>
  );
}

export default function AquaSmartWrapper() {
  return <AquaSmart />;
}