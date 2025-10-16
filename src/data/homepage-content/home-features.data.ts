// src/data/homepageContent.ts
import { COUNTRIES, STATES } from "@/constants";

interface ICard {
  key: number;
  iconNumber: 1 | 2 | 3;
  title: string;
  description: string;
}

interface IState {
  [state: string]: {
    heading: string;
    description: string[];
    cards: ICard[];
  };
}

interface IFeature {
  [country: string]: IState;
}

const dubaiCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Easy & Fast Booking",
    description:
      "Looking for the best car rental in Dubai? With Ride.rent, you can book your ride in just a few clicks. From cheap car rental Dubai to premium luxury car hire Dubai, our platform offers instant booking and transparent rates. Whether it&apos;s a monthly car rental Dubai, a car rental Dubai with driver, or even an exotic car rental Dubai like Lamborghini rental Dubai, Porsche rental Dubai, or rent Ferrari Dubai, we make it quick and hassle-free. Experience seamless car hire Dubai with no hidden fees and flexible packages.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Many Pickup Locations",
    description:
      "Wherever your journey starts, we&apos;ve got you covered. Ride.rent offers Dubai airport car rental services including car rental Dubai airport terminal 1, car hire Dubai airport terminal 3, and car rental DXB for maximum convenience. You can also pick up cars across the city with options like car rental Dubai Marina, rent a car Deira, rent a car Al Barsha, and rent a car Karama. From SUV rental Dubai like Nissan Patrol for rent in Dubai to VIP car rental Dubai such as G Wagon rental Dubai and Range Rover rental Dubai, Ride.rent makes finding the right car easy, anywhere in the city.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Ensured Delivery Promise",
    description:
      "We know reliability matters. Ride.rent guarantees on-time delivery for every booking, from long term car rental Dubai to convertible car rental Dubai or sports car rental Dubai. Whether you need the cheapest rent a car in Dubai without deposit, affordable car rental Dubai, or high-end choices like Bugatti rental Dubai, BMW rental Dubai, and Mercedes rental Dubai, your vehicle will be ready when and where you need it. With car leasing Dubai, monthly rent car in Dubai, and even chauffeur services in Dubai, Ride.rent ensures your trip is stress-free, punctual, and comfortable.",
  },
] as const;

const abuDhabiCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Fast Reservations with Real Value",
    description:
      "With Ride.Rent, there&apos;s no need for endless calls or last-minute negotiations. Our platform allows you to instantly compare cheap car hire Abu Dhabi deals and book within minutes. Whether you&apos;re looking for a rent a car Mussafah, a rent a car Abu Dhabi Mussafah for industrial hub access, or a rent a car in Abu Dhabi city, Ride.Rent ensures the best match for your budget and needs.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Pickups Across Abu Dhabi",
    description:
      "Convenience is key, which is why Ride.Rent provides vehicles across multiple touchpoints. Choose Abu Dhabi airport car rental or car hire Abu Dhabi international airport for smooth travel, or explore local hotspots with rent car Abu Dhabi and car on rent Abu Dhabi services. Even if you simply search Abu Dhabi car rental near me, our platform connects you with affordable and reliable providers.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Service You Can Trust",
    description:
      "From cheap car for rent in Abu Dhabi to high-end luxury car hire Abu Dhabi, every booking through Ride.Rent is supported by top-rated partners. With providers such as National Car Rental Abu Dhabi and well-known car rental companies Abu Dhabi, Ride.Rent ensures on-time delivery, clear pricing, and dependable service. Whether it&apos;s Abu Dhabi rent a car for short trips or monthly car rental Abu Dhabi for extended stays, Ride.Rent makes mobility simple and stress-free.",
  },
] as const;

const ajmanCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Quick Bookings, No Surprises",
    description:
      "Booking through Ride.Rent means no hidden fees. Compare rent a car Ajman cheap offers, explore car hire Ajman options, or lock in a monthly car rental Ajman plan in just a few clicks.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Citywide Coverage",
    description:
      "From car rental in Ajman UAE for visitors to neighborhood-specific rentals like rent a car Ajman Rashidiya and rent a car Ajman Jurf, our platform is designed to bring vehicles closer to you. Simply search rent a car Ajman near me and Ride.Rent delivers results instantly.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Reliable Partners for Every Budget",
    description:
      "Whether it&apos;s best rent a car in Ajman, cheap rental cars Ajman, or premium luxury car hire Ajman, Ride.Rent only works with verified suppliers. Every booking, from short-term daily rentals to monthly rent a car in Ajman is supported with transparent pricing, dependable service, and customer-first support.",
  },
] as const;

const fujairahCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Quick Bookings, No Hidden Costs",
    description:
      "With Ride.Rent, you can instantly compare cheap car rental in Fujairah listings, check rent a car Fujairah prices, and secure your booking in just a few clicks. From daily rentals to monthly car rental Fujairah packages, you&apos;ll always find transparent rates.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Convenience Across Fujairah",
    description:
      "Our platform makes booking simple whether you&apos;re looking for rent a car in Fujairah near me or want the support of trusted partners through a rent a car Fujairah contact number. With multiple providers, finding the right vehicle in Fujairah has never been easier.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Trusted Partners for Every Traveler",
    description:
      "From cheapest rent a car in Fujairah for budget-conscious drivers to premium car hire Fujairah for business or leisure, Ride.Rent connects you with reliable companies. Every rental is backed by verified providers, giving you confidence and peace of mind with every booking.",
  },
] as const;

const sharjahCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Easy & Hassle-Free Reservations",
    description:
      "Finding the best car hire Sharjah no longer requires endless searches. Ride.Rent makes it simple to compare, select, and book within minutes. From rent a car Sharjah per day for short stays to rent a car Sharjah monthly packages for long-term use, our transparent pricing ensures you always know what you&apos;re paying for. Even better, with car rental Sharjah no deposit options, you can skip upfront charges and enjoy instant confirmation.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Convenient Pickup Points Across Sharjah",
    description:
      "Whether you&apos;re landing at Sharjah Airport or staying in the city, Ride.Rent gives you multiple pickup options. Choose car rental Sharjah airport for smooth arrivals, or book at city hotspots like rent a car Sharjah Al Nahda. Searching for rent a car Sharjah near me? Our network spans the city, from Autobahn Car Rental Sharjah to Shift Car Rental Sharjah, making it easy to start your journey anywhere.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Reliable Service, Every Time",
    description:
      "Your time matters, and Ride.Rent ensures every booking is delivered on schedule. From cheap rent a car Sharjah to premium chauffeur-driven vehicles, every rental is backed by reliable partners and clear terms. Looking for long-term options? Our auto lease Sharjah packages and rent a car Sharjah without deposit deals guarantee both affordability and flexibility. With Ride.Rent, expect consistency, punctuality, and a stress-free experience across Sharjah.",
  },
] as const;

const alAinCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Quick Bookings, No Hidden Costs",
    description:
      "Compare deals instantly on Ride.Rent, from rent car Al Ain for daily use to monthly car rental Al Ain for residents. Whether you&apos;re looking for cheap rental cars Al Ain or premium options, our platform ensures transparent prices with no surprises.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Convenience Across Al Ain",
    description:
      "Whether you&apos;re near Al Ain Mall or in another part of the city, Ride.Rent connects you with reliable car rental providers. A quick search for rent a car Al Ain near me gives you instant choices.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Trusted Partners for Every Traveler",
    description:
      "Whether it&apos;s daily car rental Al Ain, monthly rent a car Al Ain, or premium car hire Al Ain, Ride.Rent connects you with the most reliable providers in the market. Every booking, from the cheapest rent a car in Al Ain to family-friendly options, is backed by verified suppliers and clear pricing.",
  },
] as const;

const rasAlKhaimahCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Fast Reservations with Real Value",
    description:
      "With Ride.Rent, there&apos;s no need for last-minute calls or lengthy negotiations. Our platform allows you to instantly compare cheap car hire Ras Al Khaimah deals and book within minutes. Whether you&apos;re searching for a rent a car Al Hamra, rent a car Al Nakheel, or a rent a car Ras Al Khaimah city option, Ride.Rent ensures the best match for your budget and travel needs.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Pickups Across Ras Al Khaimah",
    description:
      "Convenience matters, which is why Ride.Rent provides vehicles across key touchpoints. Choose Ras Al Khaimah airport car rental or car hire Ras Al Khaimah international airport for smooth arrivals, or explore local hotspots with rental car Ras Al Khaimah and car on rent Ras Al Khaimah services. Even if you simply search Ras Al Khaimah car rental near me, our platform connects you with affordable and trusted providers.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Service You Can Trust",
    description:
      "From cheap car for rent in Ras Al Khaimah to luxury car hire in Ras Al Khaimah, every booking through Ride.Rent is supported by top-rated partners. With providers such as National Car Rental Ras Al Khaimah and other leading car rental companies Ras Al Khaimah, Ride.Rent ensures on-time delivery, transparent pricing, and dependable service. Whether you need Ras Al Khaimah rent a car for a short trip or monthly car rental Ras Al Khaimah for extended stays, Ride.Rent makes every booking smooth and stress-free.",
  },
] as const;

const bangaloreCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Travel at Your Own Pace",
    description:
      "Exploring Bangalore becomes more enjoyable when you travel at your own pace. With Ride.Rent, you can plan a quick weekend getaway to Nandi Hills or Coorg, or simply move around the city without depending on cabs. Our platform ensures transparency, comfort, and reliability in every booking. There are no hidden charges, and all our vehicles are regularly inspected and maintained for safety. Whether you are renting from Bangalore Airport, Marathahalli, or Hebbal, your car will always arrive on time, ready for your journey.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Simple Booking Process",
    description:
      "Ride.Rent helps you book a car in just a few clicks. The process is simple; select your location, choose your preferred vehicle, and confirm your booking. From affordable self-drive options to luxury cars with chauffeurs, every traveler can find the right car for their needs. If you are arriving at Kempegowda International Airport or heading for a long drive outside Bangalore, our service ensures comfort and flexibility at all times. We also offer easy monthly leasing plans, long-term rentals for professionals, and family-friendly SUVs for weekend getaways.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Trusted and Reliable Service",
    description:
      "Ride.Rent is one of the most reliable car rental platforms in India, known for verified partners, on-time delivery, and clear pricing. We aim to make every trip comfortable, whether it&apos;s a quick errand within the city or a business meeting across town. Our partners cover all major areas including HSR Layout, Yelahanka, BTM Layout, and Jayanagar. From economy cars to luxury vehicles, our customers can rent without deposits and enjoy complete peace of mind. With 24x7 support, easy cancellations, and flexible payment methods, Ride.Rent continues to make travel in Bangalore convenient for residents and visitors alike.",
  },
] as const;

