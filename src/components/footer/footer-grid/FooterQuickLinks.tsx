'use client';

import { LinkType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fetchQuickLinksByValue } from '@/lib/api/general-api';
import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import FooterSection from '../FooterSection'; // Adjust path as needed
import FooterLink from '../FooterLink'; // Adjust path as needed

export default function FooterQuickLinks() {
  const { state, country } = useStateAndCategory();

  const { data, isLoading } = useQuery({
    queryKey: ['quick-links', state],
    queryFn: () => fetchQuickLinksByValue(state as string, country as string),
    enabled: !!state,
    staleTime: 15 * 60 * 1000, //15 minutes
  });

  const linksData: LinkType[] = data?.result?.list || [];

  return (
    <FooterSection title="Quick Links" isLoading={isLoading}>
      {linksData.length > 0 ? (
        linksData.map((link) => (
          <FooterLink key={link.linkId} href={link.link} isExternal={true}>
            {link.label}
          </FooterLink>
        ))
      ) : (
        <div className="text-gray-400">No Links available</div>
      )}
    </FooterSection>
  );
}