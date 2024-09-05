import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FaSquarePhoneFlip } from 'react-icons/fa6'

type PhoneProps = {
  phoneNumber: string // This should already be formatted like +971 123456
}

export default function Phone({ phoneNumber }: PhoneProps) {
  // Sanitize phone number by removing spaces for the href
  const sanitizedPhoneNumber = phoneNumber.replace(/\s+/g, '')

  return (
    <Popover>
      <PopoverTrigger>
        <FaSquarePhoneFlip className="icon phone" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={15}
        className="bg-yellow h-12 w-fit rounded-3xl flex justify-center items-center"
      >
        <a
          href={`tel:${sanitizedPhoneNumber}`} // Using sanitized phone number here
          className="md:text-lg font-bold tracking-wider text-white flex justify-center items-center gap-x-2"
        >
          +{phoneNumber} {/* Display formatted phone number for better UI */}
          <FaSquarePhoneFlip className="text-white text-2xl md:text-3xl" />
        </a>
      </PopoverContent>
    </Popover>
  )
}
