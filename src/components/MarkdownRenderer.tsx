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
          let id = "";
          if (text.includes('要約') || text.includes('1.')) id = 'summary';
          else if (text.includes('時系列') || text.includes('バトン') || text.includes('2.')) id = 'timeline';
          else if (text.includes('証拠') || text.includes('生引用') || text.includes('3.')) id = 'evidence';
          
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
        blockquote: ({node, children, ...props}) => {
          return (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50/40 px-5 py-4 my-8 rounded-r-xl text-slate-700 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] not-italic [&_p]:before:content-none [&_p]:after:content-none" {...props}>
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
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
