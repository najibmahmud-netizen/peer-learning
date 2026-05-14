import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkillCard from '../components/SkillCard'

test('renders skill card title', () => {
  render(
    <SkillCard
      title="React Development"
      description="Learn React basics"
    />
  )

  expect(screen.getByText('React Development')).toBeInTheDocument()
})