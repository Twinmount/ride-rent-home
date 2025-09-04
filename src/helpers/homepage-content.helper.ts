import { homepageHeadingContent } from '@/data/homepage-content/home-heading.data';
import { convertToLabel, singularizeValue } from '.';
import { homepageFeaturesContent } from '@/data/homepage-content/home-features.data';
import { IoIosSpeedometer } from 'react-icons/io';
import { FaCrown } from 'react-icons/fa6';
import { IoShieldCheckmark } from 'react-icons/io5';
import { Bus } from 'lucide-react';
import { homepageDocumentsContent } from '@/data/homepage-content/home-documents.data';

type LocationCategoryParams = {
  country: string;
  state: string;
  category: string;
};

type HomeHeading = typeof homepageHeadingContent;

/**
 * Returns the title and subtitle to be used on the homepage based on the country, state and category.
 * If a custom title and subtitle are defined in `homepageHeadingContent` for the given country, state and category,
 * those values are used. Otherwise, a default title and subtitle are used.
 */
export function getHomePageHeading({
  country,
  state,
  category,
}: LocationCategoryParams) {
  const custom = homepageHeadingContent?.[country]?.[state]?.[category];

  // If a custom title and subtitle are defined, return
  if (custom) return { title: custom.title, subtitle: custom.subtitle };

  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));

  // return fallback title and subtitle for rest of the states/categories
  return {
    title: `Rent a ${formattedCategory} in ${formattedState}`,
    subtitle:
      'Explore 1000+ options & pick your favorite, from the Toyota Yaris to the Ferrari 296 GTB.',
  };
}

type HomeFeaturesContent = typeof homepageFeaturesContent;

export function getHomePageFeatures({
  country,
  state,
  category,
}: LocationCategoryParams) {
  // Check if there is a custom content for the given country, state, and category
  const custom = (homepageFeaturesContent as HomeFeaturesContent)?.[country]?.[
    state
  ];

  if (custom) return custom;

  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));

  // fallback
  return {
    heading: `Enjoy ease and peace of mind when renting a ${formattedCategory.toLowerCase()} in ${formattedState}`,
    description: [
      `Discover the best of ${formattedState} with our affordable and reliable ${formattedCategory.toLowerCase()} rental service.`,
      `Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it.`,
    ],
    cards: [
      {
        key: 1,
        icon: IoIosSpeedometer,
        title: 'Easy & Fast Booking',
        description: `From premium models to economy vehicles to rent in ${state}, find the perfect car at competitive rates. Secure your rental with just a few clicks and make the most of your ${state} trip. RIDE.RENT is the smart choice for 'Rent a Car in ${state}' services.`,
      },
      {
        key: 2,
        icon: FaCrown,
        title: 'Many Pickup Locations',
        description: `From premium models to economy vehicles to rent in ${state}, find the perfect car at competitive rates. Secure your rental with just a few clicks and make the most of your ${state} trip. RIDE.RENT is the smart choice for 'Rent a Car in ${state}' services.`,
      },
      {
        key: 3,
        icon: Bus,
        title: 'Ensured Delivery Promise',
        description: `Our commitment to punctuality means your chosen vehicle from our extensive 'Rent a Car in ${state}' collection is delivered when and where you need it. Seamless booking, transparent rates, and steadfast service, that's the RIDE.RENT promise.`,
      },
    ],
  };
}

type DocumentsContent = typeof homepageDocumentsContent;

export function getHomePageDocuments({
  country,
  state,
  category,
}: LocationCategoryParams) {
  const custom = (homepageDocumentsContent as DocumentsContent)?.[country]?.[
    state
  ];

  if (custom) {
    return {
      title: custom.title,
      description: custom.description,
    };
  }

  // fallback
  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));

  return {
    title: `Ride.Rent is getting you the best ${formattedCategory} for rental in ${formattedState}`,
    description: [
      `As the fastest-growing vehicle rental portal, we offer a wide range of ${formattedCategory}s in ${formattedState}, from economy to premium options.`,
      `Our services cover key regions including Dubai, Abu Dhabi, Sharjah, and more.`,
      `Choose Ride.Rent for reliable service and unbeatable options.`,
    ],
  };
}
