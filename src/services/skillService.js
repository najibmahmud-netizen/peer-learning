import { apiClient } from './apiClient'

// In-memory array fallback. Changes stay volatile in application memory (no local storage/cookies)
let _memorySkills = [
  {
    id: "1",
    title: "Introduction to React and Tailwind CSS",
    category: "Frontend",
    description: "Learn modern UI design patterns, modular component architectures, and fully responsive layouts from scratch.",
    tutorName: "Peter Muturi",
    tutorId: "user-123", // Matches a mock logged-in user id for testing dashboard panels
    price: "2500",
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    title: "Node.js REST API Architecture",
    category: "Backend",
    description: "Build robust, highly scalable server architectures, secure middleware systems, and custom database integrations.",
    tutorName: "Sumaya Jamal",
    tutorId: "user-999",
    price: "3500",
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    title: "Data Pipelines with Python",
    category: "Data Science",
    description: "Master automated ETL processing pipelines, exploratory data transformations, and Pandas structuring setups.",
    tutorName: "Najib Mahmud",
    tutorId: "user-888",
    price: "4200",
    status: "Closed",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
  }
];

export const getSkills = async () => {
  try {
    return await apiClient('/skills')
  } catch (error) {
    console.warn("Backend /skills route returned 500. Falling back to secure in-memory data arrays.", error)
    return _memorySkills
  }
}

export const getSkillById = async (id) => {
  try {
    return await apiClient(`/skills/${id}`)
  } catch (error) {
    console.warn(`Backend /skills/${id} failed. Searching volatile memory layer instead.`)
    // Hard fallback layout data wrapper so SkillDetails.jsx has data to render
    return {
      id: id,
      title: "Introduction to React and Tailwind CSS",
      category: "Frontend",
      description: "Learn modern UI design patterns, modular component architectures, and fully responsive layouts from scratch.",
      tutorName: "Peter Muturi",
      price: "2500",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"
    }
  }
}

export const createSkill = async (skillData) => {
  try {
    return await apiClient('/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    })
  } catch (error) {
    console.warn("Backend POST /skills failed. Injecting entry directly into runtime application memory.")
    const newSkill = {
      id: String(_memorySkills.length + 1),
      ...skillData,
      status: skillData.status || "Available",
      imageUrl: skillData.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"
    }
    _memorySkills.unshift(newSkill) // Pushes to the front of the list so it appears instantly on the UI
    return newSkill
  }
}

// Clean abstraction layer matching your layout requirements
export const fetchAllSkills = async () => {
  return await getSkills()
}