import { AnalysisResult } from './context'

export const mockAnalysisResults: AnalysisResult[] = [
  {
    id: '1',
    fileName: 'john_doe_resume.pdf',
    uploadDate: '2024-04-15',
    atsScore: 78,
    keywords: [
      { word: 'React', found: true, frequency: 5 },
      { word: 'TypeScript', found: true, frequency: 4 },
      { word: 'Node.js', found: true, frequency: 3 },
      { word: 'Python', found: false, frequency: 0 },
      { word: 'AWS', found: true, frequency: 2 },
      { word: 'Docker', found: false, frequency: 0 },
      { word: 'Next.js', found: true, frequency: 3 },
      { word: 'PostgreSQL', found: true, frequency: 2 },
    ],
    roleMatches: [
      { role: 'Senior Full Stack Developer', matchPercentage: 85, keywords: ['React', 'Node.js', 'TypeScript'] },
      { role: 'Frontend Engineer', matchPercentage: 78, keywords: ['React', 'TypeScript', 'Next.js'] },
      { role: 'Backend Engineer', matchPercentage: 72, keywords: ['Node.js', 'PostgreSQL', 'AWS'] },
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'AWS', 'Git', 'REST APIs', 'GraphQL'],
    sections: [
      { name: 'Experience', quality: 9, suggestions: ['Add more metrics and achievements', 'Quantify impact on projects'] },
      { name: 'Skills', quality: 8, suggestions: ['Organize by categories', 'Add proficiency levels'] },
      { name: 'Education', quality: 7, suggestions: ['Include relevant coursework', 'Add certifications'] },
      { name: 'Projects', quality: 8, suggestions: ['Add live links', 'Include GitHub repositories'] },
    ],
    jobDescription: 'Senior Full Stack Developer with React and Node.js experience required',
  },
  {
    id: '2',
    fileName: 'jane_smith_cv.pdf',
    uploadDate: '2024-04-10',
    atsScore: 82,
    keywords: [
      { word: 'Python', found: true, frequency: 6 },
      { word: 'Machine Learning', found: true, frequency: 4 },
      { word: 'TensorFlow', found: true, frequency: 3 },
      { word: 'Data Analysis', found: true, frequency: 2 },
      { word: 'Kubernetes', found: false, frequency: 0 },
      { word: 'Scala', found: false, frequency: 0 },
    ],
    roleMatches: [
      { role: 'Machine Learning Engineer', matchPercentage: 92, keywords: ['Python', 'TensorFlow', 'Machine Learning'] },
      { role: 'Data Scientist', matchPercentage: 88, keywords: ['Python', 'Data Analysis', 'Machine Learning'] },
      { role: 'AI Engineer', matchPercentage: 85, keywords: ['Python', 'Machine Learning'] },
    ],
    skills: ['Python', 'TensorFlow', 'Scikit-learn', 'Data Analysis', 'SQL', 'Pandas', 'NumPy', 'Jupyter', 'Git'],
    sections: [
      { name: 'Experience', quality: 9, suggestions: ['Highlight impact of ML models', 'Include A/B testing results'] },
      { name: 'Skills', quality: 9, suggestions: ['Add frameworks used', 'Include deployment tools'] },
      { name: 'Education', quality: 8, suggestions: ['Add relevant certifications', 'List academic publications'] },
    ],
  },
]
