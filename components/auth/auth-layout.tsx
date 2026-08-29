interface AuthLayoutProps {
  children: React.ReactNode
}

const FEATURES = [
  "Describe a system in plain English",
  "Collaborate on a shared real-time canvas",
  "Generate a technical spec from your architecture",
]

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden w-1/2 flex-col justify-center gap-8 border-r border-surface-border px-16 lg:flex">
        <span className="text-sm font-medium tracking-wide text-copy-primary">
          Ghost AI
        </span>
        <div className="flex flex-col gap-3">
          <p className="text-2xl font-medium text-copy-primary">
            Design systems together, at the speed of thought.
          </p>
          <ul className="flex flex-col gap-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="text-sm text-copy-muted">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        {children}
      </div>
    </div>
  )
}
