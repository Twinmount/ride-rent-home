import { notFound } from 'next/navigation';

export type LayoutProps = {
  params: Promise<{ country: string }>;
  children: React.ReactNode;
};

const COUNTRIES = ['ae', 'in'];

/**
 * This layout wraps all pages in the `pages/(root)/[country]` directory.
 * If the country is not valid, it will return a 404 response.
 */
export default async function Layout({ children, params }: LayoutProps) {
  const { country } = await params;

  if (!COUNTRIES.includes(country)) {
    console.warn('country not found');
    notFound();
  }

  return children;
}
