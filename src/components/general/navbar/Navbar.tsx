'use client'

import styles from './Navbar.module.scss'

import { GiHamburgerMenu } from 'react-icons/gi'
import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import Link from 'next/link'
import Image from 'next/image'
import StatesDropdown from '../navbar-dropdown/StatesDropdown'
import QuickLinksDropdown from '../navbar-dropdown/QuickLinksDropdown'
import CategoryDropdown from '../navbar-dropdown/CategoryDropdown'

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(false)
    }

    if (typeof window !== 'undefined')
      window.addEventListener('resize', handleResize)

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return (
    <header className={`${styles.header} padding main-wrapper`}>
      <nav className={styles['nav-container']}>
        <div className={styles['nav-left']}>
          <div className={styles['logo-container']}>
            <Link href={'/'} className={styles['header-logo']}>
              <figure>
                <Image
                  src="/assets/logo/riderent-logo.webp"
                  alt="ride.rent logo"
                  width={130}
                  height={25}
                  className={styles['logo-img']}
                  quality={100}
                />
                <figcaption>
                  Quick way to get a <span>Ride On Rent</span>
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>
        <div className={styles['nav-items-container']}>
          <ul>
            {/* location */}
            <li className={styles.locations}>
              <StatesDropdown />
            </li>

            <li className={styles.vehicles}>
              <CategoryDropdown />
            </li>

            <li className={styles.links}>
              <QuickLinksDropdown />
            </li>

            <li className={styles['list-btn']}>
              <Link
                href={`${process.env.NEXT_PUBLIC_AGENT_REGISTER_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`yellow-gradient default-btn`}
              >
                List your vehicle for FREE
              </Link>
            </li>
          </ul>

          {/* hamburger */}
          <button
            aria-label="Hamburger"
            className={styles['hamburger-btn']}
            onClick={toggleSidebar}
          >
            <GiHamburgerMenu className={`${styles['hamburger-icon']}`} />
          </button>
        </div>

        {/* sidebar */}
        {isSidebarOpen && (
          <div
            className={`${styles['black-overlay']} ${
              isSidebarOpen ? styles['black-overlay-visible'] : ''
            }`}
            onClick={toggleSidebar}
          />
        )}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </nav>
    </header>
  )
}

export default Navbar
