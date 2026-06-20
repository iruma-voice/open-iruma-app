'use client';

type Heading = {
  id: string;
  label: string;
  rawText: string;
};

export default function AnchorNav({ headings }: { headings: Heading[] }) {
  const scrollTo = (id: string) => {
    // We decode it because getElementById expects the un-encoded id or we need to encode it in the id attribute.
    // Actually, document.getElementById needs the exact string that is in the id attribute.
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 shadow-sm flex overflow-x-auto">
      {headings.map((heading, index) => (
        <button
          key={heading.id}
          onClick={() => scrollTo(heading.id)}
          className={`flex-none min-w-[80px] px-3 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100 ${
            index === headings.length - 1 ? 'border-r-0' : ''
          }`}
        >
          {heading.label}
        </button>
      ))}
    </div>
  );
}