const UAE_CONTENT: IState = {
  [STATES.DUBAI]: {
    heading: "Enjoy ease and peace of mind when renting a car in Dubai",
    description: [
      "Discover the best of Dubai with our affordable and reliable car rental service. Whether you&apos;re visiting the main locations or exploring hidden gems, our diverse fleet offers the perfect match for your travel needs.",
      "Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it. Choose us for a stress-free experience in Dubai.",
    ],
    cards: dubaiCarFeatureCards,
  },
  [STATES.ABU_DHABI]: {
    heading: "Your Reliable Choice for Car Rentals in Abu Dhabi",
    description: [
      "Abu Dhabi is a city of business, culture, and leisure, and having the right vehicle ensures you can experience it all with ease. With Ride.Rent, you can access everything from cheap car rental Abu Dhabi for everyday use to luxury car rental Abu Dhabi and exotic car rental Abu Dhabi for special occasions.",
      "Our platform connects you with established car rental companies in Abu Dhabi, including trusted names like auto rent Abu Dhabi, auto rent a car Abu Dhabi, and major Abu Dhabi airport car rental companies. From daily rentals to car lease Abu Dhabi solutions, we ensure residents and visitors always find affordable mobility choices.",
      "For business professionals and families, we also feature rent a car with driver Abu Dhabi options along with premium executive services such as Abu Dhabi rent a car luxury and rent car Abu Dhabi luxury packages.",
    ],
    cards: abuDhabiCarFeatureCards,
  },
  [STATES.AJMAN]: {
    heading: "Your Reliable Choice for Car Rentals in Ajman",
    description: [
      "Ajman is a growing hub for families, professionals, and budget-conscious travelers, and having the right vehicle makes getting around the city seamless. With Ride.Rent, you can explore everything from rent a car in Ajman cheap for daily needs to luxury car rental Ajman for special occasions.",
      "Our platform connects you with trusted names such as Budget Rent a Car Ajman, Al Asad Rent a Car Ajman, Al Tameem Rent a Car Ajman, and other leading Ajman rent a car companies. Whether you are looking for the cheapest rent a car in Ajman, a 7 seater car for rent in Ajman, or a quick booking through rent a car Ajman Dubizzle, Ride.Rent ensures you find a vehicle that matches your budget and lifestyle.",
      "For those who prefer comfort over self-driving, Ride.Rent also lists rent a car in Ajman with driver services, ideal for families, tourists, or professionals who want convenience without the hassle of navigating.",
    ],
    cards: ajmanCarFeatureCards,
  },
  [STATES.FUJAIRAH]: {
    heading: "Your Reliable Choice for Car Rentals in Fujairah",
    description: [
      "Fujairah is known for its scenic drives, coastal views, and calm lifestyle — and Ride.Rent makes it easier to explore with the right vehicle. From cheap car rental in Fujairah for everyday use to monthly rent a car in Fujairah for long-term needs, our platform ensures affordable prices and flexible plans.",
      "Our network includes trusted providers offering verified car rental Fujairah and rent a car Fujairah services across the city, making it simple to book with confidence. From short-term rentals to monthly rent a car in Fujairah, Ride.Rent ensures clear pricing and dependable service.",
    ],
    cards: fujairahCarFeatureCards,
  },
  [STATES.SHARJAH]: {
    heading: "Seamless Car Rental Experience in Sharjah",
    description: [
      "Navigating Sharjah is easier when you choose Ride.Rent, the leading platform for renting a car in Sharjah. Whether you&apos;re a resident seeking the cheapest rent a car in Sharjah monthly, a business traveler booking at car rental Sharjah airport, or a tourist searching for rent a car in Sharjah cheap price, Ride.Rent ensures the perfect match for your needs.",
      "Whether you need rent a car without deposit Sharjah, a luxury SUV for family trips, or even rent a car with driver Sharjah, our goal is to provide convenience, affordability, and peace of mind every step of the way.",
    ],
    cards: sharjahCarFeatureCards,
  },
  [STATES.AL_AIN]: {
    heading: "Your Reliable Choice for Car Rentals in Al Ain",
    description: [
      "Al Ain offers a perfect balance of comfort and culture, and Ride.Rent makes it easy to explore the city with the right vehicle. From daily car rental Al Ain for short trips to monthly car rental Al Ain for long-term use, our platform delivers transparent pricing and flexible options. Whether you are searching for the cheapest rent a car in Al Ain, comparing rent a car Al Ain price, or looking for trusted names like Budget Rent a Car Al Ain, Ride.Rent ensures affordability and convenience every time.",
      "Our network includes reliable vehicle rental providers and other popular Al Ain rent a car companies, ensuring you always get verified service. From city options like car rental Al Ain Mall to convenient searches like rent a car Al Ain near me, Ride.Rent helps you book with confidence.",
      "For professionals, families, and visitors, we also list cheap rental cars Al Ain, car hire Al Ain, and flexible packages under rent a car in Al Ain UAE, making it easy to find a vehicle that fits every budget and purpose.",
    ],
    cards: alAinCarFeatureCards,
  },
  [STATES.RAS_AL_KHAIMAH]: {
    heading: "Your Reliable Choice for Car Rentals in Ras Al Khaimah",
    description: [
      "Ras Al Khaimah is a destination of adventure, leisure, and heritage, and the right vehicle ensures you can explore it all with ease. With Ride.Rent, you can access everything from cheap car rental Ras Al Khaimah for everyday use to luxury car rental Ras Al Khaimah and exotic car rental Ras Al Khaimah for special occasions. Whether you need a quick car hire Ras Al Khaimah airport option for smooth arrivals or a flexible monthly car rental Ras Al Khaimah plan for long stays, Ride.Rent delivers clear pricing without hidden fees.",
      "Our platform connects you with established car rental companies in Ras Al Khaimah, including trusted names like auto rent Ras Al Khaimah, auto rent a car Ras Al Khaimah, and leading Ras Al Khaimah airport car rental providers. From daily rentals to car lease Ras Al Khaimah solutions, we make sure both residents and visitors always find affordable and reliable mobility choices.",
      "For families, business travelers, and tourists, we also feature rent a car with driver Ras Al Khaimah options along with premium executive services such as Ras Al Khaimah rent a car luxury and rent car Ras Al Khaimah luxury packages.",
    ],
    cards: rasAlKhaimahCarFeatureCards,
  },
};

const INDIA_CONTENT: IState = {
  [STATES.BANGALORE]: {
    heading: "Enjoy ease and peace of mind when renting a car in Bangalore",
    description: [
      "Discover the best of Bangalore with our affordable and reliable car rental service. Whether you are visiting IT hubs, planning weekend getaways to Nandi Hills or Coorg, or exploring the Garden City, our diverse fleet offers the perfect match for your travel needs.",
      "Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it. From Kempegowda International Airport to HSR Layout, Marathahalli, or Hebbal, choose us for a stress-free experience in Bangalore.",
    ],
    cards: bangaloreCarFeatureCards,
  },
};

export const homepageFeaturesContent: IFeature = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;
