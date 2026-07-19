import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { User } from 'lucide-react';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h2: ({node, ...props}) => {
          const text = String(props.children);
          const id = encodeURIComponent(text.trim());
          return <h2 id={id} className="scroll-mt-[120px] text-xl font-bold border-b border-gray-200 pb-2 mt-10 mb-4" {...props} />;
        },
        p: ({node, children, ...props}) => {
          const speakerMatchRegex = /^((?:🗣️\s*|🏛️\s*|🏢\s*|市長\s*|委員\s*)?[^：:]+?(?:委員|議員|市長|教育長|部長|課長|幹事|代表|市|回答|質問|答弁|問|答)[：|:]?)$/;
          const speakerRegexString = /^((?:🗣️\s*|🏛️\s*|🏢\s*|市長\s*|委員\s*)?[^：:]+?(?:委員|議員|市長|教育長|部長|課長|幹事|代表|市|回答|質問|答弁|問|答)[：|:])\s*(.*)/;
          
          let isSpeakerBlock = false;
          let speakerName = '';
          let processedChildren = children;

          const cleanQuoteMarks = (textNode: string) => {
            return textNode.replace(/^[\s：:]*[「『]\s*/, '').replace(/\s*[」』]$/, '');
          };

          if (Array.isArray(children)) {
            if (children.length > 0 && typeof children[0] === 'string') {
              const match = children[0].match(speakerRegexString);
              if (match) {
                isSpeakerBlock = true;
                speakerName = match[1].replace(/[：:]$/, '').trim();
                const newChildren = [...children];
                newChildren[0] = cleanQuoteMarks(match[2]);
                processedChildren = newChildren;
              }
            } else if (
              children[0] && 
              typeof children[0] === 'object' && 
              children[0].props && 
              children[0].type === 'strong' &&
              typeof children[0].props.children === 'string'
            ) {
              const strongText = children[0].props.children;
              const match = strongText.match(speakerMatchRegex);
              if (match) {
                isSpeakerBlock = true;
                speakerName = strongText.replace(/[：:]$/, '').trim();
                const newChildren = [...children];
                newChildren.shift(); // Remove the strong tag completely
                if (newChildren.length > 0 && typeof newChildren[0] === 'string') {
                  newChildren[0] = cleanQuoteMarks(newChildren[0]);
                }
                processedChildren = newChildren;
              }
            }
          } else if (typeof children === 'string') {
            const match = children.match(speakerRegexString);
            if (match) {
              isSpeakerBlock = true;
              speakerName = match[1].replace(/[：:]$/, '').trim();
              processedChildren = cleanQuoteMarks(match[2]);
            }
          }
          
          if (isSpeakerBlock && Array.isArray(processedChildren)) {
            const lastIdx = processedChildren.length - 1;
            if (lastIdx >= 0 && typeof processedChildren[lastIdx] === 'string') {
              const newChildren = [...processedChildren];
              newChildren[lastIdx] = (newChildren[lastIdx] as string).replace(/\s*[」』]$/, '');
              processedChildren = newChildren;
            }
          }

          if (isSpeakerBlock) {
            speakerName = speakerName.replace(/^(?:🗣️|🏛️|🏢)\s*/, '');
            
            return (
              <div className="mb-10 first:mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                    <User className="w-[18px] h-[18px]" />
                  </div>
                  <span className="font-bold text-slate-900 text-[17px]">{speakerName}</span>
                </div>
                <p className="text-slate-800 leading-relaxed m-0" {...props}>
                  {processedChildren}
                </p>
              </div>
            );
          }

          return <p className="mb-6 last:mb-0 leading-relaxed" {...props}>{children}</p>;
        },
        blockquote: ({node, ref, children, ...props}: any) => {
          const getChildrenText = (childNode: any): string => {
             if (typeof childNode === 'string') return childNode;
             if (Array.isArray(childNode)) return childNode.map(getChildrenText).join('');
             if (childNode?.props?.children) return getChildrenText(childNode.props.children);
             return '';
          };
          
          const textContent = getChildrenText(children);
          
          let alertType = '';
          if (textContent.includes('[!TIP]')) alertType = 'tip';
          else if (textContent.includes('[!WARNING]')) alertType = 'warning';
          else if (textContent.includes('[!IMPORTANT]')) alertType = 'important';
          else if (textContent.includes('[!NOTE]')) alertType = 'note';
          else if (textContent.includes('[!CAUTION]')) alertType = 'caution';

          if (alertType) {
            let bgColor = 'bg-blue-50/40';
            let borderColor = 'border-blue-500';
            let icon = '💡';
            let title = 'TIP';

            if (alertType === 'warning' || alertType === 'caution') {
               bgColor = 'bg-yellow-50/50';
               borderColor = 'border-yellow-500';
               icon = '⚠️';
               title = alertType === 'warning' ? 'WARNING' : 'CAUTION';
            } else if (alertType === 'important') {
               bgColor = 'bg-purple-50/40';
               borderColor = 'border-purple-500';
               icon = '✨';
               title = 'IMPORTANT';
            } else if (alertType === 'note') {
               bgColor = 'bg-slate-50';
               borderColor = 'border-slate-500';
               icon = 'ℹ️';
               title = 'NOTE';
            }

            const cleanAlertText = (child: any): any => {
              if (typeof child === 'string') {
                 return child.replace(/\[!(?:TIP|WARNING|IMPORTANT|NOTE|CAUTION)\]/g, '').trimStart();
              }
              if (Array.isArray(child)) {
                 return child.map(cleanAlertText);
              }
              if (child && child.props && child.props.children) {
                 return {
                    ...child,
                    props: {
                       ...child.props,
                       children: cleanAlertText(child.props.children)
                    }
                 };
              }
              return child;
            };

            const cleanedChildren = cleanAlertText(children);

            return (
              <div className={`border-l-4 ${borderColor} ${bgColor} px-5 py-4 my-8 rounded-r-xl text-slate-800 shadow-sm [&_p]:before:content-none [&_p]:after:content-none`} {...props}>
                 <div className="font-bold flex items-center gap-2 mb-2">
                    <span>{icon}</span> {title}
                 </div>
                 <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                   {cleanedChildren}
                 </div>
              </div>
            );
          }

          return (
            <blockquote className="border-l-4 border-slate-300 bg-slate-50/50 px-5 py-4 my-8 rounded-r-xl text-slate-700 shadow-sm not-italic [&_p]:before:content-none [&_p]:after:content-none" {...props}>
              {children}
            </blockquote>
          );
        },
        img: ({node, ...props}) => {
          return (
            <span className="block my-8">
              <img 
                {...props} 
                className="max-w-full h-auto rounded-xl shadow-md border border-slate-200" 
                loading="lazy"
              />
            </span>
          );
        },
        table: ({node, children, ...props}: any) => {
          let headers: string[] = [];
          if (node && node.children) {
            const extractText = (n: any): string => {
              if (!n) return '';
              if (n.type === 'text') return n.value || '';
              if (n.children) return n.children.map(extractText).join('');
              return '';
            };
            const theadNode = node.children.find((c: any) => c.tagName === 'thead');
            if (theadNode) {
              const trNode = theadNode.children.find((c: any) => c.tagName === 'tr');
              if (trNode) {
                headers = trNode.children
                  .filter((c: any) => c.tagName === 'th' || c.tagName === 'td')
                  .map((c: any) => extractText(c).trim());
              }
            }
          }

          let rows: React.ReactNode[][] = [];
          const childrenArray = React.Children.toArray(children);
          const tbodyElem = childrenArray.find((c: any) => React.isValidElement<{ node?: { tagName?: string } }>(c) && (c.props.node?.tagName === 'tbody' || c.type === 'tbody')) as React.ReactElement<any>;
          
          if (tbodyElem && tbodyElem.props && tbodyElem.props.children) {
            const trElems = React.Children.toArray(tbodyElem.props.children).filter((c: any) => React.isValidElement<{ node?: { tagName?: string } }>(c) && (c.props.node?.tagName === 'tr' || c.type === 'tr'));
            rows = trElems.map((tr: any) => {
              return React.Children.toArray(tr.props.children)
                .filter((c: any) => React.isValidElement(c))
                .map((td: any) => td.props.children);
            });
          }

          const colCount = headers.length;
          const hasAmountCol = headers.some(h => h.includes('金額') || h.includes('値上げ') || h.includes('予算') || h.includes('費用') || h.includes('負担'));
          const isTimelineTable = headers[0] === '年度';

          if (colCount >= 4 && !isTimelineTable) {
            return (
              <div className="space-y-6 my-8 font-sans">
                {rows.map((rowCells, rIdx) => {
                   const titleCell = rowCells[0];
                   const policyType = headers[4] ? rowCells[4] : '';
                   const sourceNode = headers[5] ? rowCells[5] : '';
                   
                   return (
                      <div key={rIdx} className="border-2 border-slate-300 p-4 bg-white relative space-y-4 shadow-sm rounded-sm">
                        <div className="flex justify-between items-baseline border-b border-dashed border-slate-300 pb-2 gap-2">
                          <h4 className="text-base font-bold text-slate-900 leading-snug">{titleCell}</h4>
                          {policyType && (
                            <span className="font-mono text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                              {policyType}
                            </span>
                          )}
                        </div>
                        <div className="space-y-3 text-xs">
                          {headers.slice(1).map((header, cIdx) => {
                             const cellData = rowCells[cIdx + 1];
                             if (!cellData || (Array.isArray(cellData) && cellData.length === 0) || cellData === '─') return null;
                             if (header === '種類' || header === '反対の種類' || header === '根拠' || header === '根拠（議事録）') return null;
                             
                             let badgeBg = "bg-slate-100";
                             let badgeText = "text-slate-700";
                             if (header.includes('賛成')) { badgeBg = "bg-cyan-50"; badgeText = "text-cyan-900"; }
                             else if (header.includes('反対') || header.includes('懸念')) { badgeBg = "bg-red-50"; badgeText = "text-red-900"; }
                             else if (header.includes('要望') || header.includes('警告') || header.includes('条件')) { badgeBg = "bg-amber-50"; badgeText = "text-amber-800"; }

                             return (
                               <div key={cIdx} className="grid grid-cols-[60px_1fr] gap-2 border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                                 <span className={`font-bold px-1 text-center self-start rounded-sm ${badgeBg} ${badgeText} leading-snug`}>
                                   {header.replace(/（.*?）/g, '').slice(0, 4)}
                                 </span>
                                 <div className="text-slate-700 leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_span]:!bg-transparent [&_span]:!border-none [&_span]:!p-0 [&_span]:!text-current">
                                   {cellData}
                                 </div>
                               </div>
                             );
                          })}
                        </div>
                        {sourceNode && (
                           <div className="text-right pt-2 border-t border-slate-100 mt-2">
                             <div className="font-mono text-[10px] text-slate-400 [&_a]:text-slate-400 [&_span]:!bg-transparent [&_span]:!border-none [&_span]:!p-0 [&_span]:!text-slate-400 inline-block">
                               {sourceNode}
                             </div>
                           </div>
                        )}
                      </div>
                   );
                })}
              </div>
            );
          } else if (colCount >= 2 && colCount <= 3 && hasAmountCol) {
            return (
              <div className="divide-y divide-dashed divide-slate-200 font-sans text-sm my-8 border-y-2 border-slate-300 bg-white p-4 shadow-sm rounded-sm">
                {rows.map((rowCells, rIdx) => {
                   const itemTitle = rowCells[0];
                   const amount = rowCells[1];
                   const desc = rowCells[2];
                   
                   return (
                      <div key={rIdx} className="py-3 space-y-1.5 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start gap-4 font-bold leading-snug">
                          <span className="text-slate-950 flex-1">{itemTitle}</span>
                          <span className="font-mono text-slate-900 text-right">{amount}</span>
                        </div>
                        {desc && (
                           <div className="text-[13px] text-slate-500 leading-relaxed m-0 [&_a]:text-blue-600 [&_a]:underline">
                             {desc}
                           </div>
                        )}
                      </div>
                   );
                })}
              </div>
            );
          } else {
            return (
              <div className="my-8 overflow-x-auto border-2 border-slate-300 rounded-sm bg-white shadow-sm font-sans">
                <table className="w-full text-sm text-left border-collapse" {...props}>
                  {children}
                </table>
              </div>
            );
          }
        },
        th: ({node, ...props}) => <th className="px-4 py-3 bg-slate-100 border-b-2 border-slate-300 font-bold text-slate-800 whitespace-nowrap" {...props} />,
        td: ({node, ...props}) => <td className="px-4 py-3 border-b border-slate-200 text-slate-700" {...props} />
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
