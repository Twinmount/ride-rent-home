import { createMarkerCarIcon } from './category-icons/car-marker-icon';

export const createMarkerIcon = ({
  category,
  dark,
}: {
  category: string;
  dark: boolean;
}) => {
  let iconUrl = '';

  switch (category) {
    case 'cars':
      iconUrl = createMarkerCarIcon(dark);
      break;
    case 'sports-car':
      iconUrl = createMarkerCarIcon(dark);
      break;
    case 'yachts':
      iconUrl = createMarkerCarIcon(dark);
      break;
    case 'motorbike':
      iconUrl = createMarkerCarIcon(dark);
      break;
    case 'charters':
      iconUrl = createMarkerCarIcon(dark);
      break;
    default:
      iconUrl = createMarkerCarIcon(dark);
      break;
  }

  return iconUrl;
};
