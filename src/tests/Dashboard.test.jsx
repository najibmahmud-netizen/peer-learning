import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

test('renders dashboard', () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )

  expect(screen.getByText('Dashboard')).toBeInTheDocument()
})