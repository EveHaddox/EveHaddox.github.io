// components/Reviews.js

import { useState, useEffect } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';

export default function Reviews({ slug }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // build the GmodStore reviews URL
    const targetUrl = `https://www.gmodstore.com/market/view/${slug}/reviews`;
    // fetch via AllOrigins to bypass CORS
    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // adjust selectors to match GModStore’s markup
        const items = Array.from(doc.querySelectorAll('.review-item'));
        const data = items.map(item => {
          const author = item.querySelector('.username')?.textContent.trim() || 'Unknown';
          const date   = item.querySelector('.date')?.textContent.trim()     || '';
          const content = item.querySelector('.review-content')?.innerHTML   || '';
          // count full & half stars
          const fullStars = item.querySelectorAll('.star.full').length;
          const halfStars = item.querySelectorAll('.star.half').length;
          const rating = fullStars + halfStars * 0.5;
          return { author, date, content, rating };
        });
        setReviews(data);
      })
      .catch(console.error);
  }, [slug]);

  if (reviews.length === 0) {
    return <p className="text-muted">Loading reviews…</p>;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Reviews</h2>
      {reviews.map((r, i) => (
        <div key={i} className="bg-header p-4 rounded-md">
          <div className="flex items-center mb-2 space-x-2">
            {Array.from({ length: 5 }).map((_, j) => {
              const idx = j + 1;
              if (r.rating >= idx)      return <Star key={j}    className="w-5 h-5 text-gold" />;
              if (r.rating >= idx - .5) return <StarHalf key={j} className="w-5 h-5 text-gold" />;
              return <StarOff key={j}   className="w-5 h-5 text-disabled" />;
            })}
            <span className="text-muted text-sm">
              {r.date} &bull; {r.author}
            </span>
          </div>
          <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: r.content }} />
        </div>
      ))}
    </section>
  );
}
