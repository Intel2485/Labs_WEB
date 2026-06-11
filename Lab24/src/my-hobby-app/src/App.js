import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

import imgChiron from "./imgChiron.jpg";
import imgDivo from "./imgDivo.jpeg";
import imgT50 from "./imgT50.jpeg";

const CARS = [
  {
    id: 1,
    name: "Bugatti Chiron Super Sport 300+",
    year: "2019",
    class: "Hypercar · 915",
    screenshot: imgChiron,
    description:
      "Абсолютний рекордсмен та вершина інженерної думки. Легендарний двигун W16 видає 1600 кінських сил, перетворюючи прямі лінії на гіперпростір. У Motorfest — це головна зброя для заїздів на шалені швидкості вздовж узбережжя Гаваїв.",
    stats: [
      { label: "Топ швидкість", value: "490 км/г" },
      { label: "0–100", value: "2.2 с" },
      { label: "Привід", value: "AWD" },
      { label: "Двигун", value: "W16 Quad-Turbo" },
    ],
  },
  {
    id: 2,
    name: "Bugatti Divo Magma Edition",
    year: "2020",
    class: "Hypercar · 920",
    screenshot: imgDivo,
    description:
      "Унікальне виконання Magma Edition перетворює трековий тренажер Divo на справжній вибух стилю. Божевільний притискний колір, агресивний аеродинамічний обвіс та фірмовий W16. У Motorfest ця машина просто створена для того, щоб карати суперників на звивистих серпантинах Гаваїв, де звичайна Chiron пасує через свою вагу.",
    stats: [
      { label: "Топ швидкість", value: "380 км/г" },
      { label: "0–100", value: "2.4 с" },
      { label: "Привід", value: "AWD" },
      { label: "Двигун", value: "W16 Quad-Turbo" },
    ],
  },
  {
    id: 3,
    name: "GMA T.50",
    year: "2022",
    class: "Hypercar · 885",
    screenshot: imgT50,
    description:
      "Найчистіший та найлегший аналоговий суперкар сучасності. Атмосферний V12 від Cosworth видає неймовірний крик на 12 000 об/хв, а вентилятор на кормі буквально присмоктує машину до треку. У Motorfest — це абсолютний кайф для технічних трас Гонолулу, де важлива не просто максималка на прямій, а філігранна точність у кожному повороті.",
    stats: [
      { label: "Топ швидкість", value: "363 км/г" },
      { label: "0–100", value: "2.8 с" },
      { label: "Привід", value: "RWD" },
      { label: "Двигун", value: "3.9L Cosworth V12" },
    ],
  },
];

