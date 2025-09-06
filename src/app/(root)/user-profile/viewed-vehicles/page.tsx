import { Metadata } from 'next';
import ViewedVehicles from '@/components/user-actions/viewed-vehicles/ViewedVehicles';
import { ProfileBreadcrumb } from '@/components/user-profile';

export const metadata: Metadata = {
  title: 'Recently Viewed Vehicles | RideRent',
  description:
    'View your browsing history and recently viewed vehicles on RideRent',
};

export default function ViewedVehiclesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <ProfileBreadcrumb
        userName="User"
        currentSection="viewed-vehicles"
        className="mt-2"
      />
      <ViewedVehicles />
    </div>
  );
}
