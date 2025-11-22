'use client';

import { useParams } from 'next/navigation';
import { company } from '.'; // Your existing import
import FooterSection from '../FooterSection'; // Adjust path as needed
import FooterLink from '../FooterLink'; // Adjust path as needed

export const CompanyLinks = () => {
  // Get the state from the URL's search params
  const { state, country } = useParams();

  const defaultCountry = country || 'ae';

  const getCompanyLink = (item: any) => {
    if (item.title === 'FAQ') {
      return `/${defaultCountry}/faq/${state ? state : defaultCountry === "in" ? "bangalore" : "dubai"}`;
    }
    if (item.title === 'Our Blogs') {
      return `/${defaultCountry}/blog`;
    }
    if (item.title === 'Careers') {
      return `/${defaultCountry}/careers`;
    }
    if (item.title === 'Interns') {
      return `/${defaultCountry}/interns`;
    }
    return item.link;
  };

  return (
    <FooterSection title="Company">
      {company.map((item) => {
        const link = getCompanyLink(item);
        return (
          <FooterLink
            key={item.id}
            href={country === 'in' && !!item.linkIndia ? item.linkIndia : link}
            isExternal={item.link.includes('http')}
          >
            {item.title}
          </FooterLink>
        );
      })}

      {/* Sitemap link */}
      <FooterLink
        href={defaultCountry === 'in' ? `/in/sitemap` : `/ae/sitemap`}
      >
        Sitemap
      </FooterLink>
    </FooterSection>
  );
};