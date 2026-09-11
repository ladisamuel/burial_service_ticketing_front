

import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import song from '../assets/music/I_Will_Always_Love_You.mp3';
export default function Header() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mute, setMute] = useState(true)
  const audioRef = useRef(null)

  const navLinks = [
    {
      text: "Home",
      link: '/'
    },
    {
      text: "Gallery",
      link: '/gallery'
    },
    {
      // text: "Share a Memory",
      text: "Leave a tribute",
      link: '/share-memory'
    },
    {
      text: "Book a ticket",
      link: '/request-ticket'
    },
  ];


  const handleMute = async () => {
    const audio = audioRef.current

    if (!audio) return

    const newMute = !mute
    setMute(newMute)

    if (newMute) {
      // Muting
      audio.muted = true
      try {
        await audio.pause()
      } catch (error) {
        console.log('Could not play audio:', error)
      }
    } else {
      // Unmuting
      audio.muted = false

      try {
        await audio.play()
      } catch (error) {
        console.log('Could not play audio:', error)
      }
    }
  }
 
  return (

    <header className="border-b border-[#E3DBC8] relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <span
          onClick={() =>{setMenuOpen(false); navigate('/')}}
          className="text-xs tracking-[0.2em] uppercase text-[#8A7F6A] cursor-pointer">
          Amos Iyiola Ladipo
        </span>
        
        <nav className="hidden sm:flex items-center gap-8">
      <p className=''>
        <i onClick={handleMute} className={`pi ${mute ? 'pi-volume-off' : 'pi-volume-up'}`} />
      </p>
      <audio ref={audioRef} autoPlay loop muted={mute}>
        <source src={song} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
          {navLinks.map((item) => (

            item.text === "Book a ticket" ? (

              <button
                key={item.text}
                onClick={() => navigate(item.link)}
                className="px-4 py-2 bg-[#B4652F] text-white rounded-lg text-xs tracking-[0.15em] uppercase hover:bg-[#8A7F6A] transition-colors"
              >
                {item.text}
              </button>
            ) : (
              <span
                key={item.text}
                onClick={() => navigate(item.link)}
                className={`text-xs tracking-[0.15em] uppercase text-[#6B6153] hover:text-[#B4652F] transition-colors ${item.link === window.location.pathname ? 'font-semibold' : 'cursor-pointer'}`}
              >
                {item.text}
              </span>
            )

          ))}
        </nav>


        {/* Mobile Menu */}
          <p className='sm:hidden'>
        <i onClick={handleMute} className={`pi ${mute ? 'pi-volume-off' : 'pi-volume-up'}`} />
      </p>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="sm:hidden text-[#6B6153] hover:text-[#B4652F] transition-colors"
        >
          <i className={`pi ${menuOpen ? "pi-times" : "pi-bars"} text-lg`} />
        </button>
        
      </div>

          {/* Mobile Menu */}
      <nav
        className={`sm:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out bg-[#FAF6EF] border-t border-[#E3DBC8] ${menuOpen ? "max-h-64" : "max-h-0 border-t-0"
          }`}
      >
        <div className="flex flex-col px-6 py-2">
          {navLinks.map((item) => (
            // <a
            //   key={link}
            //   href="#"
            //   onClick={() => setMenuOpen(false)}
            //   className="py-3 text-xs tracking-[0.15em] uppercase text-[#6B6153] hover:text-[#B4652F] transition-colors border-b border-[#E3DBC8] last:border-b-0"
            // >
            //   {link}
            // </a>

            item.text === "Book a ticket" ? (

              <button
                key={item.text}
                onClick={() => navigate(item.link)}
                className="w-fit my-2 px-4 py-2 bg-[#B4652F] text-white rounded-lg text-xs tracking-[0.15em] uppercase hover:bg-[#8A7F6A] transition-colors"
              >
                {item.text}
              </button>
            ) : (
              <span
                key={item.text}
                onClick={() => {setMenuOpen(false);navigate(item.link)}}
                // className={`text-xs tracking-[0.15em] uppercase text-[#6B6153] hover:text-[#B4652F] transition-colors ${item.link === window.location.pathname ? 'font-semibold' : 'cursor-pointer'}`}
                className="py-3 text-xs tracking-[0.15em] uppercase text-[#6B6153] hover:text-[#B4652F] transition-colors border-b border-[#E3DBC8] last:border-b-0"
              >
                {item.text}
              </span>
            )

          ))}
        </div>
      </nav>
    </header>



    // <header className="fixed top-4 inset-x-0 z-40 px-4">
    //     {/* ---------------- Nav ---------------- */}
    //     <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 rounded-full border border-[#DEDBCF] bg-[#F5F6F1]/80 backdrop-blur-md px-4 py-2 shadow-[0_1px_2px_rgba(28,33,28,0.06)]">
    //       <Link to="/" className="flex items-center gap-2 shrink-0">
    //         <span className="w-8 h-8 rounded-full bg-[#6F8267] text-white flex items-center justify-center font-display text-sm">
    //           AIL
    //         </span>
    //         <span className="hidden sm:inline text-xs tracking-[0.18em] uppercase text-[#656B5E]">
    //           Amos Iyiola Ladipo
    //         </span>
    //       </Link>

    //       <nav className="hidden md:flex items-center gap-1">
    //         {navLinks.map((item) => (
    //           <Link
    //             key={item.text}
    //             to={item.link}
    //             onClick={() => navigate(item.link)}
    //             className="px-3 py-1.5 text-sm text-[#3A3F35] rounded-full hover:bg-[#ECEAE1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6F8267] transition-colors"
    //           >
    //             {item.text}
    //           </Link>
              
    //         ))}
    //       </nav>

    //       <div className="flex items-center gap-2">
    //           <button
    //             onClick={() => navigate('/request-ticket')}
    //             className="w-fit my-2 px-4 py-2 bg-[#B4652F] text-white rounded-lg text-xs tracking-[0.15em] uppercase hover:bg-[#8A7F6A] transition-colors"
    //             className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#B4652F] text-white text-sm px-4 py-1.5 hover:bg-[#3E4B39] transition-colors"
    //           >
    //             Book a ticket
    //           </button> 
    //         <button
    //           onClick={() => setMenuOpen((o) => !o)}
    //           className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ECEAE1]"
    //           aria-label={menuOpen ? "Close menu" : "Open menu"}
    //           aria-expanded={menuOpen}
    //         > hi
    //           <i className={`pi ${menuOpen ? "pi-times" : "pi-bars"}`} />
    //         </button>
    //       </div>
    //     </div>

    //     {menuOpen && (
    //       <div className="md:hidden max-w-3xl mx-auto mt-2 rounded-3xl border border-[#DEDBCF] bg-[#F5F6F1]/95 backdrop-blur-md p-3 shadow-lg">
    //         {navLinks.map((item) => (
    //           <a
    //             key={item.text}
    //             href={item.link}
    //             onClick={() => setMenuOpen(false)}
    //             className="block px-3 py-2.5 text-sm rounded-xl hover:bg-[#ECEAE1]"
    //           >
    //             {item.text}
    //           </a>
    //         ))}
            
    //         <Link
    //           to='/request-ticket'
    //           onClick={() => setMenuOpen(false)}
    //           className="block mt-1 px-3 py-2.5 text-sm rounded-xl bg-[#B4652F] text-white text-center"
    //         >
    //           Book a ticket
    //         </Link>
    //       </div>
    //     )}
    //   </header>

  )
}

