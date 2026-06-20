import fs from 'fs';
import path from 'path';
import Link from 'next/link';
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

  const contentStr = budget.content || "データがありません。";
  
  // Extract H2 headings dynamically
  const headingRegex = /^##\s+(.*)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(contentStr)) !== null) {
    const rawText = match[1].trim();
    // Clean label (e.g. "【要約：3分でわかる】" -> "要約")
    let label = rawText.replace(/[【】]/g, '');
    if (label.includes('：')) {
      label = label.split('：')[0].trim();
    }
    const id = encodeURIComponent(rawText);
    headings.push({ id, label, rawText });
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5] pb-[160px] font-sans text-slate-900">
      {/* 帳簿ヘッダー（ミシン目の区切り） */}
      <div className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-dashed border-slate-300 h-[64px] flex items-center">
        <div className="flex items-center px-4 w-full justify-between">
          <Link href="/budget" className="mr-3 flex items-center justify-center w-9 h-9 border border-slate-300 rounded-none bg-white hover:bg-slate-50 transition-all duration-150 active:scale-[0.96]">
            <span className="text-xs font-mono font-bold text-slate-800">◀</span>
          </Link>
          <div className="flex-1 min-w-0 pr-2">
            <div className="text-[9px] font-mono font-bold text-blue-700 tracking-wider mb-0.5 uppercase">
              Ledger // Record
            </div>
            <h1 className="text-xs font-bold text-slate-900 truncate">{budget.title}</h1>
          </div>
        </div>
      </div>

      {/* Anchor Navigation */}
      {headings.length > 0 && <AnchorNav headings={headings} />}

      {/* コンテンツエリア（ルーズリーフ・ノートの1ページを表現した白いフラットな紙） */}
      <div className="px-4 mt-6">
        <div className="bg-white border border-slate-300 rounded-none p-5 md:p-8 space-y-6 break-words">
          <MarkdownRenderer content={contentStr} />
        </div>
      </div>
    </main>
  );
}
