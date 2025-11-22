import { CATEGORIES, COUNTRIES, INDIA_STATES, UAE_STATES } from "@/constants";

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
  [UAE_STATES.DUBAI]: {
    title: "Ride.Rent is Getting You the Best Car Rental in Dubai",
    description: [
      "As the fastest-growing car rental agency in Dubai, Ride.Rent offers everything from affordable car rental in Dubai to high-end luxury car rental companies in Dubai. Whether you’re searching for car hire Dubai Marina, rent a car Karama, or even car rental Dubai International Airport, our platform makes it easy to find the perfect ride.",
      "From exclusive Rolls Royce on rent Dubai, Lambo rental Dubai, and convertible car hire Dubai to practical options like minivan rental Dubai, pick up rental Dubai, or rent a van in Dubai, we’ve got something for every traveler. For residents, we also provide rent to own car Dubai and car leasing Dubai long term packages, while visitors can enjoy flexible car hire Dubai no deposit and cheap monthly car hire Dubai deals.",
      "With chauffeur hire in Dubai, car hire with driver in Dubai, and even VIP rent a car Dubai services, we ensure your journey is as comfortable as it is stylish. Whether it’s exclusive car rental Dubai, super cars rent in Dubai, or simply the best car hire Dubai for everyday use, Ride.Rent is your go-to portal.",
    ],
  },
  [UAE_STATES.ABU_DHABI]: {
    title: "Ride.Rent Makes Car Rentals Effortless in Abu Dhabi",
    description: [
      "In Abu Dhabi, mobility means convenience, whether you are arriving at the airport, staying in the city, or commuting daily to Mussafah. Ride.Rent gives you direct access to a wide network of providers offering everything from cheap car rental Abu Dhabi for short stays to monthly car rental Abu Dhabi packages designed for residents and business travelers.",
      "Our platform features reliable partners including auto rent Abu Dhabi, auto rent a car Abu Dhabi, and leading Abu Dhabi airport car rental companies, ensuring you get verified service at fair rates. Travelers who value comfort can choose car hire Abu Dhabi airport on arrival, while residents benefit from flexible car lease Abu Dhabi solutions for longer use.",
      "For those who prefer something premium, Ride.Rent also showcases luxury car rental Abu Dhabi and exotic car rental Abu Dhabi, along with chauffeur-driven services. From rent a car Abu Dhabi Mussafah to car rental UAE Abu Dhabi city, every option is built around transparency, comfort, and choice.",
    ],
  },
  [UAE_STATES.AJMAN]: {
    title: "Ride.Rent Makes Car Rentals Effortless in Ajman",
    description: [
      "In Ajman, people value simplicity, affordability, and easy access to transport. Ride.Rent connects you with the best rent a car in Ajman, offering everything from rent a car Ajman cheap for quick use to monthly rent a car in Ajman plans designed for residents who want consistent savings. Whether you prefer rent a car Ajman per day, need a car rental Ajman monthly, or want the cheapest rent a car in Ajman, Ride.Rent ensures verified service with clear pricing.",
      "For extra convenience, we also feature rent a car in Ajman without deposit and car rental Ajman without deposit options, so you can book without upfront stress. Families can take advantage of larger vehicles like the 7 seater car for rent in Ajman, while professionals can book rent a car in Ajman with driver for a smooth travel experience.",
      "Premium users are not left out. Ride.Rent offers luxury car rental Ajman packages alongside car hire Ajman for everyday needs, making sure every journey, whether in Ajman Rashidiya, Ajman Jurf, or near Lulu is comfortable and reliable. From car rental in Ajman UAE to rent a car Ajman near me, Ride.Rent ensures every option is built around accessibility, affordability, and trust.",
    ],
  },
  [UAE_STATES.AL_AIN]: {
    title: "Ride.Rent Makes Car Rentals Effortless in Al Ain",
    description: [
      "In Al Ain, drivers look for comfort, affordability, and reliable service. Ride.Rent brings together the best rent a car in Al Ain, offering everything from daily car rental Al Ain for short use to monthly car rental Al Ain packages that give residents long-term savings. Whether you are comparing rent a car Al Ain price, searching for the cheapest rent a car in Al Ain, or checking for rent a car Al Ain near me, Ride.Rent ensures trusted options with transparent pricing.",
      "For extra flexibility, our platform also lists cheap rental cars in Al Ain, giving you peace of mind with verified services. Families can choose larger vehicles for group travel, while professionals and frequent travelers can rely on affordable car hire Al Ain plans that match their needs.",
      "Premium renters are also covered with luxury car rental Al Ain options and convenient city locations such as car rental Al Ain Mall, making every booking easy to access. From car rental in Al Ain UAE to Al Ain rent a car services across the city, Ride.Rent ensures every journey is simple, affordable, and dependable.",
    ],
  },
  [UAE_STATES.FUJAIRAH]: {
    title: "Ride.Rent Makes Car Rentals Effortless in Fujairah",
    description: [
      "In Fujairah, travelers and residents value affordable mobility to explore its beaches, mountains, and city life. Ride.Rent connects you directly to the best rent a car in Fujairah, offering everything from cheap car rental in Fujairah for daily commutes to monthly rent a car in Fujairah packages designed for long-term convenience. Whether you’re searching for the cheapest rent a car in Fujairah or looking for a provider with a clear rent a car Fujairah contact number, Ride.Rent ensures transparent pricing and reliable service.",
      "For flexibility, our platform features a wide range of verified providers, making it simple to compare car rental Fujairah options that fit your budget. Families can choose larger vehicles for group outings, while professionals benefit from straightforward car hire Fujairah plans suited to work and travel needs.",
      "Premium customers are equally supported, with trusted partners offering both standard vehicles and executive options. From rent a car in Fujairah for short stays to monthly rent a car in Fujairah for extended stays, Ride.Rent ensures every journey is easy, cost-effective, and dependable.",
    ],
  },
  [UAE_STATES.RAS_AL_KHAIMAH]: {
    title: "Ride.Rent Makes Car Rentals Effortless in Ras Al Khaimah",
    description: [
      "In Ras Al Khaimah, mobility means convenience, whether you are arriving at the airport, staying in the city, or commuting daily to Mussafah. Ride.Rent gives you direct access to a wide network of providers offering everything from cheap car rental Ras Al Khaimah for short stays to monthly car rental Ras Al Khaimah packages designed for residents and business travelers.",
      "Our platform features reliable partners including auto rent Ras Al Khaimah, auto rent a car Ras Al Khaimah, and leading Ras Al Khaimah airport car rental companies, ensuring you get verified service at fair rates. Travelers who value comfort can choose car hire Ras Al Khaimah airport on arrival, while residents benefit from flexible car lease Ras Al Khaimah solutions for longer use.",
      "For those who prefer something premium, Ride.Rent also showcases luxury car rental Ras Al Khaimah and exotic car rental Ras Al Khaimah, along with chauffeur-driven services. From rent a car Ras Al Khaimah Mussafah to car rental UAE Ras Al Khaimah city, every option is built around transparency, comfort, and choice.",
    ],
  },
  [UAE_STATES.SHARJAH]: {
    title: "Ride.Rent Brings You the Best Car Rental in Sharjah",
    description: [
      "As one of the fastest-growing car rental companies in Sharjah, Ride.Rent connects you with trusted providers offering both budget-friendly and premium choices. Whether you're looking to rent a car Sharjah Al Nahda, need a quick rent a car Sharjah per day, or prefer a convenient car rental Sharjah with no deposit option, Ride.Rent makes booking seamless and reliable.",
      "Our platform ensures you get the widest range of vehicles at competitive rates. Need more than just a rental? With rent a car with driver Sharjah and premium car rental Sharjah services, Ride.Rent guarantees comfort, punctuality, and peace of mind.",
      "Whether it's for business, leisure, or everyday use, Ride.Rent is your trusted partner for the cheapest rent a car in Sharjah monthly and beyond.",
    ],
  },
};

