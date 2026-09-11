import React from 'react'
// import Header from '../../frame/Header'
import Footer from '../../frame/Footer'
import Map from '../public/Map';
import ibcc from '../../assets/imgs/ibcc.png'
import ibcc2 from '../../assets/imgs/ibcc2.png'

export default function UserLayout({children}) {
  return (
    <div>
        {/* <Header />  */}
        {children}
        {/* <div className="border py-10 grid lg:grid-cols-2">
          hello
          */}
          <div className="max-w6xl p-5 mt-5 md:pl-[50px] lg:pl-[100px] lg:grid grid-cols-[3fr_9fr] gap-3 max- h[420px]"> 
            <Map className="order-1 lg:order-2" />
            <div className="order-2 lg:order-1 flex flex-col gap-3">
                <img src={ibcc} className='h-[45%] rounded-md' alt="" />
                <img src={ibcc2} className='h-[45%] rounded-md' alt="" />
            </div>
          </div>
          {/* 
        </div> */}
        <Footer />
    </div>
    
  )
}
