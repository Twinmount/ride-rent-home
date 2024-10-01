import React from 'react'
import MotionSection from '@/components/general/framer-motion/MotionSection'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Image from 'next/image'

import './FAQ.scss'
import { generateDynamicFAQ } from '@/helpers'
import { VehicleDetailsResponse } from '@/types/vehicle-details-types'

type DynamicFAQProps = {
  vehicle: VehicleDetailsResponse['result']
}

export default function DynamicFAQ({ vehicle }: DynamicFAQProps) {
  // helper function to generate dynamic FAQ based on the vehicle
  const faqData = generateDynamicFAQ(vehicle)

  if (faqData.length === 0) return null

  return (
    <MotionSection className="faq-section wrapper">
      <div className="heading-container">
        <h2 className="frequently-asked">Frequently Asked Questions</h2>
        <Image
          width={50}
          height={50}
          src={'/assets/img/general/title-head.png'}
          alt="Custom Underline Image"
          className="custom-underline"
        />
      </div>

      <Accordion type="single" collapsible className="w-full mx-auto md:w-3/4">
        {faqData.map((item, index) => (
          <AccordionItem
            className="p-1 px-4 mb-1 bg-white rounded-lg shadow"
            key={index}
            value={`item-${index + 1}`}
          >
            <AccordionTrigger className="hover:no-underline text-start">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </MotionSection>
  )
}
