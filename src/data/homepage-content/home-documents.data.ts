import { CATEGORIES, COUNTRIES, STATES } from '@/constants';

interface IStateDocument {
  [state: string]: {
    title: string;
    description: string[];
  };
}
interface IDocument {
  [country: string]: IStateDocument;
}

// Content for UAE
const UAE_CONTENT: IStateDocument = {
  [STATES.DUBAI]: {
    title: 'Ride.Rent is Getting You the Best Car Rental in Dubai',
    description: [
      'As the fastest-growing car rental agency in Dubai, Ride.Rent offers everything from affordable car rental in Dubai to high-end luxury car rental companies in Dubai. Whether you’re searching for car hire Dubai Marina, rent a car Karama, or even car rental Dubai International Airport, our platform makes it easy to find the perfect ride.',
      'From exclusive Rolls Royce on rent Dubai, Lambo rental Dubai, and convertible car hire Dubai to practical options like minivan rental Dubai, pick up rental Dubai, or rent a van in Dubai, we’ve got something for every traveler. For residents, we also provide rent to own car Dubai and car leasing Dubai long term packages, while visitors can enjoy flexible car hire Dubai no deposit and cheap monthly car hire Dubai deals.',
      'With chauffeur hire in Dubai, car hire with driver in Dubai, and even VIP rent a car Dubai services, we ensure your journey is as comfortable as it is stylish. Whether it’s exclusive car rental Dubai, super cars rent in Dubai, or simply the best car hire Dubai for everyday use, Ride.Rent is your go-to portal.',
    ],
  },
  [STATES.ABU_DHABI]: {
    title: 'Ride.Rent Makes Car Rentals Effortless in Abu Dhabi',
    description: [
      'In Abu Dhabi, mobility means convenience, whether you are arriving at the airport, staying in the city, or commuting daily to Mussafah. Ride.Rent gives you direct access to a wide network of providers offering everything from cheap car rental Abu Dhabi for short stays to monthly car rental Abu Dhabi packages designed for residents and business travelers.',
      'Our platform features reliable partners including auto rent Abu Dhabi, auto rent a car Abu Dhabi, and leading Abu Dhabi airport car rental companies, ensuring you get verified service at fair rates. Travelers who value comfort can choose car hire Abu Dhabi airport on arrival, while residents benefit from flexible car lease Abu Dhabi solutions for longer use.',
      'For those who prefer something premium, Ride.Rent also showcases luxury car rental Abu Dhabi and exotic car rental Abu Dhabi, along with chauffeur-driven services. From rent a car Abu Dhabi Mussafah to car rental UAE Abu Dhabi city, every option is built around transparency, comfort, and choice.',
    ],
  },
  [STATES.AJMAN]: {
    title: 'Ride.Rent Makes Car Rentals Effortless in Ajman',
    description: [
      'In Ajman, people value simplicity, affordability, and easy access to transport. Ride.Rent connects you with the best rent a car in Ajman, offering everything from rent a car Ajman cheap for quick use to monthly rent a car in Ajman plans designed for residents who want consistent savings. Whether you prefer rent a car Ajman per day, need a car rental Ajman monthly, or want the cheapest rent a car in Ajman, Ride.Rent ensures verified service with clear pricing.',
      'For extra convenience, we also feature rent a car in Ajman without deposit and car rental Ajman without deposit options, so you can book without upfront stress. Families can take advantage of larger vehicles like the 7 seater car for rent in Ajman, while professionals can book rent a car in Ajman with driver for a smooth travel experience.',
      'Premium users are not left out. Ride.Rent offers luxury car rental Ajman packages alongside car hire Ajman for everyday needs, making sure every journey, whether in Ajman Rashidiya, Ajman Jurf, or near Lulu is comfortable and reliable. From car rental in Ajman UAE to rent a car Ajman near me, Ride.Rent ensures every option is built around accessibility, affordability, and trust.',
    ],
  },
  [STATES.AL_AIN]: {
    title: 'Ride.Rent Makes Car Rentals Effortless in Al Ain',
    description: [
      'In Al Ain, drivers look for comfort, affordability, and reliable service. Ride.Rent brings together the best rent a car in Al Ain, offering everything from daily car rental Al Ain for short use to monthly car rental Al Ain packages that give residents long-term savings. Whether you are comparing rent a car Al Ain price, searching for the cheapest rent a car in Al Ain, or checking for rent a car Al Ain near me, Ride.Rent ensures trusted options with transparent pricing.',
      'For extra flexibility, our platform also lists cheap rental cars in Al Ain, giving you peace of mind with verified services. Families can choose larger vehicles for group travel, while professionals and frequent travelers can rely on affordable car hire Al Ain plans that match their needs.',
      'Premium renters are also covered with luxury car rental Al Ain options and convenient city locations such as car rental Al Ain Mall, making every booking easy to access. From car rental in Al Ain UAE to Al Ain rent a car services across the city, Ride.Rent ensures every journey is simple, affordable, and dependable.',
    ],
  },
  [STATES.FUJAIRAH]: {
    title: 'Ride.Rent Makes Car Rentals Effortless in Fujairah',
    description: [
      'In Fujairah, travelers and residents value affordable mobility to explore its beaches, mountains, and city life. Ride.Rent connects you directly to the best rent a car in Fujairah, offering everything from cheap car rental in Fujairah for daily commutes to monthly rent a car in Fujairah packages designed for long-term convenience. Whether you’re searching for the cheapest rent a car in Fujairah or looking for a provider with a clear rent a car Fujairah contact number, Ride.Rent ensures transparent pricing and reliable service.',
      'For flexibility, our platform features a wide range of verified providers, making it simple to compare car rental Fujairah options that fit your budget. Families can choose larger vehicles for group outings, while professionals benefit from straightforward car hire Fujairah plans suited to work and travel needs.',
      'Premium customers are equally supported, with trusted partners offering both standard vehicles and executive options. From rent a car in Fujairah for short stays to monthly rent a car in Fujairah for extended stays, Ride.Rent ensures every journey is easy, cost-effective, and dependable.',
    ],
  },
  [STATES.RAS_AL_KHAIMAH]: {
    title: 'Ride.Rent Makes Car Rentals Effortless in Ras Al Khaimah',
    description: [
      'In Ras Al Khaimah, mobility means convenience, whether you are arriving at the airport, staying in the city, or commuting daily to Mussafah. Ride.Rent gives you direct access to a wide network of providers offering everything from cheap car rental Ras Al Khaimah for short stays to monthly car rental Ras Al Khaimah packages designed for residents and business travelers.',
      'Our platform features reliable partners including auto rent Ras Al Khaimah, auto rent a car Ras Al Khaimah, and leading Ras Al Khaimah airport car rental companies, ensuring you get verified service at fair rates. Travelers who value comfort can choose car hire Ras Al Khaimah airport on arrival, while residents benefit from flexible car lease Ras Al Khaimah solutions for longer use.',
      'For those who prefer something premium, Ride.Rent also showcases luxury car rental Ras Al Khaimah and exotic car rental Ras Al Khaimah, along with chauffeur-driven services. From rent a car Ras Al Khaimah Mussafah to car rental UAE Ras Al Khaimah city, every option is built around transparency, comfort, and choice.',
    ],
  },
  [STATES.SHARJAH]: {
    title: 'Ride.Rent Brings You the Best Car Rental in Sharjah',
    description: [
      "As one of the fastest-growing car rental companies in Sharjah, Ride.Rent connects you with trusted providers offering both budget-friendly and premium choices. Whether you're looking to rent a car Sharjah Al Nahda, need a quick rent a car Sharjah per day, or prefer a convenient car rental Sharjah with no deposit option, Ride.Rent makes booking seamless and reliable.",
      'Our platform ensures you get the widest range of vehicles at competitive rates. Need more than just a rental? With rent a car with driver Sharjah and premium car rental Sharjah services, Ride.Rent guarantees comfort, punctuality, and peace of mind.',
      "Whether it's for business, leisure, or everyday use, Ride.Rent is your trusted partner for the cheapest rent a car in Sharjah monthly and beyond.",
    ],
  },
};

// Content for India
const INDIA_CONTENT: IStateDocument = {};

// final object which contains all countries and states specific content regarding documents
export const homepageDocumentsContent: IDocument = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;
