import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MarkdownRenderer from '../../components/MarkdownRenderer';

export default function AboutPage() {
  const dataPath = path.join(process.cwd(), 'src/data/about.md');
  let content = "";
  try {
    content = fs.readFileSync(dataPath, 'utf8');
  } catch (e) {
    content = "コンテンツが見つかりません。";
  }

  return (
    <main className="p-5 pt-4 min-h-screen bg-white pb-24">
      <div className="prose prose-slate prose-blockquote:not-italic prose-blockquote:font-normal max-w-none text-gray-800 text-base leading-relaxed space-y-6 break-words">
        <MarkdownRenderer content={content} />
      </div>
    </main>
  );
}
