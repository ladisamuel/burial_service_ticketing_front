import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

/* ---------------------------------------------------------------------- */
/* Content                                                                 */
/* ---------------------------------------------------------------------- */

const categories = ["All", "Childhood", "Wedding & Family", "Teaching Years", "Others"];

// const photos = [
//   { seed: "eleanor-porch-1945", 
//     caption: "Summers on the porch", 
//     sub: "Charleston, 1946", 
//     category: "Childhood", h: 420 
//   },


//   { seed: "eleanor-library-1952", caption: "The library, shelf by shelf", sub: "circa 1952", category: "Childhood", h: 320 },
//   { seed: "eleanor-siblings-1955", caption: "The four of them", sub: "1955", category: "Childhood", h: 500 },

//   { seed: "eleanor-wedding-1961", caption: "Wedding day", sub: "June 1961", category: "Wedding & Family", h: 560 },
//   { seed: "eleanor-kitchen-1965", caption: "The kitchen window", sub: "circa 1965", category: "Wedding & Family", h: 340 },
//   { seed: "eleanor-children-1970", caption: "Three recitals, three victories", sub: "1970", category: "Wedding & Family", h: 460 },
//   { seed: "eleanor-family-1978", caption: "Sunday dinner", sub: "1978", category: "Wedding & Family", h: 380 },

//   { seed: "eleanor-classroom-1978", caption: "Fourth grade, Maplewood", sub: "circa 1978", category: "Teaching Years", h: 500 },
//   { seed: "eleanor-award-1988", caption: "Teacher of the Year", sub: "1988", category: "Teaching Years", h: 340 },
//   { seed: "eleanor-students-1992", caption: "Hundreds of students", sub: "1992", category: "Teaching Years", h: 440 },

//   { seed: "eleanor-garden-2018", caption: "Her garden, every September", sub: "September 2018", category: "Later Years", h: 480 },
//   { seed: "eleanor-ireland-2015", caption: "Tracing her roots", sub: "Ireland, 2015", category: "Later Years", h: 360 },
//   { seed: "eleanor-storytime-2021", caption: "Story time", sub: "Christmas 2021", category: "Later Years", h: 520 },
//   { seed: "eleanor-tea-2022", caption: "Sunday morning", sub: "circa 2022", category: "Later Years", h: 340 },
// ];

function img(seed, w) {
  return `https://picsum.photos/seed/${seed}/${w}/${w}`;
}

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
      { threshold: 0.1 }
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

