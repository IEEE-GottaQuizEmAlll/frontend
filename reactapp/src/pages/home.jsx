import { React } from 'react'

export default function Home() {
  return (
    <>
      <div className='p-8 bg-[#D8D1CB] font-raleway font-bold'>
        <div className='flex flex-col gap-8 border-4 bg-slate-200 border-gray-500 shadow-xl p-8 rounded-2xl'>
          <div className='flex items-center gap-12 mb-4 h-24 text-2xl'>
            <div className='h-24 w-24 border-4 border-gray-500 rounded-full bg-blue-400'></div>
            <div>USERNAME</div>
          </div>
          <ul className=' flex flex-col gap-4'>
            <li>Quizzez Played: </li>
            <li>Trophies: </li>
            <li>Region: </li>
            <li>Accuracy: </li>
            <li>Rank: </li>
            <li>Email id: </li>

          </ul>

        </div>
        <div className=' mt-12 p-4'>
          Played Quizzez:
        </div>
      </div>
    </>
  )
}


