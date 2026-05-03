import { ComponentType } from 'react'
import TextReverser from '../components/TextReverser'
import Dashboard from '../components/Dashboard'
import ModularVisualizer from '../components/ModularVisualizer'

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  Component: ComponentType
}

export const projects: Project[] = [
  {
    id: 'phonetic-reverser',
    title: 'Phonetic Reverser',
    description:
      'Reverses text while preserving phonetic clusters (ch, sh, th…) so the output sounds natural when spoken aloud.',
    tags: ['Text', 'Speech', 'TypeScript'],
    Component: TextReverser,
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description:
      'generic dashboard landing page for applications on my homelab',
    tags: ['React', 'TypeScript'],
    Component: Dashboard,
  },
  {
    id: 'modular-visualizer',
    title: 'Audio Visualizer',
    description:
      'modular audio visualizer',
    tags: ['React', 'Speech', 'TypeScript'],
    Component: ModularVisualizer,
  }
]
