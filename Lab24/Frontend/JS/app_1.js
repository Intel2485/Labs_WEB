const App = () => {
    const [currentScreen, setCurrentScreen] = React.useState('menu');

    return (
        <div className="game-container">
            {currentScreen === 'menu' && (
                <div className="main-menu">

                    <div>
                        <h1 className="game-title">Arm Wrestling</h1>
                        <div className="subtitle">Ultimate Championship</div>
                    </div>

                    <div className="tournament-menu">
                        <button className="menu-btn" onClick={() => setCurrentScreen('easy')}>
                            <span>Легкий (Клікер)</span>
                        </button>

                        <button className="menu-btn" style={{ borderColor: '#f39c12' }} onClick={() => setCurrentScreen('medium')}>
                            <span>Середній (Клавіатура)</span>
                        </button>

                        <button className="menu-btn" style={{ borderColor: '#e74c3c' }} onClick={() => setCurrentScreen('hard')}>
                            <span>Складний (Миша + Оптика)</span>
                        </button>

                        <button className="menu-btn guide-btn" onClick={() => setCurrentScreen('guide')}>
                            <span>📖 Правила турніру</span>
                        </button>
                    </div>

                    {/* Банери спонсорів */}
                    <div className="sponsors-bar">
                        <span>⚡ MONSTER POWER</span>
                        <span>🔥 MOJO ENERGY</span>
                        <span>⚙️ BEAMNG PERFORMANCE</span>
                    </div>
                </div>
            )}

            {/* Ігрові екрани */}
            {currentScreen === 'guide' && <Guide goBack={() => setCurrentScreen('menu')} />}
            {currentScreen === 'easy' && <EasyLevel goBack={() => setCurrentScreen('menu')} />}
            {currentScreen === 'medium' && <MediumLevel goBack={() => setCurrentScreen('menu')} />}
            {currentScreen === 'hard' && <HardLevel goBack={() => setCurrentScreen('menu')} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);