const { useState, useEffect } = React;

const EasyLevel = ({ goBack }) => {
    const [stage, setStage] = useState(1);
    const [position, setPosition] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [message, setMessage] = useState("Готовий? Клікай по столу якнайшвидше!");

    const opponentVisuals = {
        1: { color: '#2980b9', name: 'Новачок (Синій)' },
        2: { color: '#16a085', name: 'Любитель (Бірюзовий)' },
        3: { color: '#f39c12', name: 'Профі (Оранжевий)' },
        4: { color: '#8e44ad', name: 'Чемпіон (Фіолетовий)' },
        5: { color: '#c0392b', name: 'БОС: Рука-Кувалда', isBoss: true }
    };

    const currentOpponent = opponentVisuals[stage];
    const opponentPower = stage * 0.85;
    const playerPower = 4;

    useEffect(() => {
        let interval;
        if (isPlaying && position > 0 && position < 100) {
            interval = setInterval(() => {
                setPosition(prev => {
                    const newPos = prev - opponentPower;
                    if (newPos <= 0) {
                        setIsPlaying(false);
                        setMessage("Тебе поклали! Спробуй ще раз.");
                        return 0;
                    }
                    return newPos;
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying, position, opponentPower]);

    const handlePush = () => {
        if (position <= 0 || position >= 100) return;

        if (!isPlaying) {
            setIsPlaying(true);
            setMessage("Боротьба пішла! КЛІКАЙ!");
        }

        setPosition(prev => {
            const newPos = prev + playerPower;
            if (newPos >= 100) {
                setIsPlaying(false);
                if (stage < 5) {
                    setMessage(`Перемога над ${currentOpponent.name}!`);
                } else {
                    setMessage("ТИ ЗДОЛАВ БОСА! ЧЕМПІОН ЛЕГКОГО РІВНЯ!");
                }
                return 100;
            }
            return newPos;
        });
    };

    const nextStage = () => {
        if (stage < 5) {
            setStage(stage + 1);
            setPosition(50);
            setMessage("Готовий? Клікай по столу якнайшвидше!");
        }
    };

    const restartLevel = () => {
        setPosition(50);
        setMessage("Готовий? Клікай по столу якнайшвидше!");
    };

    const rotationAngle = (position - 50) * 1.4;
    const isStrugglingClass = isPlaying ? "is-struggling" : "";

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="hud">
                <div>Раунд: {currentOpponent.isBoss ? "БОС" : stage} / 5</div>
                <div style={{ color: currentOpponent.color }}>
                    Суперник: {currentOpponent.name}
                </div>
            </div>

            <h3 style={{ textAlign: 'center', margin: '15px 0', color: '#ffea00', minHeight: '30px', textShadow: '0 0 10px rgba(255,234,0,0.5)' }}>
                {message}
            </h3>

            <div
                className={`wrestling-table ${currentOpponent.isBoss ? 'boss-mode' : ''}`}
                onClick={handlePush}
                style={{ '--opp-color': currentOpponent.color }}
            >
                {!isPlaying && position === 50 && <div className="click-hint">КЛІКАЙ ТУТ</div>}

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

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px', minHeight: '120px' }}>
                <div className="action-area" style={{ minHeight: '50px' }}>
                    {position >= 100 && stage < 5 && <button onClick={nextStage}>Наступний раунд</button>}
                    {position <= 0 && <button onClick={restartLevel}>Спробувати знову</button>}
                    {position >= 100 && stage === 5 && <button onClick={goBack}>Повернутись в меню</button>}
                </div>

                <button className="back-btn" onClick={goBack}>В меню</button>
            </div>
        </div>
    );
};