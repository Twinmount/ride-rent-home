// --- MOCK TYPES ---
export type ProfileData = {
  name: string;
  avatar?: string;
  joinedAt: string;
  countryCode?: string;
  phoneNumber?: string;
  email?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
};

export type StatItem = {
  label: string;
  value: number;
  description?: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  textColor: string;
  navigationPath: string;
};

export type RecentActivityItem = {
  carId: string;
  action: string;
  time: string;
  vehicleName: string;
  vehicleImageUrl: string;
  type: "view" | "save" | "message";
};

export type ProfileLayoutProps = {
  className?: string;
  children: React.ReactNode;
};

// --- MOCK UTILITIES (Passed as props) ---
// const trimName = (name: string, maxLength?: number) => string;
// const formatMemberSince = (date: string) => string;
// const formatTime = (seconds: number) => string;
// const getVehicleImageUrl = (url: string) => string;
