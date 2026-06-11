const Guide = ({ goBack }) => (
    <div className="guide-wrapper">
        <h2 className="game-title" style={{ fontSize: '55px' }}>Правила Турніру</h2>
        
        <div className="rules-grid">
            <div className="rule-card easy-rule">
                <div className="card-icon">🖱️</div>
                <h3>Легкий</h3>
                <div className="difficulty-badge green">Доступно</div>
                <p>Швидкість — твоя єдина зброя. Натискай по ігровому столу якомога швидше та частіше, щоб пересилити опонента. З кожним раундом суперник стає сильнішим!</p>
            </div>

            <div className="rule-card medium-rule">
                <div className="card-icon">⌨️</div>
                <h3>Середній</h3>
                <div className="difficulty-badge orange">Доступно</div>
                <p>Контроль кисті та тяги. Використовуй клавіатуру для утримання правильного кута сили. Слідкуй за витривалістю та не дай супернику перехопити ініціативу.</p>
            </div>

            <div className="rule-card hard-rule">
                <div className="card-icon">🎯</div>
                <h3>Складний</h3>
                <div className="difficulty-badge red">Заблоковано</div>
                <p>Повний симулятор боротьби. Мікроконтроль клавіш для балансу та робота оптикою миші для різких ривків (топ-рол або крюк). Тільки для справжніх чемпіонів.</p>
            </div>
        </div>

        <button className="menu-btn guide-btn" onClick={goBack} style={{ marginTop: '60px' }}>
            <span>Повернутися в меню</span>
        </button>
    </div>
);