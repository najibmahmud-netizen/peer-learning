import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

test('renders navbar title', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  )

  expect(screen.getByText('PeerLearn')).toBeInTheDocument()
})