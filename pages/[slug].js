// pages/[slug].js

import { useRouter } from 'next/router';
import Link from 'next/link';
import { projects } from '../projects/projectsData';

export default function ProjectDetail({ proj, purchases, reviewsCount }) {
  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Link href="/" className="inline-block text-primary hover:underline">
          ← Back to Portfolio
        </Link>

        {/* Header */}
        <header className="bg-header rounded-md p-4 space-y-1">
          <h1 className="text-3xl font-bold text-primary">{proj.title}</h1>
          <p className="text-muted">
            {new Date(proj.date).toLocaleDateString()}
          </p>
        </header>

        {/* GmodStore Actions */}
        <div className="flex flex-wrap items-center space-x-6">
          <a
            href={proj.gmodstoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-text py-2 px-4 rounded-sm hover:opacity-90 transition-opacity"
          >
            View on GmodStore
          </a>

          {/* Reviews Count */}
          <span className="flex items-center space-x-1 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
            </svg>
            <span>{reviewsCount} Reviews</span>
          </span>

          {/* Purchase Count */}
          <span className="flex items-center space-x-1 text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0V9h2a1 1 0 100-2h-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{purchases} Purchases</span>
          </span>
        </div>

        {/* Screenshots */}
        <div className="space-y-4">
          {proj.screenshots.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${proj.title} screenshot ${i + 1}`}
              className="w-full rounded-md border-2 border-header"
            />
          ))}
        </div>

        {/* Reviews Link */}
        <div className="pt-6 border-t border-header">
          <a
            href={`${proj.gmodstoreUrl}#reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Read all reviews
          </a>
        </div>
      </div>
    </div>
  );
}

// Generate paths for each project
export async function getStaticPaths() {
  return {
    paths: projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

// Fetch GmodStore data at build time
export async function getStaticProps({ params }) {
  const proj = projects.find((p) => p.slug === params.slug);
  if (!proj) {
    return { notFound: true };
  }

  // Server‐side require for Cheerio
  const cheerio = require('cheerio');

  const response = await fetch(proj.gmodstoreUrl);
  const html = await response.text();
  const $ = cheerio.load(html);

  // Purchases: look for text starting 'Purchases:'
  let purchases = $('*')
    .filter((i, el) => $(el).text().trim().startsWith('Purchases:'))
    .text()
    .replace('Purchases:', '')
    .trim();

  // Reviews count from link like 'Reviews (56)'
  const reviewsText = $('a[href*="#reviews"]').text();
  const match = reviewsText.match(/\((\d+)\)/);
  const reviewsCount = match ? match[1] : '0';

  return {
    props: { proj, purchases, reviewsCount },
  };
}
