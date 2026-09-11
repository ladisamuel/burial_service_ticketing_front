import { useEffect, useRef, useState } from "react";

import portrait from '../assets/imgs/portrait.png';
import img1 from '../assets/imgs/img1.jpg';
import img2 from '../assets/imgs/2.jpg'
import img3 from '../assets/imgs/3.jpg'
import img4 from '../assets/imgs/4.jpg'
import img5 from '../assets/imgs/5.jpg'
import img6 from '../assets/imgs/with_gaurd.jpg'
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


/* ---------------------------------------------------------------------- */
/* Content                                                                 */
/* ---------------------------------------------------------------------- */
 

const meta = [
  { label: "Born", value: "March 11, 1938", icon: "pi-calendar" },
  { label: "Passed", value: "May 19, 2026", icon: "pi-calendar-times" },
  { label: "Hometown", value: "Ido, Oyo", icon: "pi-map-marker" },
];

const eras = [
  {
    season: "Spring",
    years: "1938 - 1960",
    title: "The Girl from Charleston",
    body: "Eleanor Rose was born on a warm spring morning, the youngest of four. She grew up in a house full of books, music, and laughter, and spent summers on the porch working through the local library shelf by shelf.",
  },
  {
    season: "Summer",
    years: "1961 - 1980",
    title: "A Home Built on Love",
    body: "She married Robert Whitfield in June 1961, and together they raised three children in a house that always smelled of something baking. Neighbors knew her by the light in her kitchen window and a laugh that carried across any room.",
  },
  {
    season: "Autumn",
    years: "1965 - 1995",
    title: "Thirty Years in the Classroom",
    body: "For three decades Eleanor taught fourth grade at Maplewood Elementary. She believed children thrived when they felt seen, and made sure every one of hers did — earning Teacher of the Year four times over.",
  },
  {
    season: "Winter",
    years: "1995 - 2024",
    title: "Gratitude in Every Season",
    body: "Retirement meant her garden, her grandchildren, and a book club thirty-two years running. She traced her roots to Ireland and picked up watercolors at seventy-four. She never once stopped being curious.",
  },
];

const loved = [
  { label: "Coffee on the porch at sunrise", icon: "pi-sun" },
  { label: "Old movies on rainy afternoons", icon: "pi-cloud" },
  { label: "His garden, every September", icon: "pi-star" },
  { label: "Long letters, always hand-written", icon: "pi-send" },
  { label: "His grandchildren, above all else", icon: "pi-heart-fill" },
];

const numbers = [
  { value: "77", label: "years of a beautiful life" },
  { value: "12", label: "children" },
  { value: "21", label: "grandchildren" },
  { value: "35", label: "years in the classroom" },
  { value: "32", label: "years of her book club" },
];

// const gallery = [
//   { caption: "Wedding Day", sub: "June 1961", seed: "eleanor-wedding", tall: true },
//   { caption: "Maplewood Elementary", sub: "circa 1978", seed: "eleanor-classroom" },
//   { caption: "Family Reunion", sub: "Summer 1995", seed: "eleanor-reunion", wide: true },
//   { caption: "Her Garden", sub: "September 2018", seed: "eleanor-garden" },
//   { caption: "Story Time", sub: "Christmas 2021", seed: "eleanor-storytime", tall: true },
//   { caption: "Sunday Morning", sub: "circa 2022", seed: "eleanor-tea" },
// ];

// const tributes = [
//   {
//     name: "James Whitfield",
//     relation: "Son",
//     quote:
//       "Mom always said the secret to a good life was paying attention — to the people around you, to the food on your plate, to the light on a late afternoon. She was the best at it, and she made everyone around her better at it too.",
//   },
//   {
//     name: "Patricia Chen",
//     relation: "Friend of 40 years",
//     quote:
//       "We sat across from each other at book club for thirty-two years and she still surprised me every meeting. She read things with her whole heart. I will miss her laugh more than I can say.",
//   },
//   {
//     name: "Lily Whitfield",
//     relation: "Granddaughter",
//     quote:
//       "Grandma let me stay up late and eat cereal for dinner and told me I was going to do something remarkable. I believed her because she always meant everything she said. I still do.",
//   },
//   {
//     name: "Thomas Okafor",
//     relation: "Former student, class of 1982",
//     quote:
//       "Mrs. Whitfield saw something in me when I was nine that I couldn't see in myself yet. Forty years later I still think about the way she looked at me, like I had something to offer the world.",
//   },
// ];

