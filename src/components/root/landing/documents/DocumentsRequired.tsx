import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import { CiCircleCheck } from 'react-icons/ci';

const DocumentItem = ({ children }: { children: React.ReactNode }) => (
  // Individual document item with icon and text
  <li className="flex items-center gap-[0.5rem] sm:gap-[0.75rem]">
    <CiCircleCheck className="h-[1rem] w-[1rem] flex-shrink-0 text-yellow sm:h-[1.25rem] sm:w-[1.25rem]" />
    <span className="text-[0.625rem] text-[#6C6C6C] sm:text-[0.875rem]">
      {children}
    </span>
  </li>
);

const DocumentSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  // Document section with title and list of items
  <MotionDiv className="space-y-[0.75rem] sm:space-y-[1rem]">
    {/* Section title */}
    <h4 className="text-[0.875rem] font-semibold text-text-primary sm:text-[1.125rem]">
      {title}
    </h4>

    {/* List of document items */}
    <ul className="space-y-[0.5rem] sm:space-y-[0.75rem]">
      {items.map((item, index) => (
        <DocumentItem key={index}>{item}</DocumentItem>
      ))}
    </ul>
  </MotionDiv>
);

const DocumentsRequired = ({ category }: { category: string }) => {
  // Document requirements for UAE residents
  const uaeResidentDocs = [
    'Valid UAE Driving License',
    'Emirates ID',
    '(Residential Visa may be acceptable)',
  ];

  // Document requirements for tourists
  const touristDocs = [
    'Valid Passport',
    'Visa Details',
    'Home Country Driving License',
    'International Driving Permit (IDP)',
  ];

  return (
    // Main container for documents required section - REMOVED pb-[1.5rem] to fix padding issue
    <div className="space-y-[1rem] sm:space-y-[1.5rem]">
      {/* Main heading */}
      <div>
        <h3 className="text-[1rem] font-semibold text-text-primary sm:text-[1.25rem] lg:text-[1.5625rem]">
          Documents Required to Rent a {category} in UAE
        </h3>
      </div>

      {/* Two-column layout for document sections */}
      <div className="flex flex-col gap-[1.5rem] font-medium text-text-primary sm:gap-[2rem] md:grid md:grid-cols-2">
        <DocumentSection title="For UAE Residents" items={uaeResidentDocs} />
        <DocumentSection title="For Tourists in UAE" items={touristDocs} />
      </div>
    </div>
  );
};

export default DocumentsRequired;