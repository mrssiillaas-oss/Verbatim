import { useState, useEffect, useRef, useCallback } from "react";

const WORDS = {
  pt: {
    concretos: [
      "Mesa","Cadeira","Porta","Janela","Chave","Telefone","Computador","Reunião","Café","Agenda",
      "Pasta","Caneta","Papel","Tela","Fone","Câmera","Relógio","Cartão","Bolsa","Carro",
      "Ônibus","Escritório","Sala","Corredor","Elevador","Escada","Recepção","Quadro","Projetor","Notebook",
      "Planilha","Contrato","Proposta","Relatório","E-mail","Mensagem","Ligação","Prazo","Meta","Almoço",
      "Cliente","Produto","Serviço","Equipe","Projeto","Entrega","Resultado","Feedback","Cozinha","Geladeira",
      "Copa","Água","Lanche","Restaurante","Cardápio","Conta","Gorjeta","Academia","Roupa","Tênis",
      "Mochila","Guarda-chuva","Óculos","Carteira","Crachá","Uniforme","Hospital","Farmácia","Remédio","Receita",
      "Consulta","Exame","Prontuário","Plano","Convênio","Banco","Caixa","Senha","Saldo","Extrato",
      "Transferência","Boleto","Fatura","Imposto","Nota","Supermercado","Lista","Carrinho","Fila","Troco",
      "Sacola","Marca","Preço","Desconto","Estoque","Vitrine","Prateleira","Etiqueta","Recibo","Cupom"
    ],
    abstratos: [
      "Confiança","Respeito","Empatia","Comprometimento","Responsabilidade","Transparência","Criatividade",
      "Liderança","Motivação","Produtividade","Colaboração","Inovação","Comunicação","Adaptação","Resolução",
      "Negociação","Persuasão","Influência","Credibilidade","Reputação","Relacionamento","Parceria","Sinergia",
      "Prioridade","Urgência","Eficiência","Qualidade","Consistência","Iniciativa","Autonomia",
      "Proatividade","Foco","Clareza","Objetividade","Coerência","Integridade","Ética","Pressão",
      "Estresse","Equilíbrio","Bem-estar","Satisfação","Reconhecimento","Crescimento","Carreira",
      "Oportunidade","Desafio","Risco","Decisão","Estratégia","Planejamento","Execução","Análise","Solução"
    ],
    conectivos: [
      "Portanto","Contudo","Entretanto","No entanto","Além disso","Por outro lado","Em contrapartida",
      "Sendo assim","Dessa forma","Por isso","Assim sendo","Em suma","Em resumo","Ou seja","Isto é",
      "Por exemplo","Como resultado","Consequentemente","Diante disso","Nesse sentido","A partir disso",
      "Em vez disso","Ao mesmo tempo","Simultaneamente","Anteriormente","Posteriormente","Inicialmente",
      "Finalmente","Em primeiro lugar","Por fim","Em seguida","Logo após","Ao contrário","Da mesma forma",
      "De acordo com","Conforme","Segundo","A menos que","Desde que","Embora","Apesar de","Mesmo que"
    ],
    verbos: [
      "Comunicar","Negociar","Planejar","Executar","Analisar","Resolver","Decidir","Priorizar","Delegar",
      "Colaborar","Apresentar","Propor","Argumentar","Questionar","Concordar","Discordar","Confirmar",
      "Organizar","Gerenciar","Liderar","Motivar","Desenvolver","Melhorar","Ajustar","Implementar",
      "Avaliar","Revisar","Aprovar","Cancelar","Adiar","Antecipar","Agendar","Contatar",
      "Responder","Solicitar","Recomendar","Sugerir","Explicar","Demonstrar","Justificar","Convencer",
      "Alcançar","Superar","Atingir","Entregar","Cumprir","Garantir","Assegurar","Verificar","Monitorar"
    ],
  },
  en: {
    concrete: [
      "Desk","Chair","Door","Window","Key","Phone","Computer","Meeting","Coffee","Agenda",
      "Folder","Pen","Paper","Screen","Headset","Camera","Watch","Card","Bag","Car",
      "Bus","Office","Room","Hallway","Elevator","Stairs","Reception","Board","Projector","Laptop",
      "Spreadsheet","Contract","Proposal","Report","Email","Message","Call","Deadline","Goal","Lunch",
      "Client","Product","Service","Team","Project","Delivery","Result","Feedback","Kitchen","Fridge",
      "Water","Snack","Restaurant","Menu","Bill","Tip","Table","Gym","Clothes","Sneakers",
      "Backpack","Umbrella","Glasses","Wallet","Badge","Uniform","Hospital","Pharmacy","Medicine","Prescription",
      "Appointment","Test","Record","Plan","Insurance","Bank","Password","Balance","Statement","Transfer",
      "Invoice","Tax","Receipt","Budget","Payment","Store","List","Cart","Queue","Change",
      "Brand","Price","Discount","Stock","Shelf","Label","Coupon","Cashier","Bag","Checkout"
    ],
    abstract: [
      "Trust","Respect","Empathy","Commitment","Accountability","Transparency","Creativity",
      "Leadership","Motivation","Productivity","Collaboration","Innovation","Communication","Adaptation","Resolution",
      "Negotiation","Persuasion","Influence","Credibility","Reputation","Relationship","Partnership","Synergy",
      "Priority","Urgency","Efficiency","Quality","Consistency","Initiative","Ownership",
      "Autonomy","Proactivity","Focus","Clarity","Objectivity","Coherence","Integrity","Ethics",
      "Pressure","Stress","Balance","Wellbeing","Satisfaction","Recognition","Growth","Career",
      "Opportunity","Challenge","Risk","Decision","Strategy","Planning","Execution","Analysis","Solution"
    ],
    connectives: [
      "Therefore","However","Nevertheless","Moreover","On the other hand","In contrast","As a result",
      "Consequently","Thus","Hence","In other words","For example","For instance","In addition","Furthermore",
      "Meanwhile","Subsequently","Previously","Initially","Finally","First of all","In conclusion","In summary",
      "At the same time","Simultaneously","Instead","Rather","Although","Even though","Despite","Unless",
      "Provided that","As long as","In order to","So that","Because of","Due to","According to","Based on",
      "In terms of","With regard to","Regarding","Concerning","As for","In this regard","Moving forward"
    ],
    verbs: [
      "Communicate","Negotiate","Plan","Execute","Analyze","Resolve","Decide","Prioritize","Delegate",
      "Collaborate","Present","Propose","Argue","Question","Agree","Disagree","Confirm",
      "Organize","Manage","Lead","Motivate","Develop","Improve","Adjust","Implement",
      "Evaluate","Review","Approve","Cancel","Postpone","Anticipate","Schedule","Contact",
      "Respond","Request","Recommend","Suggest","Explain","Demonstrate","Justify","Convince",
      "Achieve","Exceed","Reach","Deliver","Fulfill","Ensure","Verify","Monitor","Track","Report"
    ],
  },
};

