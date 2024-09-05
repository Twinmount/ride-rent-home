import React, { FC } from 'react'
import { profileFeatures } from '../vehicle-card'
import './Specifications.scss'

interface SpecificationsProps {
  isGridView?: boolean
}

const Specifications: FC<SpecificationsProps> = ({ isGridView }) => {
  return (
    <div className={`specifications ${isGridView ? 'flex-view' : ''}`}>
      {profileFeatures.map((feature) => (
        <div key={feature.key} className="specification">
          <div className="icon-box">
            <img src={feature.icon} alt={feature.label} />
          </div>
          <span className="label">{feature.label}</span>
        </div>
      ))}
    </div>
  )
}

export default Specifications
