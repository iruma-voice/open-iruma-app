'use client';

import React, { useEffect } from 'react';

export default function TallyFeedback({ title }: { title: string }) {
  useEffect(() => {
    // Dynamically load Tally script
    const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (typeof Tally !== 'undefined') {
          // @ts-ignore
          Tally.loadEmbeds();
        }
      };
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      if (typeof Tally !== 'undefined') {
        // @ts-ignore
        Tally.loadEmbeds();
      }
    }
  }, []);

  // Use dynamic page title for the embed
  const tallyUrl = `https://tally.so/embed/5BEQPP?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&page_title=${encodeURIComponent(title)}`;

  return (
    <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
        📮 ご意見・フィードバック
      </h3>
      <iframe 
        data-tally-src={tallyUrl} 
        loading="lazy" 
        width="100%" 
        height="300" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0} 
        title="この記事についてのフィードバック（市民の声）"
        className="w-full"
      ></iframe>
    </div>
  );
}
