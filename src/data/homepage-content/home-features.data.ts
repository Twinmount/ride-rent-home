// src/data/homepageContent.ts
import { COUNTRIES, INDIA_STATES, UAE_STATES } from "@/constants";

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

const delhiCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Effortless Booking, Every Time",
    description:
      "Renting a car in Delhi has never been easier. With Ride.Rent, you can browse vehicles, compare prices, and confirm your booking in just a few minutes. Whether you prefer a self-drive car for complete independence or a chauffeur-driven vehicle for meetings and events, we&apos;ve got you covered. Business travelers often choose our long-term rentals to move across Gurgaon and Noida, while tourists enjoy our short-term plans for sightseeing across Old and New Delhi. Whatever your reason, our goal is to make every ride comfortable, affordable, and on time.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Designed for Comfort and Confidence",
    description:
      "At Ride.Rent, every booking is backed by verified partners, real-time updates, and dedicated support that keeps you informed from start to finish. Whether you&apos;re traveling across Delhi for work, planning a weekend escape, or welcoming guests from out of town, our system ensures smooth coordination and reliable service. From instant confirmations to doorstep delivery, we make sure every journey feels comfortable, connected, and completely stress-free.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Trusted by Thousands Across Delhi NCR",
    description:
      "Ride.Rent is a community of reliable vehicle rental partners, trusted by thousands of customers across India. In Delhi, our network covers every major area, from Saket to Lajpat Nagar and Vasant Kunj to Pitampura. We focus on verified suppliers, clean vehicles, and fair rental terms. Our easy cancellation policy, pay at supplier plans, flexible payments, and zero-deposit options make it simple for everyone to rent confidently. With 24x7 support, you&apos;re never alone on the road.",
  },
] as const;

const gurgaonCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Explore Gurgaon at Your Own Pace",
    description:
      "Gurgaon is a city of endless movement, and Ride.Rent gives you the freedom to explore it your way. Glide through Cyber City, unwind by Damdama Lake, or plan a scenic drive along Golf Course Road. Each car listed on our platform is inspected for safety and comfort before delivery. You can request pickups from your home, office, or Delhi Airport. Every booking includes punctual delivery, transparent pricing, and round-the-clock assistance so that your journey stays worry-free.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking your car is quick and straightforward. Browse available vehicles, pick what suits your travel, and confirm instantly. Professionals often rely on Ride.Rent for monthly car rentals to commute across Udyog Vihar, while families prefer weekend bookings for short getaways. Whether you choose self-drive or chauffeur service, our system ensures your ride arrives on time and in perfect condition.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Designed for Comfort and Reliability",
    description:
      "At Ride.Rent, every detail is handled with precision. Each booking is supported by verified suppliers, real-time updates, and reliable coordination. Whether it&apos;s a client meeting in Sector 29 or an early-morning airport pickup, our focus is on comfort and consistency. From digital confirmations to doorstep delivery, Ride.Rent makes your travel simple and stress-free.",
  },
] as const;

const kochiCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Discover Kochi at Your Own Pace",
    description:
      "Kochi blends coastal charm with modern convenience, and the best way to experience it is with the comfort of your own car. With Ride.Rent, you can drive through the scenic Marine Drive, visit Fort Kochi, or explore destinations like Munnar, Alleppey, or Thekkady on your schedule. Each car on our platform is safety checked, sanitized, and ready for your trip. Pickup and drop services are available from your doorstep, Kochi International Airport, or any convenient city location. We ensure on-time delivery, clear communication, and support throughout your journey so you can focus on enjoying the drive.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking a car in Kochi through Ride.Rent is as easy as planning your destination. Select your preferred vehicle, set your travel dates, and confirm instantly. Whether you want a compact car for short city drives, an SUV for a family trip, or a luxury car with a driver for business use, our options fit every traveler. Residents often use our long-term car rental plans for daily commutes, while tourists enjoy our self-drive cars for exploring Kerala&apos;s scenic routes. Each booking is backed by our commitment to comfort and reliability.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Designed for Comfort and Convenience",
    description:
      "At Ride.Rent, every car rental experience in Kochi is crafted with attention to detail. Our platform connects you with reliable suppliers who offer clean, well-maintained vehicles supported by real-time updates and professional assistance. Whether you are traveling for work, exploring nearby beaches, or visiting family across Kerala, we make sure your trip is smooth, organized, and stress-free. From doorstep delivery to quick support, everything is designed for your peace of mind.",
  },
] as const;

const kolkataCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Explore the City of Joy Your Way",
    description:
      "Kolkata is a city that thrives on stories and streets full of life, and Ride.Rent helps you experience it all at your own pace. Cruise along the Howrah Bridge, visit the Victoria Memorial, or take a weekend drive to Digha or Shantiniketan. Each car listed on our platform is regularly serviced and sanitized to ensure safety and comfort. We offer doorstep pickup, delivery at Netaji Subhas Chandra Bose International Airport, and flexible drop locations across the city. With transparent pricing and active customer support, your journey stays smooth from start to finish.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking your ride in Kolkata takes just a few minutes. Browse available cars, compare rates, and confirm instantly. Professionals use our monthly rental options for daily travel between Salt Lake and New Town, while families often choose weekend plans for trips to Diamond Harbour or Mandarmani. Whether you want a self-drive vehicle or a car with a driver, Ride.Rent ensures reliability, punctual delivery, and total comfort for every traveler.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Designed for Safety and Convenience",
    description:
      "Every Ride.Rent booking in Kolkata is managed with care and precision. We work only with verified suppliers who maintain their vehicles to high standards. From instant confirmation to GPS tracking and live updates, our system keeps you informed and secure throughout your trip. Whether you&apos;re attending meetings in Park Street, visiting relatives in Tollygunge, or exploring South Kolkata, we make sure your experience remains effortless and dependable.",
  },
] as const;

const mumbaiCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Explore Mumbai at Your Own Pace",
    description:
      "Mumbai moves fast, and Ride.Rent helps you keep up effortlessly. Drive from the bustling streets of Bandra to the calm lanes of Colaba or take a peaceful trip to Lonavala for the weekend. Each vehicle on our platform is inspected, cleaned, and insured before delivery. You can schedule car pickup and drop anywhere across the city, including Mumbai Airport, Andheri, or Powai. With real-time support and upfront pricing, your journey remains smooth, whether you are exploring, commuting, or simply enjoying the drive.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking a car in Mumbai through Ride.Rent takes only a few minutes. Browse, compare, and confirm — all online. Professionals often choose our monthly car rental plans for their daily commute across the city, while families prefer short-term rentals for travel and events. Whether you need a compact hatchback for narrow city lanes, a premium sedan for meetings, or an SUV for long trips, Ride.Rent delivers on time, every time.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Designed for Comfort and Reliability",
    description:
      "Ride.Rent brings together verified partners, reliable cars, and round-the-clock support to make your journey stress-free. From quick weekend trips to corporate travel, every booking is managed with attention to detail. Whether you are attending meetings in BKC, visiting Marine Drive, or catching a flight from Chhatrapati Shivaji Maharaj International Airport, we ensure everything works seamlessly. Instant confirmations, easy extensions, and doorstep delivery make renting a car in Mumbai effortless.",
  },
] as const;

const noidaCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Explore Noida with Ease",
    description:
      "Noida offers modern infrastructure and seamless connectivity, and Ride.Rent gives you the freedom to explore it on your terms. Visit the bustling malls, head to work in IT hubs, or drive to nearby Delhi and Ghaziabad with complete comfort. Each car on our platform is inspected for safety and liability. You can book pickups from home, office, or Delhi Airport. With transparent pricing, verified suppliers, and 24x7 support, we make car rentals in Noida smooth and stress-free.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking a car with Ride.Rent takes only a few clicks. Choose your location, select your vehicle, and confirm instantly. Our customers in Noida often choose self-drive cars for short city drives or long-term plans for daily office commutes. For corporate travel and special occasions, chauffeur-driven options are available too. Each ride is delivered on time and backed by dedicated assistance to make your journey comfortable and convenient.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Designed for Comfort and Reliability",
    description:
      "Every Ride.Rent booking in Noida is backed by verified partners, real-time coordination, and consistent quality. Whether you&apos;re attending meetings in Sector 62, shopping in GIP Mall, or heading for a client visit in Delhi, we ensure timely delivery and reliable service. From doorstep delivery to live updates, every step is managed carefully to give you a smooth travel experience.",
  },
] as const;

const puneCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Explore Pune on Your Terms",
    description:
      "Pune is a city of balanced calm mornings, vibrant evenings, and short drives that lead to hills and beaches. With Ride.Rent, you can explore every corner effortlessly. Drive to Lavasa or Lonavala for the weekend, take a business trip to Hinjewadi or Kharadi, or visit Shaniwarwada and the local cafés in Koregaon Park. Our cars are safety-checked and ready for use, with easy pickups from Pune Airport, Railway Station, or your doorstep. We ensure punctual delivery, simple booking, and 24x7 support to keep your journey smooth.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking a car in Pune takes only a few minutes with Ride.Rent. Select your preferred model, set the dates, and confirm instantly. Residents often use our self-drive cars for work and errands, while travelers prefer our chauffeur-driven options for longer routes. Whether it&apos;s a short city ride or a weekend getaway, we make sure your car arrives on time and in perfect condition.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Comfort and Reliability in Every Ride",
    description:
      "At Ride.Rent, every trip is designed around comfort and trust. We work with verified suppliers who maintain their cars to the highest standards. Whether you are attending meetings in Baner, visiting friends in Kalyani Nagar, or exploring nearby hill stations, you can count on us for timely service, clean vehicles, and full assistance whenever needed.",
  },
] as const;

const rajasthanCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Discover the Royal State at Your Own Pace",
    description:
      "Rajasthan&apos;s charm lies in its heritage and vast landscapes, and the best way to experience it is by road. With Ride.Rent, you can explore the palaces of Jaipur, the lakes of Udaipur, or the sand dunes of Jaisalmer with complete comfort. Our verified suppliers maintain every car to top standards and ensure timely delivery. You can pick up your vehicle from any major city, railway station, or Jaipur International Airport. Whether it&apos;s a family vacation, a honeymoon trip, or a solo adventure, we make your travel safe and enjoyable.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking your ride in Rajasthan takes only a few minutes. Select your city, pick your vehicle, and confirm your booking online. From compact hatchbacks to luxury sedans and off-road SUVs, our fleet suits every type of traveler. Tourists love our chauffeur-driven options for long routes, while residents often choose self-drive cars for daily convenience. Every booking is tracked, supported, and guaranteed to arrive on time.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Comfort and Assurance in Every Journey",
    description:
      "At Ride.Rent, we understand that exploring Rajasthan means covering long, scenic routes with comfort matters. Each booking is supported by verified rental partners, clean cars, and responsive customer assistance. Whether you are driving through the Aravalli Hills or heading toward Mount Abu, our system ensures smooth travel, fair billing, and zero stress.",
  },
] as const;

const telanganaCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Explore Telangana at Your Own Pace",
    description:
      "Telangana offers a blend of modern city life and scenic landscapes, and Ride.Rent lets you experience both effortlessly. Drive through the vibrant roads of Hyderabad, visit Charminar and Golconda Fort, or take a peaceful weekend trip to Nagarjuna Sagar or Warangal. Every car on our platform is well-maintained, sanitized, and safety-checked before delivery. You can book pickups from Rajiv Gandhi International Airport, Secunderabad, or your nearest location. Our support team ensures timely service, clear communication, and assistance at every step of your trip.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking your car in Telangana with Ride.Rent is fast and straightforward. Choose your city, select your vehicle, and confirm instantly online. Many professionals use our monthly rental plans for daily commutes across HITEC City and Gachibowli, while travelers prefer self-drive cars for weekend road trips. Whether you want a compact car, a luxury sedan, or an SUV for a family vacation, we ensure your ride is ready on time and in perfect condition.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Comfort and Convenience You Can Count On",
    description:
      "Every Ride.Rent booking in Telangana is backed by verified partners, clean vehicles, and a commitment to reliability. Whether you&apos;re attending meetings in Banjara Hills, visiting family in Nizamabad, or heading for a scenic drive to Suryapet, we make sure your journey is smooth and secure. With real-time updates, doorstep delivery, and flexible return options, Ride.Rent makes traveling across Telangana comfortable and stress-free.",
  },
] as const;

const ahmedabadCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Explore Ahmedabad at Your Own Pace",
    description:
      "Ahmedabad offers a unique mix of culture, commerce, and comfort — and Ride.Rent lets you experience it all without limits. Take a peaceful drive along the Sabarmati Riverfront, visit the historic Adalaj Stepwell, or plan a trip to Gir National Park or Dwarka. Our cars are fully serviced, sanitized, and ready to drive. You can pick up your rental from Sardar Vallabhbhai Patel International Airport, the city center, or any nearby location. With verified partners and transparent pricing, every trip with Ride.Rent stays comfortable and reliable.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking a car in Ahmedabad is simple with Ride.Rent. Select your car, confirm your schedule, and you&apos;re ready to go. Many professionals prefer our monthly rental plans for regular travel, while families and tourists choose short-term hires for weekend plans. Whether it&apos;s a hatchback for local errands, an SUV for group travel, or a luxury car for business meetings, we ensure timely delivery and seamless service.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Comfort and Reliability for Every Journey",
    description:
      "Every Ride.Rent booking in Ahmedabad is managed with precision and care. From real-time updates to dependable service, we make sure your experience stays smooth. Whether you&apos;re attending meetings in Prahlad Nagar, exploring Manek Chowk, or driving to the Statue of Unity, our team ensures safe cars, easy coordination, and responsive support.",
  },
] as const;

const portBlairCarFeatureCards: ICard[] = [
  {
    key: 1,
    iconNumber: 1,
    title: "Freedom to Discover Port Blair and the Andaman Islands",
    description:
      "Port Blair is your gateway to the beauty of the Andamans, and the best way to explore it is with your own car. With Ride.Rent, you can visit Corbyn&apos;s Cove Beach, the Cellular Jail, or take a scenic drive to Chidiya Tapu. All our cars are inspected, sanitized, and ready for coastal drives and island roads. Pickup and drop services are available at Veer Savarkar International Airport, the ferry terminal, or any preferred location in the city. With honest pricing, reliable vehicles, and local expertise, Ride.Rent helps you travel stress-free across the islands.",
  },
  {
    key: 2,
    iconNumber: 2,
    title: "Effortless Booking, Every Time",
    description:
      "Booking your car in Port Blair is quick and seamless with Ride.Rent. Choose your vehicle type, confirm your travel dates, and your car will be ready on time. Tourists love our chauffeur-driven cars for sightseeing, while locals and business visitors often prefer self-drive rentals for daily travel. Each booking is supported by verified partners who ensure timely delivery and on-ground support throughout your trip.",
  },
  {
    key: 3,
    iconNumber: 3,
    title: "Comfort and Confidence for Every Traveler",
    description:
      "Every Ride.Rent booking in Port Blair is supported by trusted suppliers who know the island routes best. Whether you are traveling for leisure, family holidays, or photography tours, we ensure comfort, clean interiors, and reliable service. From hilly drives to beachfront routes, every trip is handled with care, safety, and on-time coordination.",
  },
] as const;

