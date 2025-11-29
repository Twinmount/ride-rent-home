import { Metadata } from 'next';
import SavedVehicles from '@/components/user-actions/saved-vehicles/SavedVehicles';
import { ProfileBreadcrumb } from '@/components/user-profile';

export const metadata: Metadata = {
  title: 'Saved Vehicles | RideRent',
  description: 'View and manage your saved vehicles on RideRent',
};

export default function SavedVehiclesPage({
  params,
}: {
  params: { country: string; state: string };
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <ProfileBreadcrumb
        userName="User"
        currentSection="saved-vehicles"
        className="mt-2"
        country={params.country}
        state={params.state}
      />
      <SavedVehicles />
    </div>
  );
}