/* ---------------------------------------------------------------------- */
/* Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function LeafMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21C7 21 3 17 3 10.5 3 6 6 3 12 3s9 3 9 7.5C21 17 17 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M12 21V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function QuoteMark({ className = "" }) {
  return (
    <svg viewBox="0 0 32 24" fill="none" className={className}>
      <path
        d="M13 24H4l4-11V0h9v11.5L13 24ZM28 24h-9l4-11V0h9v11.5L28 24Z"
        fill="currentColor"
      />
    </svg>
  );
}

function img(seed, w, h) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function HomePage() {
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false);
  const [tribs, setTribs] = useState([])

  const [gallery, setGallery] = useState([]);
  const [tributes, setTributes] = useState([]);
  
  const getGallery = async () => {
    const res = await api.get('/upload_image/photos/?count=8')
    console.log('Get response', res)
    setGallery(res?.data?.results)
  }
  

  const getTributes = async () => {
    const res = await api.get('/tributes/admin/tribute/')
    console.log('Get response', res)
    // setTribs(res?.data?.results)
    setTributes(res?.data?.results)
    
  }

  
const trib = [
  {
    message : "Been a long while..",
    name : "Samuel Ladi",
    relationship : "Son",
  },
  {
    message : "Been a long while..",
    name : "Samuel Ladi",
    relationship : "Son",
  }, 
]

  useEffect(()=>{
    getTributes()
  }, [])

  useEffect(() =>{
    getGallery()
  }, [])


  return (
    <div className="min-h-screen bg-[#F5F6F1] text-[#1C211C] font-[Inter,sans-serif] selection:bg-[#6F8267] selection:text-white">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap"
      />
      <style>{`
        .font-display { font-family: "Fraunces", serif; font-feature-settings: "ss01" 1; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

 
      {/* ---------------- Hero ---------------- */}
      <section id="top" className=" max-w-6xl mx-auto px-6 pt-10 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <Reveal className="">
          <p className="text-xs tracking-[0.22em] uppercase text-[#6F8267] mb-3 flex items-center gap-2">
            <LeafMark className="w-3.5 h-3.5" />
            A life well lived
          </p>
          <h1 className="font-display leading-[0.98] text-6xl sm:text-7xl md:text-8xl">
            Amos
            <br />
            <span className="italic text-[#B4652F]">Iyiola Ladipo</span>
          </h1>

          <p className="mt-5 max-w-md text-lg text-[#3A3F35] font-display italic leading-relaxed">
            He turned every ordinary moment into something worth
            remembering — a laugh, a meal, a hand held in the dark.
          </p>
          <p className="mt-3 text-sm text-[#656B5E]">— Children</p>

          <div className="mt-10 flex flex-wrap gap-2">
            {meta.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-2 rounded-full bg-[#ECEAE1] border border-[#DEDBCF] px-4 py-2 text-sm"
              >
                <i className={`pi ${m.icon} text-[#6F8267] text-xs`} />
                <span className="text-[#656B5E]">{m.label}</span>
                <span className="font-medium">{m.value}</span>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150} className="relative h-[80%]">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-[#6F8267]/15 -rotate-2" />
          <div className="relative  h-[100%] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(28,33,28,0.35)] aspect-[4/5]">
            <img
              src={portrait}
              alt="Portrait of Eleanor Rose Whitfield"
              className="w-full h-[full] object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white/90 backdrop-blur border border-[#DEDBCF] px-5 py-3 shadow-lg">
            <p className="font-display text-2xl leading-none">1938-2024</p>
          </div>
        </Reveal>
      </section>

      {/* ---------------- Story ---------------- */}
      {/* <section id="story" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal className="max-w-xl mb-16">
          <p className="text-xs tracking-[0.22em] uppercase text-[#6F8267] mb-3">
            His Story
          </p>
          <h2 className="font-display text-4xl sm:text-5xl leading-tight">
            A life in bloom, season by season
          </h2>
        </Reveal>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-[27px] sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#6F8267]/60 via-[#DEDBCF] to-[#6F8267]/60 sm:-translate-x-1/2"
          />

          <div className="space-y-14">
            {eras.map((era, i) => (
              <Reveal key={era.title} delay={i * 80}>
                <div
                  className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-10 ${
                    i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                  }`}
                >
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-1 w-14 h-14 rounded-full bg-[#F5F6F1] border border-[#DEDBCF] flex items-center justify-center shadow-sm z-10">
                    <LeafMark className="w-5 h-5 text-[#6F8267]" />
                  </div>

                  <div className="hidden sm:block sm:w-1/2" />

                  <div className="pl-20 sm:pl-0 sm:w-1/2">
                    <div
                      className={`rounded-3xl bg-[#ECEAE1]/70 border border-[#DEDBCF] p-6 sm:p-8 ${
                        i % 2 === 1 ? "sm:mr-2" : "sm:ml-2"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 text-xs tracking-[0.18em] uppercase text-[#6F8267] mb-2 ${
                          i % 2 === 1 ? "sm:justify-end" : ""
                        }`}
                      >
                        <span>{era.season}</span>
                        <span className="text-[#B7B2A0]">·</span>
                        <span className="text-[#656B5E] normal-case tracking-normal">{era.years}</span>
                      </div>
                      <h3 className="font-display text-2xl mb-3">{era.title}</h3>
                      <p className="text-[#3A3F35] leading-relaxed">{era.body}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section> */}

      {/* ---------------- Story ---------------- */}
      <section id="story" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal className="max-w-xl mb-16">
          <p className="text-xs tracking-[0.22em] uppercase text-[#6F8267] mb-3">
            His Story
          </p>
          <h2 className="font-display text-4xl sm:text-5xl leading-tight">
            A life in bloom, season by season
          </h2>
        </Reveal>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-[27px] sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#6F8267]/60 via-[#DEDBCF] to-[#6F8267]/60 sm:-translate-x-1/2"
          />


          <div className="space-y-14">
            {tribs.map((era, i) => (
              era?.visibility?.toLowerCase() === 'public' ?
              (
              <Reveal key={era.title} delay={i * 80}>
                <div
                  className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-10 ${
                    i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                  }`}
                >
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-1 w-14 h-14 rounded-full bg-[#F5F6F1] border border-[#DEDBCF] flex items-center justify-center shadow-sm z-10">
                    <LeafMark className="w-5 h-5 text-[#6F8267]" />
                  </div>

                  <div className="hidden sm:block sm:w-1/2" />

                  <div className="pl-20 sm:pl-0 sm:w-1/2">
                    <div
                      className={`rounded-3xl bg-[#ECEAE1]/70 border border-[#DEDBCF] p-6 sm:p-8 ${
                        i % 2 === 1 ? "sm:mr-2" : "sm:ml-2"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 text-xs tracking-[0.18em] uppercase text-[#6F8267] mb-2 ${
                          i % 2 === 1 ? "sm:justify-end" : ""
                        }`}
                      >
                        <span>{era.relationship}</span>
                        {/* <span className="text-[#B7B2A0]">·</span>
                        <span className="text-[#656B5E] normal-case tracking-normal">{era.years}</span> */}
                      </div>
                      <h3 className="font-display text-2xl mb-3">{era.name}</h3>
                      <p className="text-[#3A3F35] leading-relaxed">{era.message  }</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              ) : null

            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Moments & numbers ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6">
        <Reveal className="rounded-[2rem] bg-[#1C211C] text-white p-8 sm:p-10">
          <p className="text-xs tracking-[0.22em] uppercase text-[#9CB093] mb-6">
            He Loved
          </p>
          <ul className="space-y-4">
            {loved.map((l) => (
              <li key={l.label} className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <i className={`pi ${l.icon} text-[#C79A56] text-sm`} />
                </span>
                <span className="text-[#E7E6DE]">{l.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="grid grid-cols-2 gap-4">
          {numbers.map((n, i) => (
            <div
              key={n.label}
              className={`rounded-[1.5rem] border border-[#DEDBCF] bg-[#ECEAE1]/60 p-6 flex flex-col justify-between ${
                i === 0 ? "col-span-2" : ""
              }`}
            >
              <p className="font-display text-5xl text-[#6F8267]">{n.value}</p>
              <p className="text-sm text-[#656B5E] mt-2">{n.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ---------------- Gallery ---------------- */}
      <section id="gallery" className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal className=" mb-10">
          <p className="text-xs tracking-[0.22em] uppercase text-[#6F8267] mb-3">
            Photographs
          </p>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">
              A life in pictures
            </h2>
            <button onClick={() => navigate('/gallery')} className="text-xs flex gap-3 items-center px-4 py-2 bg-[#B4652F] text-white rounded-lg tracking-[0.15em] uppercase hover:bg-[#8A7F6A] transition-colors">
              <span>View more</span>
              <i className="pi pi-arrow-right"></i>
            </button>
          </div>

        </Reveal>

        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[200px]">
          {gallery.map((g) => (
            <figure
              key={g.id}
              className={`group relative rounded-[1.5rem] overflow-hidden ${
                g.tall ? "row-span-2" : ""
              } ${g.wide ? "col-span-2" : ""}`}
            >
              <img
                src={g.src}
                alt={g.memorial}
                className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-300" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 motion-safe:transition-all motion-safe:duration-300">
                <p className="text-white text-sm font-medium">{g.content}</p>
                <p className="text-white/70 text-xs">{g.year}</p>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      {/* ---------------- Tributes ---------------- */}
      <section id="tributes" className="bg-[#ECEAE1] border-y border-[#DEDBCF]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <Reveal className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#6F8267] mb-3">
                Remembrances
              </p>
              <h2 className="font-display text-4xl sm:text-5xl leading-tight">
                Words from those who loved her
              </h2>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm text-[#3A3F35] underline underline-offset-4 decoration-[#B7B2A0] hover:decoration-[#1C211C]"
            >
              Leave a tribute
              <i className="pi pi-arrow-up-right text-xs" />
            </a>
          </Reveal>

          <Reveal
            delay={100}
            className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-6 px-6"
          >
            {tributes.map((t) => (
              <div
                key={t.id}
                className="snap-start shrink-0 w-[300px] sm:w-[380px] rounded-[1.75rem] bg-[#F5F6F1] border border-[#DEDBCF] p-7"
              >
                <QuoteMark className="w-7 h-5 text-[#C79A56] mb-4" />
                <p className="text-[#3A3F35] leading-relaxed mb-6">{t.message} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste aut quos commodi modi laudantium esse impedit facere eius autem illum. </p>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-[#656B5E]">{t.relationship}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

    </div>
  );
}
