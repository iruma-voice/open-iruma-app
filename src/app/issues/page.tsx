import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default function Home() {
  const dataPath = path.join(process.cwd(), 'src/data/issues_data.json');
  let issues = [];
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    issues = JSON.parse(fileContents);
  } catch (e) {
    console.error("Failed to load issues data", e);
  }

  return (
    <main className="p-4 pt-0">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md pt-4 pb-4 mb-4 border-b border-gray-100/50">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">地域課題と議論</h1>
        <p className="text-sm text-gray-500 mt-1">入間市の「いま」が3分でわかる</p>
      </header>

      <div className="flex flex-col gap-4">
        {issues.map((issue: any) => (
          <Link href={`/issues/${issue.id}`} key={issue.id}>
            <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer group">
              <div className="flex flex-wrap gap-2 mb-2">
                {issue.tags?.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    {tag.replace('issue/', '')}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                {issue.title}
              </h2>
              {issue.date && (
                <p className="text-xs text-gray-400 mt-2">{issue.date}</p>
              )}
            </div>
          </Link>
        ))}
        {issues.length === 0 && (
          <p className="text-gray-500">課題データが見つかりません。</p>
        )}
      </div>
    </main>
  );
}
