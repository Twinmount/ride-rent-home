'use client'

import { useSearchParams } from 'next/navigation'
import { LinkType } from '@/types'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { fetchQuickLinksByValue } from '@/lib/next-api/next-api'

export default function FooterQuickLinks() {
  const searchParams = useSearchParams()

  const state = searchParams.get('state') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['quick-links', state],
    queryFn: () => fetchQuickLinksByValue(state),
    enabled: !!state,
    staleTime: 0,
  })

  const linksData: LinkType[] = data?.result?.list || []

  return (
    <div className="footer-section">
      {/* locations  link */}
      <h3 className="footer-grid-headings">Quick Links</h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="footer-links">
          {linksData.length > 0 ? (
            linksData.map((link) => (
              <Link
                href={`/${link.link}`}
                className="link-wrapper"
                key={link.linkId}
              >
                &sdot; <span className="link">{link.label}</span>
              </Link>
            ))
          ) : (
            <div>No Links available</div>
          )}
        </div>
      )}
    </div>
  )
}
