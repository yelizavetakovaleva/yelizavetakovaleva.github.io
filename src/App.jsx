import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from "motion/react";
import { FaWhatsapp, FaTelegram, FaViber, FaEnvelope } from "react-icons/fa";
import { C, services, path, tests, reviews } from "./data.js";

const ease = [0.2, 0.7, 0.1, 1];

/* Плавный скролл: работает независимо от настроек браузера */
let sc;
const goTo = (href) => {
  const el = href === "#top" ? null : document.querySelector(href);
  const from = window.scrollY;
  const to = el ? el.getBoundingClientRect().top + from - 72 : 0;
  sc?.stop();
  sc = animate(from, to, {
    duration: Math.min(1.5, 0.6 + Math.abs(to - from) / 3000),
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
  });
};
const A = ({ href, after, ...p }) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      goTo(href);
      after?.();
    }}
    {...p}
  />
);

const Reveal = ({ as = "div", delay = 0, y = 28, ...p }) => {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease }}
      {...p}
    />
  );
};

const Photo = ({ src, alt, className = "", instant }) => {
  const on = instant
    ? { animate: { clipPath: "inset(0 0 0% 0)" } }
    : {
        whileInView: { clipPath: "inset(0 0 0% 0)" },
        viewport: { once: true, margin: "-60px" },
      };
  const on2 = instant
    ? { animate: { scale: 1 } }
    : { whileInView: { scale: 1 }, viewport: { once: true } };
  return (
    <motion.div
      className={"photo " + className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      {...on}
      transition={{ duration: 1.2, ease, delay: instant ? 0.3 : 0 }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={instant ? "eager" : "lazy"}
        initial={{ scale: 1.25 }}
        {...on2}
        transition={{ duration: 1.6, ease }}
      />
    </motion.div>
  );
};

/* Фоновые элементы с параллаксом */
const bg = [
  ["Hello", 5, 12, 9, -8, 0.4, "b"],
  ["Danke", 76, 8, 8, 6, 0.7, "o"],
  ["ß", 90, 40, 14, 12, 0.3, "b"],
  ["?", 3, 50, 16, -10, 0.6, "o"],
  ["Guten Tag", 58, 60, 6, -4, 0.8, "b"],
  ["Thanks", 10, 80, 7, 8, 0.5, "o"],
  ["Ä", 84, 80, 13, -6, 0.9, "b"],
  ["ABC", 38, 28, 6, 4, 0.35, "o"],
  ["Ja!", 28, 92, 8, -12, 0.75, "b"],
  ["Yes", 68, 24, 7, 10, 0.45, "o"],
];
function BgItem({ d: [t, x, y, s, r, k, c] }) {
  const { scrollY } = useScroll();
  const yy = useTransform(
    scrollY,
    (v) => Math.sin(v / (500 + k * 400) + x) * 90
  );
  return (
    <motion.span
      className={"bgi " + c}
      style={{
        left: x + "%",
        top: y + "%",
        y: yy,
        fontSize: `clamp(2.2rem,${s}vw,${s * 16}px)`,
      }}
      initial={{ opacity: 0, rotate: r }}
      animate={{ opacity: 1, rotate: [r, r + 5, r] }}
      transition={{
        opacity: { duration: 1.5, delay: 0.5 },
        rotate: { duration: 8 + k * 6, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {t}
    </motion.span>
  );
}
const Backdrop = () => (
  <div className="bd" aria-hidden="true">
    {bg.map((d) => (
      <BgItem key={d[0]} d={d} />
    ))}
  </div>
);

/* Иконки соцсетей */
const socials = [
  ["WhatsApp", C.wa, <FaWhatsapp />, "#25D366"],
  ["Telegram", C.tg, <FaTelegram />, "#27A7E7"],
  ["Viber", C.viber, <FaViber />, "#7360F2"],
  ["MAX", C.max, <img src="/icons/max.svg" alt="" />, null],
  ["Почта", `mailto:${C.mail}`, <FaEnvelope />, "#FF7A45"],
];
const Socials = ({ light }) => (
  <div className={"socials" + (light ? " light" : "")}>
    {socials.map(([n, h, i, c]) => (
      <motion.a
        key={n}
        href={h}
        target="_blank"
        rel="noreferrer"
        aria-label={n}
        title={n}
        className={c ? "" : "plain"}
        style={c ? { "--c": c } : undefined}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.92 }}
      >
        {i}
      </motion.a>
    ))}
  </div>
);

/* Навигация */
const links = [
  ["#about", "Обо мне"],
  ["#services", "Занятия"],
  ["#quiz", "Тесты"],
  ["#path", "Опыт"],
];
function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <>
      <motion.nav
        className="nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <A href="#top" className="logo">
          Е. Ковалева
        </A>
        <div className="links">
          {links.map(([h, t]) => (
            <A key={h} href={h}>
              {t}
            </A>
          ))}
        </div>
        <A href="#contacts" className="btn sm hide-m">
          Связаться
        </A>
        <button
          className={"burger" + (open ? " x" : "")}
          onClick={() => setOpen(!open)}
          aria-label="Меню"
          aria-expanded={open}
        >
          <i />
          <i />
        </button>
        <motion.span className="bar" style={{ scaleX: w }} />
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: "circle(0% at 90% 4%)" }}
            animate={{ clipPath: "circle(150% at 90% 4%)" }}
            exit={{ clipPath: "circle(0% at 90% 4%)" }}
            transition={{ duration: 0.6, ease }}
          >
            {[...links, ["#contacts", "Связаться"]].map(([h, t], i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
              >
                <A href={h} after={() => setOpen(false)}>
                  {t}
                </A>
              </motion.div>
            ))}
            <Socials light />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Hero: заголовок и «живой диалог» поверх фото */
const ph = [
  ["EN", "How’s it going?", "Как дела?"],
  ["DE", "Wie geht’s dir?", "Как дела?"],
  ["EN", "Let’s practise!", "Давай потренируемся!"],
  ["DE", "Sehr gut gemacht!", "Отлично получилось!"],
  ["EN", "You can do it.", "У тебя получится."],
  ["DE", "Noch einmal, bitte.", "Ещё раз, пожалуйста."],
];
function Bubble({ p, cls }) {
  const [f, setF] = useState(false);
  return (
    <motion.button
      className={`bub ${cls} ${p[0] === "DE" ? "de" : ""}`}
      onClick={() => setF(!f)}
      title="Нажмите, чтобы увидеть перевод"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <small>{p[0]}</small>
      <span>{f ? p[2] : p[1]}</span>
    </motion.button>
  );
}
function Bubbles() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => x + 1), 3400);
    return () => clearInterval(t);
  }, []);
  const n = ph.length;
  return (
    <div className="bubs">
      <AnimatePresence>
        <Bubble key={"a" + i} p={ph[i % n]} cls="a" />
      </AnimatePresence>
      <AnimatePresence>
        <Bubble key={"b" + i} p={ph[(i + 3) % n]} cls="b" />
      </AnimatePresence>
    </div>
  );
}
const lines = ["Заговорите", "на двух", "языках."];
function Hero() {
  const up = (d) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.8, ease },
  });
  return (
    <header className="hero" id="top">
      <div className="hero-l">
        <h1 className="h1" aria-label={lines.join(" ")}>
          {lines.map((l, i) => (
            <span key={l} className="ln" aria-hidden="true">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.15 }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="lead" {...up(0.9)}>
          Я Елизавета, репетитор английского и немецкого. Занятия онлайн и очно.
        </motion.p>
        <motion.div className="row" {...up(1.05)}>
          <A className="btn" href="#plan">
            Подобрать занятия
          </A>
          <A className="ghost" href="#contacts">
            Написать мне
          </A>
        </motion.div>
        <motion.div {...up(1.2)}>
          <Socials />
        </motion.div>
      </div>
      <div className="hero-r">
        <span className="blob" />
        <Photo
          instant
          src="/images/2.jpg"
          alt="Елизавета проводит урок немецкого языка"
        />
        <Bubbles />
      </div>
    </header>
  );
}

function About() {
  return (
    <section className="sec about" id="about">
      <Photo src="/images/1.jpg" alt="Елизавета выступает перед студентами" />
      <div className="txt">
        <Reveal as="h2">Учусь учить</Reveal>
        <Reveal as="p" delay={0.1}>
          Я студентка 5 курса Севастопольского государственного университета.
          Получаю педагогическое образование сразу по двум профилям: иностранный
          язык и второй иностранный язык. Поэтому английский и немецкий для меня
          не только предмет, но и профессия.
        </Reveal>
        <Reveal as="p" delay={0.2}>
          Провожу уроки в школе и работаю со студентами, знаю, где обычно
          возникают трудности, и объясняю так, чтобы стало понятно. [Добавьте
          пару предложений о своём подходе.]
        </Reveal>
      </div>
    </section>
  );
}

function Services() {
  const [o, setO] = useState(0);
  return (
    <section className="sec" id="services">
      <Reveal as="h2">Чему учу</Reveal>
      <ul className="acc">
        {services.map((s, i) => (
          <Reveal
            as="li"
            key={s.t}
            delay={i * 0.06}
            className={o === i ? "open" : ""}
          >
            <button
              onClick={() => setO(o === i ? -1 : i)}
              aria-expanded={o === i}
            >
              <span>
                {s.t}
                <small>{s.s}</small>
              </span>
              <i aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {o === i && (
                <motion.div
                  className="acc-b"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease }}
                >
                  <div className="svc">
                    <div className="svc-t">
                      <p className="svc-lead">{s.lead}</p>
                      <h4>Для кого</h4>
                      <p>{s.who}</p>
                      <h4>Что будет на занятиях</h4>
                      <ul>
                        {s.plan.map((x, k) => (
                          <motion.li
                            key={x}
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.15 + k * 0.07,
                              duration: 0.5,
                              ease,
                            }}
                          >
                            {x}
                          </motion.li>
                        ))}
                      </ul>
                      <h4>Результат</h4>
                      <p>{s.result}</p>
                    </div>
                    <aside className="svc-r">
                      <Photo src={s.img} alt={s.t} />
                      <div className="svc-price">
                        <b>{s.price}</b>
                        <span>
                          Первое занятие: знакомство и диагностика уровня
                        </span>
                      </div>
                      <a
                        className="btn"
                        target="_blank"
                        rel="noreferrer"
                        href={`${C.wa}?text=${encodeURIComponent(
                          "Здравствуйте, Елизавета! Интересуют занятия: " +
                            s.t.toLowerCase() +
                            "."
                        )}`}
                      >
                        Записаться
                      </a>
                    </aside>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function Pick({ label, v, set, opts }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      {opts.map((o) => (
        <button
          key={o}
          className={"chip" + (v === o ? " on" : "")}
          onClick={() => set(o)}
        >
          {v === o && (
            <motion.span
              layoutId={"pill" + label}
              className="pill"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span>{o}</span>
        </button>
      ))}
    </fieldset>
  );
}
function Planner() {
  const [lang, setLang] = useState("Английский"),
    [who, setWho] = useState("Школьник"),
    [goal, setGoal] = useState("Говорить свободно");
  const msg = `Здравствуйте, Елизавета! Хочу заниматься: ${lang.toLowerCase()} язык, ученик — ${who.toLowerCase()}, цель — ${goal.toLowerCase()}.`;
  return (
    <Reveal as="section" className="sec dark" id="plan">
      <h2>Соберите заявку за три клика</h2>
      <div className="plan">
        <div>
          <Pick
            label="Язык"
            v={lang}
            set={setLang}
            opts={["Английский", "Немецкий", "Оба"]}
          />
          <Pick
            label="Кто учится"
            v={who}
            set={setWho}
            opts={["Школьник", "Студент", "Взрослый"]}
          />
          <Pick
            label="Цель"
            v={goal}
            set={setGoal}
            opts={[
              "Говорить свободно",
              "Школьная программа",
              "Экзамен",
              "Для путешествий",
            ]}
          />
        </div>
        <div className="out">
          <AnimatePresence mode="wait">
            <motion.p
              key={msg}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {msg}
            </motion.p>
          </AnimatePresence>
          <div className="row">
            <a
              className="btn alt"
              href={`${C.wa}?text=${encodeURIComponent(msg)}`}
              target="_blank"
              rel="noreferrer"
            >
              Отправить в WhatsApp
            </a>
            <a
              className="ghost lt"
              href={C.tg}
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* Тесты */
function Quiz() {
  const [ti, setTi] = useState(0),
    [i, setI] = useState(0),
    [s, setS] = useState(0),
    [pick, setPick] = useState(null);
  const t = tests[ti],
    qs = t.qs,
    done = i >= qs.length;
  const reset = (n) => {
    setTi(n);
    setI(0);
    setS(0);
    setPick(null);
  };
  const answer = (k) => {
    if (pick !== null) return;
    setPick(k);
    if (k === qs[i][2]) setS(s + 1);
  };
  const res = [...t.res].reverse().find((r) => s >= r[0]);
  return (
    <section className="sec" id="quiz">
      <Reveal as="h2">Проверьте себя</Reveal>
      <Reveal className="tabs" delay={0.1}>
        {tests.map((x, n) => (
          <button
            key={x.id}
            className={"tab" + (ti === n ? " on" : "")}
            onClick={() => reset(n)}
          >
            {ti === n && (
              <motion.span
                layoutId="tabpill"
                className="pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span>{x.title}</span>
          </button>
        ))}
      </Reveal>
      <Reveal className="quiz" delay={0.15}>
        <div className="prog">
          <motion.i
            animate={{
              width: `${(Math.min(i, qs.length) / qs.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id + (done ? "end" : i)}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {!done ? (
              <>
                <small>
                  Вопрос {i + 1} из {qs.length}
                </small>
                <p className="q">{qs[i][0]}</p>
                <div className="opts">
                  {qs[i][1].map((o, k) => (
                    <button
                      key={o}
                      onClick={() => answer(k)}
                      className={
                        pick === null
                          ? ""
                          : k === qs[i][2]
                          ? "ok"
                          : k === pick
                          ? "bad"
                          : "dim"
                      }
                    >
                      {o}
                    </button>
                  ))}
                </div>
                <button
                  className="ghost"
                  style={{ visibility: pick === null ? "hidden" : "visible" }}
                  onClick={() => {
                    setPick(null);
                    setI(i + 1);
                  }}
                >
                  {i === qs.length - 1 ? "Результат" : "Дальше"}
                </button>
              </>
            ) : (
              <>
                <small>
                  Ваш результат: {s} из {qs.length}
                </small>
                <p className="q">{res[1]}</p>
                <div className="meter">
                  <motion.i
                    initial={{ width: 0 }}
                    animate={{ width: `${(s / qs.length) * 100}%` }}
                    transition={{ duration: 1, ease }}
                  />
                </div>
                <p className="verdict">{res[2]}</p>
                <small>{t.note}</small>
                <div className="row">
                  <A className="btn" href="#plan">
                    Подобрать занятия
                  </A>
                  <button className="ghost" onClick={() => reset(ti)}>
                    Пройти ещё раз
                  </button>
                  <button
                    className="ghost"
                    onClick={() => reset((ti + 1) % tests.length)}
                  >
                    Другой тест
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

function Path() {
  return (
    <section className="sec" id="path">
      <Reveal as="h2">Образование и опыт</Reveal>
      <ol className="tl">
        {path.map(([y, t, d], i) => (
          <Reveal as="li" key={t} delay={i * 0.1} y={20}>
            <span>{y}</span>
            <div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      <div className="slots">
        {["Диплом или сертификат", "Сертификат", "Фото с занятия"].map(
          (t, i) => (
            <Reveal key={t} delay={i * 0.1} className="slot">
              {t}
              <br />
              <small>здесь будет фото</small>
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="sec">
      <Reveal as="h2">Отзывы</Reveal>
      <div className="rev">
        {reviews.map(([t, n], i) => (
          <Reveal as="blockquote" key={n} delay={i * 0.12}>
            <p>{t}</p>
            <footer>{n}</footer>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contacts() {
  return (
    <footer className="sec contacts" id="contacts">
      <Reveal as="h2">Давайте знакомиться</Reveal>
      <Reveal as="p" className="lead" delay={0.1}>
        Первое занятие нужно, чтобы узнать уровень и цели. Напишите удобным
        способом.
      </Reveal>
      <Reveal delay={0.15}>
        <a className="tel" href={`tel:${C.tel}`}>
          {C.phone}
        </a>
      </Reveal>
      <Reveal delay={0.2}>
        <Socials />
      </Reveal>
      <Reveal delay={0.25}>
        <a className="mail" href={`mailto:${C.mail}`}>
          {C.mail}
        </a>
      </Reveal>
      <small>© {new Date().getFullYear()} Елизавета Ковалева</small>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    history.scrollRestoration = "manual";
    if (location.hash)
      history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: "instant" });
    const stop = () => sc?.stop();
    addEventListener("wheel", stop, { passive: true });
    addEventListener("touchstart", stop, { passive: true });
    return () => {
      removeEventListener("wheel", stop);
      removeEventListener("touchstart", stop);
    };
  }, []);
  return (
    <>
      <Backdrop />
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Planner />
        <Quiz />
        <Path />
        <Reviews />
      </main>
      <Contacts />
    </>
  );
}
