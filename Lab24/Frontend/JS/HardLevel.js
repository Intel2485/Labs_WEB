const { useState, useEffect, useRef } = React;

const HardLevel = ({ goBack }) => {
    const [stage, setStage] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [message, setMessage] = useState("Готовий? Затисни ЛІВУ КНОПКУ миші і швидко води нею!");
    
    const [dpiMultiplier, setDpiMultiplier] = useState(1.0);

    const [ui, setUI] = useState({ position: 50, mousePower: 0, oppTechnique: 'IDLE', playerDefending: false, penalty: false });

    const opponentVisuals = {
        1: { color: '#2980b9', name: 'Кібер-Атлет (Синій)' },
        2: { color: '#16a085', name: 'Про-Геймер (Бірюзовий)' },
        3: { color: '#f39c12', name: 'Еліта (Оранжевий)' },
        4: { color: '#8e44ad', name: 'Легенда (Фіолетовий)' },
        5: { color: '#c0392b', name: 'БОС: Сенсорний Монстр', isBoss: true }
    };

    const currentOpponent = opponentVisuals[stage];
    
    const keys = useRef({ a: false, d: false });
    const gameData = useRef({ position: 50, mousePower: 0, mouseBuffer: 0, oppTechnique: 'IDLE', nextMoveTime: 2, time: 0 });
    const isMouseDown = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyA') keys.current.a = true;
            if (e.code === 'KeyD') keys.current.d = true;
        };
        const handleKeyUp = (e) => {
            if (e.code === 'KeyA') keys.current.a = false;
            if (e.code === 'KeyD') keys.current.d = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleMouseMove = (e) => {
        if (!isPlaying || !isMouseDown.current) return;
        const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
        gameData.current.mouseBuffer += speed; 
    };


    useEffect(() => {
        let interval;
        if (isPlaying && gameData.current.position > 0 && gameData.current.position < 100) {
            interval = setInterval(() => {
                const data = gameData.current;
                data.time += 0.05;

                let safeMouseBuffer = Math.min(data.mouseBuffer, 150); 
                
                data.mousePower = Math.min(100, data.mousePower + (safeMouseBuffer * 0.15 * dpiMultiplier));
                data.mouseBuffer = 0; 
                data.mousePower = Math.max(0, data.mousePower - 4);

                if (data.time > data.nextMoveTime) {
                    if (data.oppTechnique === 'IDLE') {
                        data.oppTechnique = Math.random() > 0.5 ? 'КРЮК' : 'ТОП-РОЛ';
                        data.nextMoveTime = data.time + (1.5 - stage * 0.15);
                    } else {
                        data.oppTechnique = 'IDLE';
                        data.nextMoveTime = data.time + (Math.random() * 2 + 1); 
                    }
                }

                let isDefendingCorrectly = false;
                let isPenaltyActive = false;

                if (keys.current.a && keys.current.d) {

                    isPenaltyActive = true; 
                } else if (data.oppTechnique === 'КРЮК') {
                    if (keys.current.a) isDefendingCorrectly = true;
                    if (keys.current.d) isPenaltyActive = true;
                } else if (data.oppTechnique === 'ТОП-РОЛ') {
                    if (keys.current.d) isDefendingCorrectly = true;
                    if (keys.current.a) isPenaltyActive = true;
                } else if (data.oppTechnique === 'IDLE') {
                    if (keys.current.a || keys.current.d) isPenaltyActive = true;
                }

                let oppPower = 0.5 + (stage * 0.2); 
                let playerPower = (data.mousePower / 100) * 1.5; 

                if (isPenaltyActive) {
                    playerPower *= 0.05; 
                    oppPower *= 2.5;    
                } else if (data.oppTechnique !== 'IDLE') {
                    if (isDefendingCorrectly) {
                        oppPower *= 0.3;
                    } else {
                        playerPower *= 0.2;
                        oppPower *= 1.8;
                    }
                }

                data.position = Math.max(0, Math.min(100, data.position + playerPower - oppPower));

                if (data.position <= 0) {
                    setIsPlaying(false);
                    setMessage(isPenaltyActive ? "ДИСКВАЛІФІКАЦІЯ ЗА АБУЗ КНОПОК!" : "Суперник пробив твій захист!");
                } else if (data.position >= 100) {
                    setIsPlaying(false);
                    setMessage(stage < 5 ? `Ти знищив ${currentOpponent.name}!` : "ТИ АБСОЛЮТНИЙ ЧЕМПІОН!");
                }

                setUI({ ...data, playerDefending: isDefendingCorrectly, penalty: isPenaltyActive });

            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying, stage, currentOpponent.name, dpiMultiplier]);

    const startGame = () => {
        if (!isPlaying) {
            setIsPlaying(true);
            setMessage("БОРОТЬБА!");
        }
    };

    const nextStage = () => {
        if (stage < 5) {
            setStage(stage + 1);
            gameData.current = { position: 50, mousePower: 0, mouseBuffer: 0, oppTechnique: 'IDLE', nextMoveTime: 2, time: 0 };
            setUI({ ...gameData.current });
            setMessage("Готовий? Затисни ЛІВУ КНОПКУ миші і води!");
        }
    };

    const restartLevel = () => {
        gameData.current = { position: 50, mousePower: 0, mouseBuffer: 0, oppTechnique: 'IDLE', nextMoveTime: 2, time: 0 };
        setUI({ ...gameData.current });
        setMessage("Готовий? Затисни ЛІВУ КНОПКУ миші і води!");
    };

    const rotationAngle = (ui.position - 50) * 1.4;
    const isStrugglingClass = (isPlaying && ui.mousePower > 20) ? "is-struggling" : "";

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="hud">
                <div>Раунд: {currentOpponent.isBoss ? "БОС" : stage} / 5</div>
                <div style={{ color: currentOpponent.color }}>Суперник: {currentOpponent.name}</div>
            </div>

            <div className="hard-hud">
                <div className="power-meter" style={{ borderColor: ui.penalty ? 'red' : '' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{fontSize: '14px', color: '#ccc'}}>ОПТИКА МИШІ:</div>
                        
                        {/* ПОЛЬЗУНОК DPI */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '10px', color: '#888' }}>DPI Сенса: {dpiMultiplier.toFixed(1)}x</span>
                            <input 
                                type="range" 
                                min="0.2" max="3.0" step="0.2" 
                                value={dpiMultiplier} 
                                onChange={(e) => setDpiMultiplier(parseFloat(e.target.value))}
                                style={{ width: '60px', accentColor: '#e74c3c' }}
                                disabled={isPlaying}
                            />
                        </div>
                    </div>

                    <div className="mouse-bar-container">
                        <div className="mouse-bar" style={{ width: `${ui.mousePower}%`, background: ui.penalty ? 'red' : '' }}></div>
                    </div>
                    {ui.penalty && <div style={{ color: 'red', fontSize: '12px', fontWeight: 'bold', marginTop: '5px', animation: 'flashAlert 0.2s infinite' }}>⚠️ ШТРАФ: ВІДПУСТИ КЛАВІАТУРУ!</div>}
                </div>

                <div className="technique-box">
                    <div style={{fontSize: '14px', color: '#ccc'}}>СТАН СУПЕРНИКА:</div>
                    {ui.oppTechnique === 'IDLE' ? (
                        <div className="tech-idle">БАЗОВА БОРОТЬБА</div>
                    ) : (
                        <div className="tech-alert">
                            ⚠️ АТАКА: {ui.oppTechnique} ⚠️
                            <div style={{fontSize: '14px', color: '#fff', marginTop: '5px', textShadow: 'none', animation: 'none'}}>
                                {ui.oppTechnique === 'КРЮК' ? 'ЗАТИСНИ [A]' : 'ЗАТИСНИ [D]'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <h3 style={{ textAlign: 'center', margin: '5px 0 15px', color: '#ffea00', minHeight: '30px' }}>{message}</h3>

            <div 
                className={`wrestling-table ${currentOpponent.isBoss ? 'boss-mode' : ''}`} 
                style={{ '--opp-color': currentOpponent.color, position: 'relative' }}
                onMouseDown={() => isMouseDown.current = true}
                onMouseUp={() => isMouseDown.current = false}
                onMouseLeave={() => isMouseDown.current = false}
                onMouseMove={handleMouseMove}
            >
                <div className="mouse-tracker-area"></div>

                {!isPlaying && ui.position === 50 && (
                    <button className="menu-btn" onClick={startGame} style={{position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%) skewX(-15deg)', zIndex: 60}}>
                        <span>ПОЧАТИ</span>
                    </button>
                )}

                <div className="center-line"></div>
                <div className="metal-peg left"></div>
                <div className="metal-peg right"></div>
                <div className="pin-pad left"></div>
                <div className="pin-pad right"></div>

                <div className={`arms-pivot ${isStrugglingClass}`} style={{ transform: `rotate(${rotationAngle}deg)` }}>
                    <SvgWrestlingArms opponentSleeve={currentOpponent.color} opponentSkin="#f1c27d" />
                </div>
                <div className="elbow-pad"></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '15px', minHeight: '100px' }}>
                <div className="action-area" style={{ minHeight: '50px' }}>
                    {ui.position >= 100 && stage < 5 && <button onClick={nextStage}>Наступний раунд</button>}
                    {ui.position <= 0 && <button onClick={restartLevel}>Спробувати знову</button>}
                    {ui.position >= 100 && stage === 5 && <button onClick={goBack}>Повернутись в меню</button>}
                </div>
                <button className="back-btn" onClick={goBack}>В меню</button>
            </div>
        </div>
    );
};