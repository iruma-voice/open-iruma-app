import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import MarkdownRenderer from '../../../../components/MarkdownRenderer';

export function generateStaticParams() {
  const docsDir = path.join(process.cwd(), 'src/data/docs');
  if (!fs.existsSync(docsDir)) return [];
  
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
  return files.map(file => ({
    id: encodeURIComponent(file.replace('.md', ''))
  }));
}

async function getDocContent(id: string) {
  const decodedId = decodeURIComponent(id);
  const docsDir = path.join(process.cwd(), 'src/data/docs');
  
  const filePath1 = path.join(docsDir, `${id}.md`);
  const filePath2 = path.join(docsDir, `${decodedId}.md`);
  
  if (fs.existsSync(filePath1)) return fs.readFileSync(filePath1, 'utf8');
  if (fs.existsSync(filePath2)) return fs.readFileSync(filePath2, 'utf8');
  
  // Robust fallback
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const baseName = file.replace('.md', '');
      if (baseName === id || baseName === decodedId || encodeURIComponent(baseName) === id) {
        return fs.readFileSync(path.join(docsDir, file), 'utf8');
      }
    }
  }
  
  return null;
}

export default async function ReportCardDocPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let content = await getDocContent(params.id);
  
  if (content) {
    // Strip YAML frontmatter (lines between --- at the very start)
    content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  }

  if (!content) {
    return (
      <div className="w-full bg-gray-50 min-h-screen pb-24 font-sans flex flex-col">
        <div className="bg-white px-5 pt-8 pb-4 shadow-sm border-b border-gray-100">
          <Link href="/report-cards" className="inline-flex items-center gap-1 text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform w-fit">
            <ArrowLeft className="w-4 h-4" />
            一覧へ戻る
          </Link>
        </div>
        <div className="p-8 text-center text-gray-500">ドキュメントが見つかりませんでした。</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24 font-sans text-gray-800">
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm border-b border-gray-100 sticky top-0 z-20">
        <Link href="/report-cards" className="inline-flex items-center gap-1 text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform w-fit">
          <ArrowLeft className="w-4 h-4" />
          一覧へ戻る
        </Link>
      </div>
      
      <main className="p-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="prose prose-slate prose-blockquote:not-italic prose-blockquote:font-normal prose-h1:text-xl prose-h2:text-lg prose-h3:text-base max-w-none text-sm text-gray-800 leading-relaxed break-words marker:text-blue-500">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </main>
    </div>
  );
}
