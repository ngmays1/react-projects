import { useState, CSSProperties } from 'react'
import { projects, Project } from './projects'

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Text:       { bg: '#EEF2FF', text: '#4338CA' },
  Speech:     { bg: '#ECFDF5', text: '#065F46' },
  TypeScript: { bg: '#EFF6FF', text: '#1D4ED8' },
  default:    { bg: '#F3F4F6', text: '#374151' },
}

function tagStyle(tag: string): CSSProperties {
  const colors = TAG_COLORS[tag] ?? TAG_COLORS.default
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '999px',
    letterSpacing: '0.02em',
  }
}

function ProjectCard({
  project,
  onSelect,
}: {
  project: Project
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        padding: '24px',
        border: '1px solid #E5E7EB',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.10)'
          : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
        {project.title}
      </h2>
      <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, flexGrow: 1 }}>
        {project.description}
      </p>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {project.tags.map((tag) => (
          <span key={tag} style={tagStyle(tag)}>
            {tag}
          </span>
        ))}
      </div>
      <button
        style={{
          marginTop: '4px',
          padding: '10px 0',
          backgroundColor: '#4F46E5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Open Project →
      </button>
    </div>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = projects.find((p) => p.id === activeId) ?? null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setActiveId(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#4F46E5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '16px',
            }}
          >
            ↩
          </span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>
            Projects
          </span>
        </button>

        {active && (
          <button
            onClick={() => setActiveId(null)}
            style={{
              background: 'none',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '14px',
              color: '#6B7280',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            ← All Projects
          </button>
        )}
      </header>

      <main style={{ flex: 1, padding: '48px 32px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        {active ? (
          // Project view
          <div>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>
              Projects / {active.title}
            </p>
            <active.Component />
          </div>
        ) : (
          // Showcase grid
          <>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                Projects
              </h1>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>
                A collection of small interactive experiments.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={() => setActiveId(project.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
