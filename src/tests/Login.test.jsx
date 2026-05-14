import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'

test('renders login form heading', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
})