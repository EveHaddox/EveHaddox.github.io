import { projects } from '../projects/projectsData';

export default function Timeline() {
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute top-0 left-4 h-full border-l-2 border-primary"></div>

      {projects.map((proj) => (
        <div key={proj.slug} className="relative mb-12">
          {/* Dot marker */}
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>

          {/* Date */}
          <time className="block text-sm text-muted mb-1">
            {new Date(proj.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>

          {/* Title */}
          <h3 className="text-lg font-semibold text-primary">{proj.title}</h3>
        </div>
      ))}
    </div>
  );
}