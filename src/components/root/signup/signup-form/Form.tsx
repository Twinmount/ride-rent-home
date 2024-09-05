'use client'

import React, { FormEvent, useState } from 'react'
import './Form.scss'

const Form = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    return
  }

  return (
    <div className="form-container">
      <h3>
        Join <span>Ride.Rent</span>
      </h3>
      <form onSubmit={(e) => onSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register Now</button>
      </form>
    </div>
  )
}

export default Form
