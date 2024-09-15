'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { company } from '..'

export const CompanyLinks = () => {
  // Get the state from the URL's search params
  const { state } = useParams()

  return (
    <div className="footer-section">
      <h3 className="footer-grid-headings">Company</h3>
      <div className="footer-links">
        {company.map((item) => {
          // Handle FAQ link dynamically
          const link = item.title === 'FAQ' ? `/faq/${state}` : item.link

          return item.link.includes('http') ? (
            // Open external links in a new tab for the 'List Vehicles' link
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-wrapper"
              key={item.id}
            >
              &sdot; <span className="link">{item.title}</span>
            </Link>
          ) : (
            // Handle internal links normally
            <Link href={link} className="link-wrapper" key={item.id}>
              &sdot; <span className="link">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
