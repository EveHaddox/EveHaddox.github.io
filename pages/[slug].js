// pages/[slug].js

import Link from 'next/link';
import { projects } from '../projects/projectsData';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProjectDetail({ proj, purchases: initialPurchases, reviewsCount: initialReviewsCount, ratingAvg: initialRatingAvg, featuredHtml, featuredAuthor }) {
  // Support client‐side updates if desired
  const [purchases] = useState(initialPurchases);
  const [reviewsCount] = useState(initialReviewsCount);
  const [ratingAvg] = useState(initialRatingAvg);

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Back link */}
        <Link href="/" className="inline-block text-primary hover:underline">
          ← Back to Portfolio
        </Link>

        {/* Header */}
        <header className="bg-header rounded-md p-4 space-y-1">
          <h1 className="text-3xl font-bold text-primary">{proj.title}</h1>
          <p className="text-muted">
            {new Date(proj.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </header>

        {/* Rating & Purchases */}
        <div className="flex flex-wrap items-center space-x-6">
          {/* Star Rating */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const idx = i + 1;
              if (ratingAvg >= idx) return <Star key={i} className="w-5 h-5 text-gold" />;
              if (ratingAvg >= idx - 0.5) return <StarHalf key={i} className="w-5 h-5 text-gold" />;
              return <StarOff key={i} className="w-5 h-5 text-disabled" />;
            })}
            <span className="text-muted text-sm">({reviewsCount} reviews)</span>
          </div>

          {/* Purchases */}
          <span className="flex items-center space-x-1 text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0V9h2a1 1 0 100-2h-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{purchases} purchases</span>
          </span>
        </div>

        {/* Featured Review */}
        {featuredHtml && (
          <section className="bg-header rounded-md p-4 space-y-2">
            <h2 className="text-xl font-semibold text-primary">Featured Review</h2>
            <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: featuredHtml }} />
            {featuredAuthor && <p className="text-muted text-sm">— {featuredAuthor}</p>}
          </section>
        )}

        {/* GmodStore Button */}
        <div>
          <a
            href={proj.gmodstoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-text py-2 px-4 rounded-sm hover:opacity-90 transition-opacity"
          >
            View on GmodStore
          </a>
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

        {/* Read Full Reviews on GmodStore */}
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

export async function getStaticPaths() {
  return {
    paths: projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const proj = projects.find((p) => p.slug === params.slug);
  if (!proj) {
    return { notFound: true };
  }

  const cheerio = require('cheerio');
  const response = await fetch(proj.gmodstoreUrl);
  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract purchases
  let purchases = $('*')
    .filter((i, el) => $(el).text().trim().startsWith('Purchases:'))
    .text()
    .replace('Purchases:', '')
    .trim();

  // Extract rating average and review count from "(50) (5)" pattern
  const headerText = $('h1').parent().text();
  const match = headerText.match(/\((\d+)\)\s*\((\d+)\)/);
  let ratingAvg = 0;
  let reviewsCount = 0;
  if (match) {
    ratingAvg = parseInt(match[1], 10) / 10;
    reviewsCount = parseInt(match[2], 10);
  }

  // Extract featured review (first blockquote)
  const featuredBlock = $('blockquote').first();
  const featuredHtml = featuredBlock.length ? featuredBlock.html() : null;
  const featuredAuthor = featuredBlock.length ? featuredBlock.next().text().trim() : null;

  return {
    props: { proj, purchases, reviewsCount, ratingAvg, featuredHtml, featuredAuthor },
  };
}
