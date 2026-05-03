import { useState, CSSProperties } from 'react'
import { Moon, Sun } from 'lucide-react'
import { projects, Project } from './projects'
import { useTheme } from './context/ThemeContext'

function ProjectCard({
  project,
  onSelect,
}: {
  project: Project
  onSelect: () => void
}) {
  const { tokens } = useTheme()
  const [hovered, setHovered] = useState(false)

  const tagStyle = (tag: string): CSSProperties => {
    const colors = tokens.tags[tag] ?? tokens.tags.default
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

  return (
    <div
      style={{
        backgroundColor: tokens.surface,
        borderRadius: '14px',
        padding: '24px',
        border: `1px solid ${tokens.border}`,
        boxShadow: hovered ? tokens.shadowHover : tokens.shadow,
        transition: 'box-shadow 0.2s, transform 0.2s, background-color 0.3s',
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
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: tokens.textPrimary }}>
        {project.title}
      </h2>
      <p style={{ fontSize: '14px', color: tokens.textSecondary, lineHeight: 1.6, flexGrow: 1 }}>
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
          backgroundColor: tokens.accent,
          color: tokens.accentFg,
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%',
          transition: 'opacity 0.2s',
        }}
      >
        Open Project →
      </button>
    </div>
  )
}

export default function App() {
  const { tokens, theme, toggle } = useTheme()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = projects.find((p) => p.id === activeId) ?? null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: tokens.bg, transition: 'background-color 0.3s, color 0.3s', color: tokens.textPrimary }}>
      <header
        style={{
          backgroundColor: tokens.header,
          borderBottom: `1px solid ${tokens.border}`,
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          transition: 'background-color 0.3s, border-color 0.3s',
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
              backgroundColor: tokens.accent,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.accentFg,
              fontSize: '16px',
            }}
          >
            ↩
          </span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: tokens.textPrimary }}>
            Projects
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {active && (
            <button
              onClick={() => setActiveId(null)}
              style={{
                background: 'none',
                border: `1px solid ${tokens.border}`,
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '14px',
                color: tokens.textSecondary,
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              ← All Projects
            </button>
          )}

          <button
            onClick={toggle}
            title={theme === 'light' ? 'Switch to Twilight' : 'Switch to Light'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: '50%',
              cursor: 'pointer',
              color: tokens.textSecondary,
              transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
              flexShrink: 0,
            }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '48px 32px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        {active ? (
          <div>
            <p style={{ fontSize: '13px', color: tokens.textMuted, marginBottom: '8px' }}>
              Projects / {active.title}
            </p>
            <active.Component />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: tokens.textPrimary, marginBottom: '8px' }}>
                Projects
              </h1>
              <p style={{ fontSize: '16px', color: tokens.textSecondary }}>
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
