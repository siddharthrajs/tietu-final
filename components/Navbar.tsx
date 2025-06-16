import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center w-[60%] mx-auto py-4 px-6 my-10 border rounded-full backdrop-blur-lg'>
      <div>
        <Link href="/">
          <span className='font-bold text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>tietU</span>
        </Link>
      </div>
      <div>
        <ul className='flex gap-4'>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <div className='flex gap-4'>
        <Link href="/auth/login"><Button variant={'outline'}>Log In</Button></Link>
        <Link href="/auth/sign-up"><Button>Sign Up</Button></Link>
      </div>
    </nav>
  )
}

export default Navbar
