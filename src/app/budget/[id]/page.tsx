import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import AnchorNav from '../../../components/AnchorNav';
import MarkdownRenderer from '../../../components/MarkdownRenderer';

export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), 'src/data/budget_data.json');
  if (!fs.existsSync(dataPath)) return [];
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const budgets = JSON.parse(fileContents);
  return budgets.map((budget: any) => ({
    id: budget.id,
  }));
}

// In Next.js 15 App Router, params is an async promise
export default async function BudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dataPath = path.join(process.cwd(), 'src/data/budget_data.json');
  if (!fs.existsSync(dataPath)) notFound();
  
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const budgets = JSON.parse(fileContents);
  
  const budget = budgets.find((b: any) => b.id === resolvedParams.id);
  
  if (!budget) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-[160px]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 h-[60px] flex items-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center p-2 w-full">
          <Link href="/budget" className="mr-2 flex items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-gray-100 transition-transform active:scale-[0.92]">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <div className="flex-1 min-w-0 pr-4">
            <div className="text-xs font-medium text-blue-600 mb-0.5 truncate">
              予算・財政
            </div>
            <h1 className="text-sm font-bold text-gray-900 truncate">{budget.title}</h1>
          </div>
        </div>
      </div>

      {/* Anchor Navigation */}
      <AnchorNav />

      {/* Content Area */}
      <div className="p-5 prose prose-slate prose-blockquote:not-italic prose-blockquote:font-normal max-w-none text-gray-800 text-base leading-relaxed space-y-6 break-words">
        <MarkdownRenderer content={budget.content || "データがありません。"} />
      </div>
    </main>
  );
}