function extractColor(imgEl) {
  try {
    const canvas = document.createElement("canvas");
    const size = 100;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) {
      const pr = data[i], pg = data[i + 1], pb = data[i + 2];
      const brightness = (pr + pg + pb) / 3;
      if (brightness > 30 && brightness < 225) {
        r += pr; g += pg; b += pb; count++;
      }
    }
    if (count === 0) return null;
    return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
  } catch {
    return null;
  }
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function ThemeSwitcher({ theme, setTheme }) {
  const switcherRef = useRef(null);
  const prevRef = useRef("dark");

  const optionIndex = { light: 1, dark: 2, dim: 3 };

  useEffect(() => {
    if (switcherRef.current) {
      switcherRef.current.setAttribute("c-previous", String(optionIndex[prevRef.current] ?? 2));
      prevRef.current = theme;
    }
  }, [theme]);

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
      <path fill="var(--c)" fillRule="evenodd" d="M18 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clipRule="evenodd"/>
      <path fill="var(--c)" d="M17 6.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 7.742a1 1 0 1 1 1.618 1.176L24.1 11.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 13.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM29.722 20.795a1 1 0 0 1-.619 1.902l-2.853-.927a1 1 0 1 1 .618-1.902l2.854.927ZM25.862 27.159a1 1 0 0 1-1.618 1.175l-1.763-2.427a1 1 0 1 1 1.618-1.175l1.763 2.427ZM19 30.038a1 1 0 0 1-2 0v-3a1 1 0 1 1 2 0v3ZM11.755 28.334a1 1 0 0 1-1.618-1.175l1.764-2.427a1 1 0 1 1 1.618 1.175l-1.764 2.427ZM6.896 22.697a1 1 0 1 1-.618-1.902l2.853-.927a1 1 0 1 1 .618 1.902l-2.853.927ZM6.278 15.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 8.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z"/>
    </svg>
  );
  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
      <path fill="var(--c)" d="M12.5 8.473a10.968 10.968 0 0 1 8.785-.97 7.435 7.435 0 0 0-3.737 4.672l-.09.373A7.454 7.454 0 0 0 28.732 20.4a10.97 10.97 0 0 1-5.232 7.125l-.497.27c-5.014 2.566-11.175.916-14.234-3.813l-.295-.483C5.53 18.403 7.13 11.93 12.017 8.77l.483-.297Zm4.234.616a8.946 8.946 0 0 0-2.805.883l-.429.234A9 9 0 0 0 10.206 22.5l.241.395A9 9 0 0 0 22.5 25.794l.416-.255a8.94 8.94 0 0 0 2.167-1.99 9.433 9.433 0 0 1-2.782-.313c-5.043-1.352-8.036-6.535-6.686-11.578l.147-.491c.242-.745.573-1.44.972-2.078Z"/>
    </svg>
  );
  const DimIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
      <path fill="var(--c)" d="M5 21a1 1 0 0 1 1-1h24a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM12 25a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1ZM15 29a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM18 13a6 6 0 0 1 5.915 7h-2.041A4.005 4.005 0 0 0 18 15a4 4 0 0 0-3.874 5h-2.041A6 6 0 0 1 18 13ZM17 7.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 8.742a1 1 0 1 1 1.618 1.176L24.1 12.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 14.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM6.278 16.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 9.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z"/>
    </svg>
  );

  const opts = [
    { value: "light", icon: <SunIcon />, cOption: "1" },
    { value: "dark",  icon: <MoonIcon />, cOption: "2" },
    { value: "dim",   icon: <DimIcon />, cOption: "3" },
  ];

  return (
    <fieldset className="switcher" ref={switcherRef}>
      <legend className="switcher__legend">Choose theme</legend>
      {opts.map((opt) => (
        <label key={opt.value} className="switcher__option">
          <input
            className="switcher__input"
            type="radio"
            name="theme"
            value={opt.value}
            c-option={opt.cOption}
            checked={theme === opt.value}
            onChange={() => setTheme(opt.value)}
          />
          <span className="switcher__icon">{opt.icon}</span>
        </label>
      ))}
      <div className="switcher__filter">
        <svg>
          <filter id="switcher" primitiveUnits="objectBoundingBox">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.04" result="blur"/>
            <feDisplacementMap in="blur" in2="SourceGraphic" scale="0.5" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </svg>
      </div>
    </fieldset>
  );
}

function CarCard({ car }) {
  const imgRef = useRef(null);
  const [accentColor, setAccentColor] = useState(null);

  const handleImageLoad = useCallback(() => {
    if (!imgRef.current) return;
    const color = extractColor(imgRef.current);
    if (color) {
      const [h, s, l] = rgbToHsl(color.r, color.g, color.b);
      setAccentColor(`${h}, ${Math.max(s, 55)}%, ${Math.min(Math.max(l, 38), 68)}%`);
    }
  }, []);

  const accentStyle = accentColor ? {
    "--car-h": accentColor,
    "--car-accent": `hsl(${accentColor})`,
  } : {};

  return (
    <article className={`car-card ${accentColor ? "car-card--colored" : ""}`} style={accentStyle}>

      {/* Фото */}
      <div className="car-card__img-wrap">
        <img
          ref={imgRef}
          src={car.screenshot}
          alt={car.name}
          className="car-card__img"
          crossOrigin="anonymous"
          onLoad={handleImageLoad}
        />
        {accentColor && <div className="car-card__glow" />}
      </div>

      {/* Текст */}
      <div className="car-card__body">
        <div className="car-card__meta">
          <span className="car-card__year">{car.year}</span>
          <span className="car-card__class">{car.class}</span>
        </div>
        <h2 className="car-card__name">{car.name}</h2>
        <p className="car-card__desc">{car.description}</p>

        <div className="car-card__stats">
          {car.stats.map((s) => (
            <div key={s.label} className="car-stat">
              <span className="car-stat__value">{s.value}</span>
              <span className="car-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Акцентна смуга */}
      {accentColor && <div className="car-card__stripe" />}
    </article>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <ThemeSwitcher theme={theme} setTheme={setTheme} />

      <header className="site-header">
        <p className="site-header__eyebrow">The Crew · Motorfest</p>
        <h1 className="site-header__title">Моя колекція</h1>
        <p className="site-header__sub">
          Машини, з якими я пройшов увесь Гаваї. Кожна — своя історія.
        </p>
      </header>

      <main className="cars-list">
        {CARS.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </main>

      <footer className="site-footer">
        <span>Motorfest · Моя колекція © 2025</span>
      </footer>
    </div>
  );
}