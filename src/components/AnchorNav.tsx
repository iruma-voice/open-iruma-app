'use client';

export default function AnchorNav() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 shadow-sm flex">
      <button
        onClick={() => scrollTo('summary')}
        className="flex-1 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
      >
        要約
      </button>
      <button
        onClick={() => scrollTo('impact')}
        className="flex-1 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
      >
        生活影響
      </button>
      <button
        onClick={() => scrollTo('deepdive')}
        className="flex-1 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
      >
        賛否・議論
      </button>
      <button
        onClick={() => scrollTo('future')}
        className="flex-1 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        今後の課題
      </button>
    </div>
  );
}
