import FancyNumberSVG from './icons/FancyNumberSVG';
import HourlyRentalSVG from './icons/HourlyRentalSVG';
import ZeroDepositSVG from './icons/ZeroDepositSVG';

export enum BadgeId {
  ZeroDeposit = 'zero-deposit',
  FancyNumber = 'fancy-number',
  HourlyRental = 'hourly-rental',
}

export type VehicleBadgeConfig = {
  id: BadgeId;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export const vehicleBadgesConfig: VehicleBadgeConfig[] = [
  {
    id: BadgeId.ZeroDeposit,
    icon: ZeroDepositSVG,
    title: 'Zero Deposit',
    description:
      'Get the vehicle on rent with zero deposit. Pay only for what you use, no hidden charges. Connect with the  supplier for instant booking.',
  },
  {
    id: BadgeId.FancyNumber,
    icon: FancyNumberSVG,
    title: 'Fancy Number',
    description:
      'Get a fancy number for your vehicle. Connect with the supplier for instant booking.',
  },
  {
    id: BadgeId.HourlyRental,
    icon: HourlyRentalSVG,
    title: 'Hourly Rental',
    description:
      'Get full flexibility with hourly booking options, perfect for quick plans or short trips. Hourly listings are limited and get booked fast, connect with the supplier and confirm your booking in just  a few clicks.',
  },
];