const UAE_CONTENT: IState = {
  [UAE_STATES.DUBAI]: {
    heading: "Enjoy ease and peace of mind when renting a car in Dubai",
    description: [
      "Discover the best of Dubai with our affordable and reliable car rental service. Whether you&apos;re visiting the main locations or exploring hidden gems, our diverse fleet offers the perfect match for your travel needs.",
      "Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it. Choose us for a stress-free experience in Dubai.",
    ],
    cards: dubaiCarFeatureCards,
  },
  [UAE_STATES.ABU_DHABI]: {
    heading: "Your Reliable Choice for Car Rentals in Abu Dhabi",
    description: [
      "Abu Dhabi is a city of business, culture, and leisure, and having the right vehicle ensures you can experience it all with ease. With Ride.Rent, you can access everything from cheap car rental Abu Dhabi for everyday use to luxury car rental Abu Dhabi and exotic car rental Abu Dhabi for special occasions.",
      "Our platform connects you with established car rental companies in Abu Dhabi, including trusted names like auto rent Abu Dhabi, auto rent a car Abu Dhabi, and major Abu Dhabi airport car rental companies. From daily rentals to car lease Abu Dhabi solutions, we ensure residents and visitors always find affordable mobility choices.",
      "For business professionals and families, we also feature rent a car with driver Abu Dhabi options along with premium executive services such as Abu Dhabi rent a car luxury and rent car Abu Dhabi luxury packages.",
    ],
    cards: abuDhabiCarFeatureCards,
  },
  [UAE_STATES.AJMAN]: {
    heading: "Your Reliable Choice for Car Rentals in Ajman",
    description: [
      "Ajman is a growing hub for families, professionals, and budget-conscious travelers, and having the right vehicle makes getting around the city seamless. With Ride.Rent, you can explore everything from rent a car in Ajman cheap for daily needs to luxury car rental Ajman for special occasions.",
      "Our platform connects you with trusted names such as Budget Rent a Car Ajman, Al Asad Rent a Car Ajman, Al Tameem Rent a Car Ajman, and other leading Ajman rent a car companies. Whether you are looking for the cheapest rent a car in Ajman, a 7 seater car for rent in Ajman, or a quick booking through rent a car Ajman Dubizzle, Ride.Rent ensures you find a vehicle that matches your budget and lifestyle.",
      "For those who prefer comfort over self-driving, Ride.Rent also lists rent a car in Ajman with driver services, ideal for families, tourists, or professionals who want convenience without the hassle of navigating.",
    ],
    cards: ajmanCarFeatureCards,
  },
  [UAE_STATES.FUJAIRAH]: {
    heading: "Your Reliable Choice for Car Rentals in Fujairah",
    description: [
      "Fujairah is known for its scenic drives, coastal views, and calm lifestyle — and Ride.Rent makes it easier to explore with the right vehicle. From cheap car rental in Fujairah for everyday use to monthly rent a car in Fujairah for long-term needs, our platform ensures affordable prices and flexible plans.",
      "Our network includes trusted providers offering verified car rental Fujairah and rent a car Fujairah services across the city, making it simple to book with confidence. From short-term rentals to monthly rent a car in Fujairah, Ride.Rent ensures clear pricing and dependable service.",
    ],
    cards: fujairahCarFeatureCards,
  },
  [UAE_STATES.SHARJAH]: {
    heading: "Seamless Car Rental Experience in Sharjah",
    description: [
      "Navigating Sharjah is easier when you choose Ride.Rent, the leading platform for renting a car in Sharjah. Whether you&apos;re a resident seeking the cheapest rent a car in Sharjah monthly, a business traveler booking at car rental Sharjah airport, or a tourist searching for rent a car in Sharjah cheap price, Ride.Rent ensures the perfect match for your needs.",
      "Whether you need rent a car without deposit Sharjah, a luxury SUV for family trips, or even rent a car with driver Sharjah, our goal is to provide convenience, affordability, and peace of mind every step of the way.",
    ],
    cards: sharjahCarFeatureCards,
  },
  [UAE_STATES.AL_AIN]: {
    heading: "Your Reliable Choice for Car Rentals in Al Ain",
    description: [
      "Al Ain offers a perfect balance of comfort and culture, and Ride.Rent makes it easy to explore the city with the right vehicle. From daily car rental Al Ain for short trips to monthly car rental Al Ain for long-term use, our platform delivers transparent pricing and flexible options. Whether you are searching for the cheapest rent a car in Al Ain, comparing rent a car Al Ain price, or looking for trusted names like Budget Rent a Car Al Ain, Ride.Rent ensures affordability and convenience every time.",
      "Our network includes reliable vehicle rental providers and other popular Al Ain rent a car companies, ensuring you always get verified service. From city options like car rental Al Ain Mall to convenient searches like rent a car Al Ain near me, Ride.Rent helps you book with confidence.",
      "For professionals, families, and visitors, we also list cheap rental cars Al Ain, car hire Al Ain, and flexible packages under rent a car in Al Ain UAE, making it easy to find a vehicle that fits every budget and purpose.",
    ],
    cards: alAinCarFeatureCards,
  },
  [UAE_STATES.RAS_AL_KHAIMAH]: {
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
  [INDIA_STATES.BANGALORE]: {
    heading: "Enjoy ease and peace of mind when renting a car in Bangalore",
    description: [
      "Discover the best of Bangalore with our affordable and reliable car rental service. Whether you are visiting IT hubs, planning weekend getaways to Nandi Hills or Coorg, or exploring the Garden City, our diverse fleet offers the perfect match for your travel needs.",
      "Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it. From Kempegowda International Airport to HSR Layout, Marathahalli, or Hebbal, choose us for a stress-free experience in Bangalore.",
    ],
    cards: bangaloreCarFeatureCards,
  },
  [INDIA_STATES.DELHI]: {
    heading: "Rent a Car in Delhi with Ease and Confidence",
    description: [
      "Ride.Rent makes renting a car in the capital simple and stress-free. From compact hatchbacks to high-end luxury cars, our network of trusted partners ensures reliable and affordable options for every purpose.",
    ],
    cards: delhiCarFeatureCards,
  },
  [INDIA_STATES.GURGAON]: {
    heading: "Rent a Car in Gurgaon with Comfort and Confidence",
    description: [
      "Ride.Rent helps you rent cars across Gurgaon quickly and easily. From compact hatchbacks to premium SUVs and luxury models, our verified partners deliver safe, clean, and ready-to-drive vehicles whenever you need them.",
      "Ride.Rent has become the preferred choice for thousands of customers across India. In Gurgaon, our network covers areas like DLF Phase 1 to 5, MG Road, Sohna Road, and Golf Course Extension. Our rental partners follow strict quality standards to ensure every vehicle is clean, well-maintained, and insured. With flexible payment options, easy cancellations, and zero-deposit plans, renting a car in Gurgaon has never been more convenient.",
    ],
    cards: gurgaonCarFeatureCards,
  },
  [INDIA_STATES.KOCHI]: {
    heading: "Rent a Car in Kochi for a Smooth and Comfortable Journey",
    description: [
      "Ride.Rent makes car rental in Kochi simple, affordable, and dependable. Choose from a range of self-drive cars, SUVs, and premium sedans for city rides, family trips, or weekend escapes.",
      "Ride.Rent has become the preferred choice for car rentals in Kochi by focusing on trust and transparency. Our growing network covers major locations such as Kakkanad, Panampilly Nagar, Edappally, and Vyttila. Every rental partner follows strict maintenance and service standards to ensure vehicle safety and comfort. With easy cancellations, zero-deposit rentals, and multiple payment options, Ride.Rent makes car hire in Kochi convenient for both residents and visitors.",
    ],
    cards: kochiCarFeatureCards,
  },
  [INDIA_STATES.KOLKATA]: {
    heading: "Rent a Car in Kolkata for Comfort and Flexibility",
    description: [
      "Ride.Rent makes car rental in Kolkata simple, quick, and affordable. Choose from hatchbacks, sedans, SUVs, or luxury cars for everyday commutes, business trips, or weekend escapes around the city.",
      "Ride.Rent has become a trusted choice for car rentals in Kolkata by offering genuine service and transparent pricing. Our network covers major areas such as Salt Lake, Behala, Garia, and New Alipore. All vehicles are inspected, insured, and delivered on time. With easy payment options, zero-deposit rentals, and quick cancellations, we make it easy for residents, tourists, and business travelers to rent cars without hassle.",
    ],
    cards: kolkataCarFeatureCards,
  },
  [INDIA_STATES.MUMBAI]: {
    heading: "Rent a Car in Mumbai with Ride.Rent",
    description: [
      "Experience seamless car rentals across Mumbai with Ride.Rent. Choose from self-drive cars, chauffeur-driven options, or premium models for every occasion, all at transparent and competitive prices.",
      "Ride.Rent has built trust across Mumbai through consistent service and clear pricing. Our network spans Andheri, Navi Mumbai, Bandra, Lower Parel, and beyond. Every supplier is verified, every vehicle well-maintained, and every rental transparent. With zero deposit options, flexible cancellations, and secure payment methods, Ride.Rent gives both tourists and residents a dependable travel partner.",
    ],
    cards: mumbaiCarFeatureCards,
  },
  [INDIA_STATES.NOIDA]: {
    heading: "Rent a Car in Noida with Ride.Rent",
    description: [
      "Ride.Rent helps you rent a car in Noida easily. Whether you&apos;re heading to work, traveling with family, or going to the airport, we offer reliable cars that suit every budget and purpose.",
      "Ride.Rent has become the trusted choice for thousands of travelers in Noida by focusing on service, safety, and transparency. Our network spans all key sectors including 15, 18, 62, 128, and Noida Extension. Each partner follows strict standards for cleanliness and vehicle upkeep. With zero-deposit rentals, flexible payments, and easy cancellation policies, Ride.Rent ensures car hire in Noida is quick, simple, and dependable for both residents and professionals.",
    ],
    cards: noidaCarFeatureCards,
  },
  [INDIA_STATES.PUNE]: {
    heading: "Rent a Car in Pune with Ease and Flexibility",
    description: [
      "Ride.Rent helps you rent a car in Pune quickly and conveniently. Choose from affordable hatchbacks, family sedans, or premium SUVs that suit your travel plan and budget.",
      "Thousands of users in Pune choose Ride.Rent for their daily commutes and weekend drives. Our network covers all major areas including Wakad, Viman Nagar, Aundh, and Hadapsar. Each rental partner follows strict safety and service standards to ensure your peace of mind. With easy payment options, zero-deposit rentals, and quick support, renting a car in Pune is now more reliable than ever.",
    ],
    cards: puneCarFeatureCards,
  },
  [INDIA_STATES.RAJASTHAN]: {
    heading: "Rent a Car in Rajasthan with Ride.Rent",
    description: [
      "Ride.Rent makes it easy to rent a car anywhere in Rajasthan. Whether you are exploring the Pink City or planning a desert road trip, our platform connects you with reliable cars at the best prices.",
      "Ride.Rent has earned the trust of thousands of travelers across Rajasthan by delivering consistent service and fair pricing. Our network includes all major cities like Jaipur, Udaipur, Jodhpur, Ajmer, Bikaner, and Jaisalmer. With easy online booking, flexible cancellations, and zero-deposit rentals, car hire in Rajasthan has never been more accessible.",
    ],
    cards: rajasthanCarFeatureCards,
  },
  [INDIA_STATES.TELANGANA]: {
    heading: "Rent a Car in Telangana with Ride.Rent",
    description: [
      "Ride.Rent makes car rentals in Telangana quick, simple, and affordable. Whether you are commuting within Hyderabad or planning a long drive to Warangal or Karimnagar, we have the right car for your journey.",
      "Ride.Rent has become a trusted travel companion for thousands of residents and visitors across Telangana. Our strong presence in Hyderabad, Warangal, Nalgonda, and Karimnagar ensures reliable car rentals wherever you are. All our partners follow strict quality checks to deliver cars that are safe, clean, and ready to drive. With zero-deposit rentals, easy payments, and quick support, Ride.Rent continues to redefine travel convenience in Telangana.",
    ],
    cards: telanganaCarFeatureCards,
  },
  [INDIA_STATES.AHMEDABAD]: {
    heading: "Car Rental in Ahmedabad Made Easy with Ride.Rent",
    description: [
      "Book reliable self-drive or chauffeur-driven cars across Ahmedabad with Ride.Rent. Enjoy quick booking, verified partners, and affordable rates for every journey.",
      "Ride.Rent has built trust among thousands of travelers across Gujarat by offering consistent quality and fair pricing. Our service covers key areas like Navrangpura, Bopal, Ashram Road, and Satellite. All cars are inspected before every delivery and supported by verified rental partners. With multiple payment options, simple cancellations, and zero-deposit choices, Ride.Rent keeps car hire in Ahmedabad easy, affordable, and dependable.",
    ],
    cards: ahmedabadCarFeatureCards,
  },
  [INDIA_STATES.PORT_BLAIR]: {
    heading: "Rent a Car in Port Blair with Ride.Rent",
    description: [
      "Choose from self-drive cars, chauffeur-driven vehicles, and airport transfer options for exploring the Andaman Islands with comfort and confidence.",
      "Ride.Rent has become a trusted choice for travelers visiting Port Blair, Havelock, and Neil Island. Our verified partners offer dependable vehicles, flexible plans, and prompt assistance for both tourists and locals. With easy cancellations, zero-deposit bookings, and all-day customer support, we make car rentals across the islands effortless.",
    ],
    cards: portBlairCarFeatureCards,
  },
};

export const homepageFeaturesContent: IFeature = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;
