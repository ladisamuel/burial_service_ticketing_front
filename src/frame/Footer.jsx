import React, { useEffect, useRef, useState } from 'react'


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
  
export default function Footer() {
  const service = [
    { 
      label: "Wake Keeping", 
      value: "CAC Ojo Layout", 
      icon: "pi-warehouse" 
    },
    { 
      label: "10:00 AM - 2:00 PM", 
      value: "Thursday, December 10, 2026", 
      icon: "pi-calendar" 
    },
    { 
      label: "Burial Service", 
      value: "Ibadan Civic Center", 
      icon: "pi-building" 
      // icon: "pi-clock" 
    },
    { 
      label: "12:00 PM - 7:00 PM", 
      value: "Friday, December 11, 2026", 
      // icon: "pi-map-marker"
      icon: "pi-calendar" 
    }, 
  ];
  

  return (
    
    <footer id="service" className="relative overflow-hidden bg-[#3E4B39] text-white rounded-t-[3rem] mt-0">
        {/* ---------------- Service ---------------- */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Reveal className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 items-start">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#B7C7AF] mb-3">
                In Loving Memory
              </p>
              <h2 className="font-display text-4xl sm:text-5xl leading-tight mb-6">
                Celebrating his life
              </h2>
              <p className="text-[#D6DECF] leading-relaxed max-w-md mb-10">
                {/* Family and friends are invited to gather and share memories. */}
                Family and friends are warmly invited to come together, honor
              his memory, and celebrate a life that touched so many.
            
                
              </p>
              <p className="font-display italic text-2xl sm:text-3xl text-[#EAD9AE] leading-snug">
                "Still here, in every good thing."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.map((s, index) => (
                <div
                  key={s.label}
                  className={`relative rounded-2xl bg-white/10 border border-white/15 p-5 ${index%2==0? 'bg-gray-800/60 ':'bg-gray-800/20 '}  `}
                >
                  <i className={`pi ${s.icon} text-[#EAD9AE] mb-3 block text-lg`} />
                  <p className="text-xs tracking-[0.16em] uppercase text-[#B7C7AF] mb-1">
                    {s.label}
                  </p>
                  <p className="text-sm text-white">{s.value}</p>
                  <div className="text-white/50">
                  <i className={`hidden absolute -translate-y-1/2 top-1/2 right-5 pi pi-arrow-right ${index%2==0? 'sm:block':' hidden'}`}></i>
                  <i className={`sm:hidden absolute -translate-y-1/2 top-1/2 right-5 pi pi-arrow-down ${index%2==0? '':'hidden'}`}></i>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="border-t border-white/15">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#B7C7AF]">
            <span>Ladipo Family · +234-806-701-0503</span>
            <span>Created with love by Family and Friends</span>
          </div>
        </div>
      </footer>

  )
}


      // <footer className="bg-[#2A2620] text-[#E9E2D0]">
      //     {/* Service info */}
      //   <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-10">
      //     <div>
      //       <p className="text-xs tracking-[0.2em] uppercase text-[#C99A6B] mb-2">
      //         Memorial Service
      //       </p>
      //       <h3 className="text-2xl mb-4">Celebrating His Life</h3>
      //       <p className="text-sm text-[#B8AF9D] leading-relaxed">
      //         Family and friends are invited to gather and share memories. In
      //         lieu of flowers, donations to the Charleston Public Library in
      //         his name would bring his great joy.
      //       </p>
      //     </div>

      //     <div>
      //       <p className="text-xs tracking-[0.2em] uppercase text-[#C99A6B] mb-2">
      //         Date
      //       </p>
      //       <p className="text-sm mb-6">Friday, December 11, 2026</p>
      //       <p className="text-xs tracking-[0.2em] uppercase text-[#C99A6B] mb-2">
      //         Location
      //       </p>
      //       <p className="text-sm">Ibadan Civic Center, Ibadan, Nigeria</p>
      //     </div>

      //     <div>
      //       <p className="text-xs tracking-[0.2em] uppercase text-[#C99A6B] mb-2">
      //         Time
      //       </p>
      //       <p className="text-sm mb-6">12:00 PM — 7:00 PM</p>
      //       <p className="text-xs tracking-[0.2em] uppercase text-[#C99A6B] mb-2">
      //         Reception
      //       </p>
      //       <p className="text-sm">Ibadan Civic Center, Ibadan, Nigeria</p>
      //     </div>

      //     <div className="border-l border-[#4A4336] pl-8 flex items-center">
      //       <p className="italic text-2xl leading-snug text-[#E9C9A0]">
      //         "Still here,
      //         <br />
      //         in every
      //         <br />
      //         good thing."
      //       </p>
      //     </div>
      //   </div>

      //   <div className="border-t border-[#4A4336]">
      //     <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#7A7262]">
      //       <span>Amos Iyiola ladipo · 1938-2026</span>
      //       <span>Created with love From Ladipos</span>
      //     </div>
      //   </div>
      // </footer>