const MIN_SPEED = 0.5;
const MAX_SPEED = 10;
const STEP = 0.5;

function speedColor(s) {
  if (s >= 6) return "#4ade80";
  if (s >= 3) return "#34d399";
  if (s >= 1.5) return "#facc15";
  return "#f87171";
}

function fmtSpeed(s) {
  return Number.isInteger(s) ? `${s}s` : `${s}s`;
}

const CATEGORIES_PT = ["concretos","abstratos","conectivos","verbos"];
const CATEGORIES_EN = ["concrete","abstract","connectives","verbs"];
const DURATIONS = [5, 10, 15];

function buildShuffledDeck(lang, categories) {
  const cats = lang === "pt" ? CATEGORIES_PT : CATEGORIES_EN;
  const activeCats = cats.filter((c) => categories.includes(c));
  let pool = [];
  activeCats.forEach((cat) => { pool = pool.concat(WORDS[lang][cat]); });
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [lang, setLang] = useState("pt");
  const [speed, setSpeed] = useState(5); // seconds per word
  const [categories, setCategories] = useState(["concretos","abstratos","conectivos","verbos"]);
  const [duration, setDuration] = useState(5);

  const [word, setWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionLeft, setSessionLeft] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [animKey, setAnimKey] = useState(0);
  const [flash, setFlash] = useState(false);

  const sessionTimer = useRef(null);
  const wordTimer = useRef(null);
  const deckRef = useRef([]);
  const deckIdxRef = useRef(0);
  const speedRef = useRef(speed);
  const timeLeftRef = useRef(speed);

  // keep speedRef in sync so interval can read latest value
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const color = speedColor(speed);

  const nextWord = useCallback(() => {
    if (deckIdxRef.current >= deckRef.current.length) {
      deckRef.current = buildShuffledDeck(lang, categories);
      deckIdxRef.current = 0;
    }
    const w = deckRef.current[deckIdxRef.current++];
    setWord(w);
    timeLeftRef.current = speedRef.current;
    setTimeLeft(speedRef.current);
    setAnimKey((k) => k + 1);
    setFlash(true);
    setWordCount((c) => c + 1);
    setHistory((h) => [w, ...h].slice(0, 80));
    setTimeout(() => setFlash(false), 120);
  }, [lang, categories]);

  const startSession = () => {
    deckRef.current = buildShuffledDeck(lang, categories);
    deckIdxRef.current = 0;
    speedRef.current = speed;
    setSessionLeft(duration * 60);
    setWordCount(0);
    setHistory([]);
    setScreen("session");
  };

  useEffect(() => {
    if (screen !== "session") return;
    nextWord();
  }, [screen]); // eslint-disable-line

  // session countdown
  useEffect(() => {
    if (screen !== "session") return;
    clearInterval(sessionTimer.current);
    sessionTimer.current = setInterval(() => {
      setSessionLeft((s) => {
        if (s <= 1) {
          clearInterval(sessionTimer.current);
          clearInterval(wordTimer.current);
          setScreen("summary");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(sessionTimer.current);
  }, [screen]);

  // word timer — uses 100ms ticks for sub-second accuracy
  useEffect(() => {
    if (screen !== "session") return;
    clearInterval(wordTimer.current);
    const TICK = 100; // ms
    wordTimer.current = setInterval(() => {
      timeLeftRef.current = Math.round((timeLeftRef.current - TICK / 1000) * 10) / 10;
      setTimeLeft(Math.max(0, timeLeftRef.current));
      if (timeLeftRef.current <= 0) {
        timeLeftRef.current = speedRef.current;
        nextWord();
      }
    }, TICK);
    return () => clearInterval(wordTimer.current);
  }, [screen, nextWord]);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1 ? prev.filter((c) => c !== cat) : prev
        : [...prev, cat]
    );
  };

  useEffect(() => {
    setCategories(lang === "pt" ? [...CATEGORIES_PT] : [...CATEGORIES_EN]);
  }, [lang]);

  const adjustSpeed = (delta) => {
    setSpeed((s) => {
      const next = Math.round((s + delta) * 10) / 10;
      return Math.min(MAX_SPEED, Math.max(MIN_SPEED, next));
    });
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const circumference = 2 * Math.PI * 54;
  const progress = timeLeft / speed;

  const catLabels = {
    concretos:"Concretos", abstratos:"Abstratos", conectivos:"Conectivos", verbos:"Verbos",
    concrete:"Concrete", abstract:"Abstract", connectives:"Connectives", verbs:"Verbs"
  };

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* ── HOME ── */}
      {screen === "home" && (
        <div style={styles.home}>
          <div style={styles.brandRow}>
            <span style={styles.brandDot} />
            <span style={styles.brand}>VERBATIM</span>
          </div>
          <p style={styles.tagline}>Treinamento verbal de alta intensidade</p>

          <div style={styles.card}>
            {/* Language */}
            <div style={styles.row}>
              <span style={styles.label}>Idioma</span>
              <div style={styles.pills}>
                {["pt","en"].map((l) => (
                  <button key={l} style={{...styles.pill, ...(lang===l?styles.pillActive:{})}} onClick={() => setLang(l)}>
                    {l === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed stepper */}
            <div style={styles.row}>
              <span style={styles.label}>Velocidade</span>
              <div style={styles.stepper}>
                <button
                  style={{...styles.stepBtn, opacity: speed <= MIN_SPEED ? 0.3 : 1}}
                  onClick={() => adjustSpeed(-STEP)}
                  disabled={speed <= MIN_SPEED}
                >−</button>
                <div style={{...styles.stepDisplay, borderColor: color, color}}>
                  {fmtSpeed(speed)}
                </div>
                <button
                  style={{...styles.stepBtn, opacity: speed >= MAX_SPEED ? 0.3 : 1}}
                  onClick={() => adjustSpeed(+STEP)}
                  disabled={speed >= MAX_SPEED}
                >+</button>
              </div>
              <span style={styles.speedHint}>
                {speed <= MIN_SPEED ? "limite mínimo" : speed >= MAX_SPEED ? "limite máximo" : `intervalo entre palavras · mín ${MIN_SPEED}s · máx ${MAX_SPEED}s`}
              </span>
            </div>

            {/* Categories */}
            <div style={styles.row}>
              <span style={styles.label}>Categorias</span>
              <div style={styles.pills}>
                {(lang === "pt" ? CATEGORIES_PT : CATEGORIES_EN).map((cat) => (
                  <button key={cat}
                    style={{...styles.pill, ...(categories.includes(cat)?styles.pillActive:{})}}
                    onClick={() => toggleCategory(cat)}>
                    {catLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={styles.row}>
              <span style={styles.label}>Duração</span>
              <div style={styles.pills}>
                {DURATIONS.map((d) => (
                  <button key={d}
                    style={{...styles.pill, ...(duration===d?styles.pillActive:{})}}
                    onClick={() => setDuration(d)}>
                    {d} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button style={styles.startBtn} onClick={startSession}>INICIAR</button>
        </div>
      )}

      {/* ── SESSION ── */}
      {screen === "session" && (
        <div style={styles.session}>
          <div style={styles.sessionTop}>
            <span style={styles.sessionMeta}>{lang.toUpperCase()} · {fmtSpeed(speed)} · {duration}min</span>
            <span style={styles.sessionTimer}>{fmtTime(sessionLeft)}</span>
          </div>

          <div style={styles.wordArea}>
            <svg width="128" height="128" style={{filter:`drop-shadow(0 0 12px ${color}44)`}}>
              <circle cx="64" cy="64" r="54" fill="none" stroke="#1a1a2e" strokeWidth="6" />
              <circle
                cx="64" cy="64" r="54" fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - Math.max(0, Math.min(1, progress)))}
                transform="rotate(-90 64 64)"
                style={{ transition: "stroke-dashoffset 0.08s linear" }}
              />
              <text x="64" y="70" textAnchor="middle" fill={color} fontSize="24" fontFamily="'Bebas Neue', sans-serif">
                {timeLeft % 1 === 0 ? timeLeft : timeLeft.toFixed(1)}
              </text>
            </svg>

            <div key={animKey} className="word-pop"
              style={{...styles.wordDisplay, color: flash ? color : "#f0eadc"}}>
              {word}
            </div>
          </div>

          <div style={styles.wordCountRow}>
            <span style={styles.wordCountLabel}>palavras</span>
            <span style={styles.wordCountNum}>{wordCount}</span>
          </div>

          <div style={styles.historyScroll}>
            {history.slice(1).map((w, i) => (
              <span key={i} style={{ ...styles.historyItem, opacity: Math.max(0.08, 1 - i * 0.1) }}>{w}</span>
            ))}
          </div>

          <button style={styles.stopBtn}
            onClick={() => { clearInterval(sessionTimer.current); clearInterval(wordTimer.current); setScreen("summary"); }}>
            encerrar
          </button>
        </div>
      )}

      {/* ── SUMMARY ── */}
      {screen === "summary" && (
        <div style={styles.summary}>
          <div style={styles.brandRow}>
            <span style={styles.brandDot} />
            <span style={styles.brand}>VERBATIM</span>
          </div>
          <p style={styles.summaryLabel}>Sessão concluída</p>
          <div style={styles.summaryBig}>{wordCount}</div>
          <p style={styles.summaryUnit}>palavras processadas</p>

          <div style={styles.summaryMeta}>
            <div style={styles.summaryMetaItem}>
              <span style={styles.summaryMetaVal}>{lang.toUpperCase()}</span>
              <span style={styles.summaryMetaKey}>idioma</span>
            </div>
            <div style={styles.summaryMetaItem}>
              <span style={styles.summaryMetaVal}>{fmtSpeed(speed)}</span>
              <span style={styles.summaryMetaKey}>velocidade</span>
            </div>
            <div style={styles.summaryMetaItem}>
              <span style={styles.summaryMetaVal}>{duration}min</span>
              <span style={styles.summaryMetaKey}>duração</span>
            </div>
          </div>

          <div style={styles.historyBlock}>
            <p style={styles.historyTitle}>Palavras desta sessão</p>
            <div style={styles.historyWrap}>
              {history.map((w, i) => <span key={i} style={styles.historyTag}>{w}</span>)}
            </div>
          </div>

          <button style={styles.startBtn} onClick={() => setScreen("home")}>NOVA SESSÃO</button>
        </div>
      )}
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .word-pop { animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes popIn {
    from { transform: scale(0.8) translateY(14px); opacity: 0; }
    to   { transform: scale(1) translateY(0); opacity: 1; }
  }
  button:active { transform: scale(0.94); }
`;

const styles = {
  root: { minHeight:"100vh", background:"#0d0d1a", color:"#f0eadc", fontFamily:"'DM Sans', sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px" },
  home: { width:"100%", maxWidth:440, display:"flex", flexDirection:"column", gap:24 },
  brandRow: { display:"flex", alignItems:"center", gap:10 },
  brandDot: { display:"inline-block", width:10, height:10, borderRadius:"50%", background:"#f0eadc" },
  brand: { fontFamily:"'Bebas Neue', sans-serif", fontSize:32, letterSpacing:6, color:"#f0eadc" },
  tagline: { fontSize:13, color:"#6b6b8a", letterSpacing:1, marginTop:-16, fontFamily:"'DM Mono', monospace" },
  card: { background:"#13132a", border:"1px solid #1e1e3a", borderRadius:16, padding:"20px", display:"flex", flexDirection:"column", gap:20 },
  row: { display:"flex", flexDirection:"column", gap:10 },
  label: { fontSize:11, letterSpacing:2, color:"#6b6b8a", textTransform:"uppercase", fontFamily:"'DM Mono', monospace" },
  pills: { display:"flex", flexWrap:"wrap", gap:8 },
  pill: { padding:"6px 14px", borderRadius:99, border:"1px solid #2a2a4a", background:"transparent", color:"#6b6b8a", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", transition:"all 0.15s" },
  pillActive: { borderColor:"#f0eadc", color:"#f0eadc", background:"rgba(240,234,220,0.07)" },
  // ── stepper ──
  stepper: { display:"flex", alignItems:"center", gap:12 },
  stepBtn: { width:44, height:44, borderRadius:10, border:"1px solid #2a2a4a", background:"transparent", color:"#f0eadc", fontSize:22, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1, transition:"all 0.15s" },
  stepDisplay: { flex:1, height:44, border:"1px solid", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue', sans-serif", fontSize:26, letterSpacing:2 },
  speedHint: { fontSize:10, color:"#3a3a5c", fontFamily:"'DM Mono', monospace", letterSpacing:1 },
  startBtn: { width:"100%", padding:"16px", background:"#f0eadc", color:"#0d0d1a", border:"none", borderRadius:12, fontSize:15, fontFamily:"'Bebas Neue', sans-serif", letterSpacing:4, cursor:"pointer" },
  session: { width:"100%", maxWidth:440, display:"flex", flexDirection:"column", alignItems:"center", gap:20, minHeight:"80vh", justifyContent:"space-between" },
  sessionTop: { width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 4px" },
  sessionMeta: { fontSize:11, color:"#6b6b8a", letterSpacing:2, fontFamily:"'DM Mono', monospace" },
  sessionTimer: { fontSize:18, fontFamily:"'Bebas Neue', sans-serif", letterSpacing:3, color:"#f0eadc" },
  wordArea: { display:"flex", flexDirection:"column", alignItems:"center", gap:24, flex:1, justifyContent:"center" },
  wordDisplay: { fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(36px, 8vw, 72px)", letterSpacing:4, textAlign:"center", transition:"color 0.1s", maxWidth:"90vw", wordBreak:"break-word" },
  wordCountRow: { display:"flex", flexDirection:"column", alignItems:"center", gap:2 },
  wordCountLabel: { fontSize:10, letterSpacing:2, color:"#6b6b8a", textTransform:"uppercase", fontFamily:"'DM Mono', monospace" },
  wordCountNum: { fontFamily:"'Bebas Neue', sans-serif", fontSize:36, color:"#f0eadc", lineHeight:1 },
  historyScroll: { display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", maxHeight:72, overflow:"hidden", width:"100%" },
  historyItem: { fontSize:12, fontFamily:"'DM Mono', monospace", color:"#3a3a5c" },
  stopBtn: { background:"transparent", border:"1px solid #2a2a4a", color:"#6b6b8a", borderRadius:8, padding:"10px 24px", fontSize:12, fontFamily:"'DM Mono', monospace", letterSpacing:2, cursor:"pointer", marginBottom:8 },
  summary: { width:"100%", maxWidth:440, display:"flex", flexDirection:"column", gap:20 },
  summaryLabel: { fontSize:11, letterSpacing:2, color:"#6b6b8a", fontFamily:"'DM Mono', monospace", textTransform:"uppercase", marginTop:-12 },
  summaryBig: { fontFamily:"'Bebas Neue', sans-serif", fontSize:96, color:"#f0eadc", lineHeight:1, letterSpacing:4 },
  summaryUnit: { fontSize:12, color:"#6b6b8a", fontFamily:"'DM Mono', monospace", marginTop:-12 },
  summaryMeta: { display:"flex", gap:24 },
  summaryMetaItem: { display:"flex", flexDirection:"column", gap:2 },
  summaryMetaVal: { fontFamily:"'Bebas Neue', sans-serif", fontSize:22, letterSpacing:2, color:"#f0eadc" },
  summaryMetaKey: { fontSize:10, color:"#6b6b8a", fontFamily:"'DM Mono', monospace", letterSpacing:1 },
  historyBlock: { background:"#13132a", border:"1px solid #1e1e3a", borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:12 },
  historyTitle: { fontSize:10, letterSpacing:2, color:"#6b6b8a", fontFamily:"'DM Mono', monospace", textTransform:"uppercase" },
  historyWrap: { display:"flex", flexWrap:"wrap", gap:8 },
  historyTag: { fontSize:12, fontFamily:"'DM Mono', monospace", color:"#4a4a6a", background:"#1a1a30", padding:"3px 10px", borderRadius:99, border:"1px solid #2a2a4a" },
};
