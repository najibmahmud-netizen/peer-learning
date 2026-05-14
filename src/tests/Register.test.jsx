import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Register from '../pages/Register'

test('renders register page', () => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  )

  expect(screen.getByText('Create Account')).toBeInTheDocument()
})