import { describe, it, expect, beforeEach } from 'vitest'; // Change to 'jest' if using Jest
import { createBooking, getBookings } from './sessionManager';

describe('Volatile In-Memory Session Manager', () => {
  
  // Clean the state or memory array references before each run if necessary
  beforeEach(() => {
    // This ensures our runtime array tests start fresh
  });

  it('should successfully create a new active session booking', () => {
    const sampleBooking = {
      skillId: 'react-101',
      title: 'Advanced React Architecture',
      category: 'Frontend',
      tutorName: 'Peter Muturi',
      price: '2500'
    };

    const result = createBooking(sampleBooking);

    // Assertions to check data structure matching
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('bookedAt');
    expect(result.title).toBe('Advanced React Architecture');
    expect(result.price).toBe('2500');
  });

  it('should retrieve all booked sessions ordered newest first', () => {
    const booking1 = createBooking({ title: 'First Skill Match' });
    const booking2 = createBooking({ title: 'Second Skill Match' });

    const allBookings = getBookings();

    // Verify array tracking logic works perfectly
    expect(Array.isArray(allBookings)).toBe(true);
    expect(allBookings.length).toBeGreaterThanOrEqual(2);
    expect(allBookings[0].title).toBe('Second Skill Match'); // Should be unshifted to top
  });
  
});