function Lightbox({ items, index, onClose, onNavigate }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    },
    [onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const photo = items[index];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#100F0C]/95 backdrop-blur-sm flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between px-5 sm:px-8 py-5 text-[#D6DECF]">
        <span className="text-sm tracking-[0.14em] uppercase">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C79A56]"
        >
          <i className="pi pi-times text-lg" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center px-4 sm:px-16 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onNavigate(-1)}
          aria-label="Previous photo"
          className="hidden sm:flex w-11 h-11 shrink-0 rounded-full items-center justify-center text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C79A56] mr-4"
        >
          <i className="pi pi-chevron-left" />
        </button>

        <figure className="max-h-full max-w-3xl w-full">
          <img
            src={photo.src}
            alt={photo.content}
            className="w-full max-h-[70vh] object-contain rounded-2xl mx-auto"
          />
          <figcaption className="text-center mt-5">
            <p className="font-display text-2xl text-white">{photo.content}</p>
            <p className="text-sm text-[#B7C7AF] mt-1">{photo.sub}</p>
          </figcaption>
        </figure>

        <button
          onClick={() => onNavigate(1)}
          aria-label="Next photo"
          className="hidden sm:flex w-11 h-11 shrink-0 rounded-full items-center justify-center text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C79A56] ml-4"
        >
          <i className="pi pi-chevron-right" />
        </button>
      </div>

      <div
        className="sm:hidden flex justify-center gap-8 pb-8 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => onNavigate(-1)} aria-label="Previous photo" className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
          <i className="pi pi-chevron-left" />
        </button>
        <button onClick={() => onNavigate(1)} aria-label="Next photo" className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
          <i className="pi pi-chevron-right" />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function GalleryPage() {
  const navigateHome = useNavigate()
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [photoLen, setPhotoLen] = useState(0)
  const filtered = filter === "All" ? photos : photos.filter((p) => p.memorial === filter);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const navigate = (dir) =>
    setLightboxIndex((i) => (i === null ? i : (i + dir + filtered.length) % filtered.length));

  const goHome = () => {
    navigateHome('/')
  }

  
  const getGallery = async () => {
    const res = await api.get('/upload_image/photos/')
    console.log('Get response', res)
    setPhotos(res?.data?.results)
    setPhotoLen(res?.data?.count)
  }

  
  useEffect(() =>{
    getGallery()
  }, [])
  
  return (
    <div className="min-h-screen bg-[#F5F6F1] text-[#1C211C] font-[Inter,sans-serif] selection:bg-[#6F8267] selection:text-white">
       
      {/* ---------------- Header ---------------- */}
      <header className="sticky top-0 z-30  backdrop-blur-md border-b ">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span
          onClick={goHome}
            className="cursor-pointer inline-flex items-center gap-2 text-sm text-[#3A3F35] hover:text-[#1C211C] rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6F8267]"
          >
            <i className="pi pi-arrow-left text-xs" />
            Back to home
          </span> 
        </div>
      </header>

      {/* ---------------- Intro ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <Reveal>
          <p className="text-xs tracking-[0.22em] uppercase text-[#6F8267] mb-4 flex items-center gap-2">
            <LeafMark className="w-3.5 h-3.5" />
            Photographs, 1938 - 2024
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] max-w-3xl">
            A life in pictures, <span className="italic text-[#6F8267]">a hand held in the dark</span>
          </h1>
          <p className="mt-6 max-w-xl text-[#3A3F35] leading-relaxed">
            {photoLen} moments, gathered from eight decades — a porch in
            Charleston, a classroom at Maplewood, a garden every September.
            Click any photograph to look closer.
          </p>
        </Reveal>
      </section>

      {/* ---------------- Filters ---------------- */}
      <div className="sticky top-[57px] z-20 bg-[#F5F6F1]/90 backdrop-blur-md border-b border-[#DEDBCF]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6F8267] ${
                filter === c
                  ? "bg-[#1C211C] border-[#1C211C] text-white"
                  : "bg-transparent border-[#DEDBCF] text-[#3A3F35] hover:border-[#6F8267]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}`}</style>

      {/* ---------------- Masonry grid ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Reveal className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {filtered?.map((p, i) => (
            <figure
              key={p?.id}
              className="group relative mb-5 break-inside-avoid rounded-[1.5rem] overflow-hidden cursor-zoom-in border border-[#DEDBCF]/60"
              onClick={() => openLightbox(i)}
            >
              <img
                src={p?.src}
                alt={p?.content}
                // style={{ height: `${p?.h}px` }}
                className="w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-300" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 motion-safe:transition-all motion-safe:duration-300">
                <p className="text-white font-display text-lg leading-tight">{p.content}</p>
                <p className="text-white/70 text-xs mt-0.5">{p.year}</p>
              </figcaption>
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity flex items-center justify-center">
                <i className="pi pi-search-plus text-xs text-[#1C211C]" />
              </span>
            </figure>
          ))}
        </Reveal>

        {filtered.length === 0 && (
          <p className="text-center text-[#656B5E] py-20">No photographs in this chapter yet.</p>
        )}
      </section>

      {/* ---------------- Closing line ---------------- */}
      <section className="border-t border-[#DEDBCF]">
        <Reveal className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="font-display italic text-2xl sm:text-3xl text-[#6F8267]">
            "Still here, in every good thing."
          </p>
        </Reveal>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}