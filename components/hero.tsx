import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
    return (
        <div className='relative h-screen overflow-hidden'>
            <div className="absolute inset-0">
                <Image src="/hero.jpg" alt="hero" fill className='object-cover w-full h-full' />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="relative flex flex-col justify-center items-center h-full text-center">
                <h1 className='text-7xl font-extrabold leading-tight mb-3 capitalize text-white'>Book your luxury room</h1>
                <p className='text-xl text-gray-300 mb-8'>Get Special offer just for you today</p>
                <div className="flex gap-5">
                    <Link href="/room" className='bg-orange-400 text-white hover:bg-orange-500 py2.5 px-6 md:px-10 text-lg font-semibold hover:scale-105
                hover:shadow-lg'>Book Now</Link>
                    <Link href="/contact" className='bg-transparent border border-orange-400 text-white hover:bg-orange-500 py2.5 px-6 md:px-10 text-lg font-semibold hover:scale-105
                hover:shadow-lg'>Contact Us</Link>
                </div>
            </div>
        </div>
    )
}

export default Hero