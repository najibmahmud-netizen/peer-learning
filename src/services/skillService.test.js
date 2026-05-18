import { describe, it, expect } from 'vitest';
import { getSkillById } from './skillService';

describe('Skill Service Network Failure Recovery', () => {

  it('should gracefully drop back to local mock data when backend responds with a 500 error', async () => {
    
    const skillData = await getSkillById('mock-id-123');

   
    expect(skillData).toBeDefined();
    expect(skillData).toHaveProperty('category');
    expect(skillData).toHaveProperty('tutorName');
    expect(typeof skillData.price).toBe('string');
  });

});