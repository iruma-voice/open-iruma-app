import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronLeft, User } from 'lucide-react';
import { notFound } from 'next/navigation';
import AnchorNav from '../../../components/AnchorNav';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MarkdownRenderer from '../../../components/MarkdownRenderer';

export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), 'src/data/issues_data.json');
  if (!fs.existsSync(dataPath)) return [];
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const issues = JSON.parse(fileContents);
  return issues.map((issue: any) => ({
    id: issue.id,
  }));
}

// In Next.js 15 App Router, params is an async promise
export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dataPath = path.join(process.cwd(), 'src/data/issues_data.json');
  if (!fs.existsSync(dataPath)) notFound();
  
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const issues = JSON.parse(fileContents);
  
  const issue = issues.find((i: any) => i.id === resolvedParams.id);
  
  if (!issue) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-[160px]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 h-[60px] flex items-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center p-2 w-full">
          <Link href="/" className="mr-2 flex items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-gray-100 transition-transform active:scale-[0.92]">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <div className="flex-1 min-w-0 pr-4">
            <div className="text-xs font-medium text-blue-600 mb-0.5 truncate">
              {issue.tags?.[0]?.replace('issue/', '') || '市政課題'}
            </div>
            <h1 className="text-sm font-bold text-gray-900 truncate">{issue.title}</h1>
          </div>
        </div>
      </div>

      {/* Anchor Navigation */}
      <AnchorNav />

      {/* Content Area */}
      <div className="p-5 prose prose-slate prose-blockquote:not-italic prose-blockquote:font-normal max-w-none text-gray-800 text-base leading-relaxed space-y-6 break-words">
        <MarkdownRenderer content={issue.content || "データがありません。"} />
      </div>
    </main>
  );
}
