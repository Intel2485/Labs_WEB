const SvgWrestlingArms = ({ opponentSleeve, opponentSkin }) => {
    const pSleeve = "#f1c40f";
    const pSkin = "#d2a679";

    return (
        <svg viewBox="0 0 300 400" width="100%" height="100%" style={{ filter: 'drop-shadow(0px 25px 20px rgba(0,0,0,0.7))', overflow: 'visible' }}>
            <defs>
                <linearGradient id="sleeve-p" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#554400" />
                    <stop offset="50%" stopColor={pSleeve} />
                    <stop offset="100%" stopColor="#332200" />
                </linearGradient>
                <linearGradient id="sleeve-o" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#111" />
                    <stop offset="50%" stopColor={opponentSleeve} />
                    <stop offset="100%" stopColor="#000" />
                </linearGradient>
                <linearGradient id="skin-p" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8a6442" />
                    <stop offset="50%" stopColor={pSkin} />
                    <stop offset="100%" stopColor="#4a2e15" />
                </linearGradient>
                <linearGradient id="skin-o" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a37c4a" />
                    <stop offset="50%" stopColor={opponentSkin} />
                    <stop offset="100%" stopColor="#5c4122" />
                </linearGradient>
            </defs>

            {/* Ліва рука (Гравець) */}
            <g>
                <path d="M 80,260 Q 130,150 145,80" fill="none" stroke="url(#skin-p)" strokeWidth="45" strokeLinecap="round" />
                <path d="M 60,450 L 90,240" fill="none" stroke="url(#sleeve-p)" strokeWidth="65" strokeLinecap="round" />
            </g>

            {/* Права рука (Опонент) */}
            <g>
                <path d="M 220,260 Q 170,150 155,80" fill="none" stroke="url(#skin-o)" strokeWidth="45" strokeLinecap="round" />
                <path d="M 240,450 L 210,240" fill="none" stroke="url(#sleeve-o)" strokeWidth="65" strokeLinecap="round" />
            </g>

            {/* ЗАМОК (Зчеплені кисті по центру) */}
            <g>
                {/* Основа руки опонента (ззаду) */}
                <circle cx="160" cy="65" r="28" fill="url(#skin-o)" />
                {/* Основа нашої руки (спереду) */}
                <circle cx="140" cy="75" r="28" fill="url(#skin-p)" />

                {/* Наші пальці, що обхоплюють руку опонента */}
                <path d="M 140 40 C 165 35, 185 55, 160 85" fill="none" stroke="url(#skin-p)" strokeWidth="16" strokeLinecap="round" />

                {/* Великий палець опонента */}
                <path d="M 175 60 Q 150 50 145 80" fill="none" stroke="url(#skin-o)" strokeWidth="12" strokeLinecap="round" />
            </g>
        </svg>
    );
};