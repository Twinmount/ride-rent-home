'use client'

import React, { useEffect, useState } from 'react'
import MotionSection from '@/components/general/framer-motion/MotionSection'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Image from 'next/image'

import './FAQ.scss'
import { Skeleton } from '@/components/ui/skeleton'

type FAQStateProps = {
  stateValue: string
}

type faqType = { question: string; answer: string }[]

export default function FAQ({ stateValue }: FAQStateProps) {
  const [faqData, setFaqData] = useState<faqType>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFaqData() {
      try {
        const faqModule = await import(`@/constants/faq-data/${stateValue}`)
        setFaqData(faqModule.default || [])
      } catch (error) {
        console.error('Failed to load FAQ data:', error)
        setFaqData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadFaqData()
  }, [stateValue])

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

      {isLoading ? (
        <Skeleton className="w-full bg-gray-300 rounded-lg h-36" />
      ) : (
        <Accordion
          type="single"
          collapsible
          className="w-full mx-auto md:w-3/4"
        >
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
      )}
    </MotionSection>
  )
}
