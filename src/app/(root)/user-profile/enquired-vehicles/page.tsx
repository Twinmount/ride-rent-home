import { Metadata } from 'next';
import EnquiredVehicles from '@/components/user-actions/enquired-vehicles/EnquiredVehicles';
import { ProfileBreadcrumb } from '@/components/user-profile';

export const metadata: Metadata = {
  title: 'Enquired Vehicles | RideRent',
  description: 'View and manage your vehicle enquiries on RideRent',
};

export default function EnquiredVehiclesPage({
  params,
}: {
  params: { country: string; state: string };
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <ProfileBreadcrumb
        userName="User"
        currentSection="enquired-vehicles"
        className="mt-2"
        country={params.country}
        state={params.state}
      />
      <EnquiredVehicles />
    </div>
  );
}
