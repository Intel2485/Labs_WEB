const MediumLevel = ({ goBack }) => {
    const [stage, setStage] = React.useState(1);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [message, setMessage] = React.useState("Готовий? Тримай W та лови зону стрілочками ⬅️ ➡️");

    const [ui, setUI] = React.useState({ position: 50, stamina: 100, playerAngle: 0, targetAngle: 0 });

    const opponentVisuals = {
        1: { color: '#2980b9', name: 'Студент (Синій)' },
        2: { color: '#16a085', name: 'Аматор (Бірюзовий)' },
        3: { color: '#f39c12', name: 'Майстер (Оранжевий)' },
        4: { color: '#8e44ad', name: 'Термінатор (Фіолетовий)' },
        5: { color: '#c0392b', name: 'БОС: Сталевий Сухожилок', isBoss: true }
    };

    const currentOpponent = opponentVisuals[stage];
    
    const keys = React.useRef({ w: false, left: false, right: false });
    const gameData = React.useRef({ position: 50, stamina: 100, playerAngle: 0, targetAngle: 0, time: 0 });

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyW') keys.current.w = true;
            if (e.code === 'ArrowLeft') keys.current.left = true;
            if (e.code === 'ArrowRight') keys.current.right = true;
        };
        const handleKeyUp = (e) => {
            if (e.code === 'KeyW') keys.current.w = false;
            if (e.code === 'ArrowLeft') keys.current.left = false;
            if (e.code === 'ArrowRight') keys.current.right = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    React.useEffect(() => {
        let interval;
        if (isPlaying && gameData.current.position > 0 && gameData.current.position < 100) {
            interval = setInterval(() => {
                const data = gameData.current;
                data.time += 0.05;

                const speed = 0.8 + (stage * 0.25);
                data.targetAngle = Math.sin(data.time * speed) * 40; 

                if (keys.current.left) data.playerAngle = Math.max(-50, data.playerAngle - 3);
                if (keys.current.right) data.playerAngle = Math.min(50, data.playerAngle + 3);

                const isPushing = keys.current.w;
                const distanceToTarget = Math.abs(data.playerAngle - data.targetAngle);
                
                const isInZone = distanceToTarget < 18; 

                let oppPower = 0.4 + (stage * 0.15);
                let playerPower = 0;

                if (isPushing) {
                    if (data.stamina > 0) {
                        data.stamina = Math.max(0, data.stamina - 0.8); 
                        if (isInZone) {
                            playerPower = 1.0; 
                        } else {
                            playerPower = 0.1; 
                        }
                    }
                } else {
                    data.stamina = Math.min(100, data.stamina + 2.5); 
                }

                data.position = Math.max(0, Math.min(100, data.position + playerPower - oppPower));

                if (data.position <= 0) {
                    setIsPlaying(false);
                    setMessage("Енергія вичерпана або поганий кут! Тебе поклали.");
                } else if (data.position >= 100) {
                    setIsPlaying(false);
                    setMessage(stage < 5 ? `Чиста перемога над ${currentOpponent.name}!` : "ТИ ЗДОЛАВ БОСА СЕРЕДНЬОГО РІВНЯ!");
                }

                setUI({ ...data });

            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying, stage, currentOpponent.name]);

    const startGame = () => {
        if (!isPlaying) {
            setIsPlaying(true);
            setMessage("БОРОТЬБА!");
        }
    };

    const nextStage = () => {
        if (stage < 5) {
            setStage(stage + 1);
            gameData.current = { position: 50, stamina: 100, playerAngle: 0, targetAngle: 0, time: 0 };
            setUI({ ...gameData.current });
            setMessage("Готовий? Тримай W та лови зону стрілочками");
        }
    };

    const restartLevel = () => {
        gameData.current = { position: 50, stamina: 100, playerAngle: 0, targetAngle: 0, time: 0 };
        setUI({ ...gameData.current });
        setMessage("Готовий? Тримай W та лови зону стрілочками");
    };

    const rotationAngle = (ui.position - 50) * 1.4;

    const isStrugglingClass = (isPlaying && keys.current.w) ? "is-struggling" : "";

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="hud">
                <div>Раунд: {currentOpponent.isBoss ? "БОС" : stage} / 5</div>
                <div style={{ color: currentOpponent.color }}>Суперник: {currentOpponent.name}</div>
            </div>

            <div className="medium-hud">
                <div>
                    {/* Оновлено текст підказки */}
                    <div style={{fontSize: '14px', marginBottom: '5px', color: '#ccc'}}>ВИТРИВАЛІСТЬ (Відпусти W для відновлення):</div>
                    <div className="stamina-container">
                        <div className={`stamina-bar ${ui.stamina < 30 ? 'low' : ''}`} style={{ width: `${ui.stamina}%` }}></div>
                    </div>
                </div>

                <div>
                    <div style={{fontSize: '14px', marginBottom: '5px', color: '#ccc'}}>КУТ ТЯГИ (Лови зелену зону):</div>
                    <div className="angle-container">
                        <div className="angle-target-zone" style={{ left: `${ui.targetAngle + 50}%` }}></div>
                        <div className="angle-player-cursor" style={{ left: `${ui.playerAngle + 50}%` }}></div>
                    </div>
                    <div className="key-hints">
                        {/* Оновлено UI-підказку */}
                        <span>Тяга: <span className="key-badge">W</span></span>
                        <span>Контроль кута: <span className="key-badge">⬅️</span> <span className="key-badge">➡️</span></span>
                    </div>
                </div>
            </div>

            <h3 style={{ textAlign: 'center', margin: '5px 0 15px', color: '#ffea00', minHeight: '30px' }}>{message}</h3>

            <div className={`wrestling-table ${currentOpponent.isBoss ? 'boss-mode' : ''}`} style={{ '--opp-color': currentOpponent.color }}>
                {!isPlaying && ui.position === 50 && (
                    <button className="menu-btn" onClick={startGame} style={{position: 'absolute', top: '30%', zIndex: 20}}>
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