import { UserProfile2 } from '@/components/user-profile/UserProfile2';
import { notFound } from 'next/navigation';

export type PageProps = {
  params: Promise<{ country: string; state: string }>;
};

export default async function CountryProfilePage(props: PageProps) {
  const { country, state } = await props.params;
  const countries = ["ae", "in"];

  if (!countries.includes(country)) {
    return notFound();
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <UserProfile2 />
    </div>
  );
}