// Content for India
const INDIA_CONTENT: IStateDocument = {
  [INDIA_STATES.BANGALORE]: {
    title: "Ride.Rent - The Smarter Way to Travel in Bangalore",
    description: [
      "Ride.Rent brings convenience, flexibility, and affordability together in one platform. Whether you are planning a city tour, attending business meetings, or exploring nearby destinations, our cars are available whenever you need them. With verified suppliers, reliable service, and affordable pricing, Ride.Rent has become the preferred choice for travelers across Bangalore.",
      "Book your car today and enjoy a smooth, stress-free travel experience across the Garden City and beyond.",
    ],
  },
  [INDIA_STATES.CHENNAI]: {
    title: "Ride.Rent - The Smarter Way to Rent a Car in Chennai",
    description: [
      "Ride.Rent combines comfort, flexibility, and affordability in one simple platform. You can rent a car for daily use, weekend outings, or long drives outside Chennai with ease. With trusted suppliers, transparent pricing, and round-the-clock support, Ride.Rent has become the preferred choice for thousands of users in Chennai.",
      "Book your car today and discover how effortless travel can be when everything you need is just a click away.",
    ],
  },
  [INDIA_STATES.DELHI]: {
    title: "Ride.Rent - Redefining the Way Delhi Travels",
    description: [
      "Ride.Rent brings convenience, flexibility, and affordability together in one platform. Whether you are planning a city tour, attending business meetings, or exploring nearby destinations, our cars are available whenever you need them.",
      "Delhi never stands still, and neither do we. Ride.Rent was built to make city travel smoother whether it's daily office runs, airport transfers, or spontaneous weekend escapes. Our platform combines transparency, technology, and trust, giving you control over your travel without the usual stress of rentals. Book your car today and experience a smarter, more reliable way to move across the capital and beyond.",
    ],
  },
  [INDIA_STATES.GURGAON]: {
    title: "Ride.Rent - Redefining the Way Gurgaon Travels",
    description: [
      "Gurgaon is built for ambition, and Ride.Rent matches its pace. Whether you are planning office commutes, airport transfers, or weekend drives, our platform brings reliability and speed together.",
      "We combine technology with trusted partnerships to deliver a smarter travel experience for residents and visitors alike. Book your car today and experience a new level of freedom across Gurgaon and the NCR.",
    ],
  },
  [INDIA_STATES.KOCHI]: {
    title: "Ride.Rent - Redefining the Way Kochi Travels",
    description: [
      "From the lively streets of MG Road to the quiet backwaters of Alappuzha, Ride.Rent connects travelers with seamless mobility solutions. Whether you need an airport transfer, a weekend getaway car, or a daily rental for work, we combine technology and reliability to make every journey effortless.",
      "Book your car today with Ride.Rent and experience a smarter, more comfortable way to explore Kochi and beyond.",
    ],
  },
  [INDIA_STATES.KOLKATA]: {
    title: "Ride.Rent - Redefining the Way Kolkata Travels",
    description: [
      "From the charm of old North Kolkata to the wide roads of Rajarhat, Ride.Rent connects the entire city through reliable car rental services. Whether you need a short-term hire, an airport transfer, or a monthly lease, our platform gives you flexibility and control.",
      "Combining technology, safety, and trusted local suppliers, Ride.Rent ensures every drive is a comfortable experience. Book your car today and explore the City of Joy with confidence and convenience.",
    ],
  },
  [INDIA_STATES.MUMBAI]: {
    title: "Ride.Rent - Redefining the Way Mumbai Travels",
    description: [
      "Mumbai never slows down, and neither do we. Ride.Rent is designed for a city that works, travels, and celebrates around the clock. From airport transfers to weekend drives, from business rentals to long-term car leases, we make movement easier.",
      "Combining advanced booking systems with reliable local operators, Ride.Rent ensures comfort and convenience wherever you go. Book your next car today and enjoy a smarter way to move through the City of Dreams.",
    ],
  },
  [INDIA_STATES.NOIDA]: {
    title: "Ride.Rent - Redefining the Way Noida Travels",
    description: [
      "Noida's pace is fast, dynamic, and evolving and Ride.Rent keeps up with it. From tech parks to entertainment hubs, we make travel seamless across the NCR. Whether it's short city drives, airport transfers, or intercity road trips, our platform gives you full control with easy booking and trusted partners.",
      "Book your next ride today and discover a smarter, safer, and more comfortable way to travel across Noida and its surroundings.",
    ],
  },
  [INDIA_STATES.PUNE]: {
    title: "Ride.Rent - Redefining the Way Pune Travels",
    description: [
      "Pune's lifestyle is fast, connected, and constantly moving and Ride.Rent fits right in. From daily work travel to family holidays and intercity road trips, we make travel simpler and smarter.",
      "Our platform connects trusted partners, real-time booking, and honest pricing so you can enjoy every journey without hassle. Book your next car today and experience a more flexible way to move across Pune and beyond.",
    ],
  },
  [INDIA_STATES.RAJASTHAN]: {
    title: "Ride.Rent - Redefining Travel Across Rajasthan",
    description: [
      "From royal architecture to desert adventures, every corner of Rajasthan tells a story — and Ride.Rent helps you experience it all. We bring technology and local expertise together to simplify car rental for tourists, families, and professionals alike.",
      "Book your car today and enjoy the freedom to explore Rajasthan at your own rhythm, with reliable cars and verified partners by your side.",
    ],
  },
  [INDIA_STATES.TELANGANA]: {
    title: "Ride.Rent - The Smarter Way to Move Across Telangana",
    description: [
      "From Hyderabad's busy streets to the calm highways leading to Warangal or Karimnagar, Ride.Rent makes every journey effortless. Our platform combines trusted car rental partners, simple booking, and real-time support to give you complete freedom on the road.",
      "Plan your next trip with us and enjoy comfort, clarity, and convenience wherever you go.",
    ],
  },
  [INDIA_STATES.AHMEDABAD]: {
    title: "Ride.Rent - The Smarter Way to Travel Across Ahmedabad",
    description: [
      "Ahmedabad is a city that never stops moving, and Ride.Rent makes every journey simpler. From airport pickups to corporate travel, weekend drives, and outstation trips, our platform connects you with the best car rental options at clear, competitive rates.",
      "Whether you need a daily commute vehicle or a long-term car lease, Ride.Rent gives you control, comfort, and complete peace of mind. Book your car today and experience seamless mobility across Ahmedabad and Gujarat.",
    ],
  },
  [INDIA_STATES.PORT_BLAIR]: {
    title: "Ride.Rent – Your Travel Partner Across Port Blair and Andamans",
    description: [
      "From sunrise views at North Bay to evening drives along the coastline, Ride.Rent helps you explore the Andamans your way. Our platform combines reliable cars, verified partners, and real-time booking to make island travel simple.",
      "Whether you need an airport pickup, a sightseeing car, or a private self-drive vehicle, Ride.Rent ensures every trip is smooth and memorable. Book your car today and experience Port Blair like never before.",
    ],
  },
};

// final object which contains all countries and states specific content regarding documents
export const homepageDocumentsContent: IDocument = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;
