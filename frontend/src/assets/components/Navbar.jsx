import React from 'react'

function Navbar() {
  return (
    <div className="grid grid-flow-row grid-cols-[300px_auto_350px] h-full ">
          <div className=' p-3 navbar text-white' >
            <h1 className='text-4xl font-bold '>DevConnect</h1>
            <div className='flex items-center justify-center mt-20'>
              <ul className='text-4xl '>
                <li className='m-4 hover:cursor-pointer'>Home</li>
                <li className='m-4 hover:cursor-pointer'>Explore</li>
                <li className='m-4 hover:cursor-pointer'>Notification</li>
                <li className='m-4 hover:cursor-pointer'>More...</li>
              </ul>
            </div>
            <button className='text-4xl text-black font-bold px-15 py-2  mt-12 ml-7 border-2 rounded-4xl hover:cursor-pointer bg-[#1d9bf0]'>Post</button>
          </div>
          <div className='bg-green-400 '></div>
          <div className='bg-red-400  '></div>
        </div>
  )
}

export default Navbar