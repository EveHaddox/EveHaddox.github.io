import Link from 'next/link';
import Timeline from '../components/Timeline';
import { projects } from '../projects/projectsData';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="bg-header">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Your Name</h1>
            <p className="text-muted">Game UI Developer & Designer</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-muted hover:text-primary">GitHub</a>
            <a href="#" className="text-muted hover:text-primary">Discord</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-20">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Link
                key={proj.slug}
                href={`/${proj.slug}`}
                className="group block bg-header rounded-md overflow-hidden border-2 border-transparent hover:border-primary transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={proj.screenshots[0]}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary">{proj.title}</h3>
                  <p className="text-muted">{proj.tagline}</p>
                  <a
                    href={proj.gmodstoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-primary hover:underline"
                  >
                    View on GmodStore
                  </a>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-primary">Timeline</h2>
          <Timeline />
        </section>
      </main>
    </div>
  );
}