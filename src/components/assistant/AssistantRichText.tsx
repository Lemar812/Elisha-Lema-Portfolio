import { Fragment } from 'react';

interface AssistantRichTextProps {
    content: string;
}

type Block =
    | { type: 'paragraph'; lines: string[] }
    | { type: 'bulletList'; items: string[] }
    | { type: 'orderedList'; items: string[] };

function renderInline(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
                <strong key={`${part}-${index}`} className="font-semibold text-white">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    });
}

function parseBlocks(content: string): Block[] {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const blocks: Block[] = [];
    let paragraphBuffer: string[] = [];
    let bulletBuffer: string[] = [];
    let orderedBuffer: string[] = [];

    const flushParagraph = () => {
        if (paragraphBuffer.length) {
            blocks.push({ type: 'paragraph', lines: paragraphBuffer });
            paragraphBuffer = [];
        }
    };

    const flushBullets = () => {
        if (bulletBuffer.length) {
            blocks.push({ type: 'bulletList', items: bulletBuffer });
            bulletBuffer = [];
        }
    };

    const flushOrdered = () => {
        if (orderedBuffer.length) {
            blocks.push({ type: 'orderedList', items: orderedBuffer });
            orderedBuffer = [];
        }
    };

    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (!line) {
            flushParagraph();
            flushBullets();
            flushOrdered();
            continue;
        }

        const bulletMatch = line.match(/^[-*]\s+(.+)$/);
        if (bulletMatch) {
            flushParagraph();
            flushOrdered();
            bulletBuffer.push(bulletMatch[1]);
            continue;
        }

        const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
        if (orderedMatch) {
            flushParagraph();
            flushBullets();
            orderedBuffer.push(orderedMatch[1]);
            continue;
        }

        flushBullets();
        flushOrdered();
        paragraphBuffer.push(line);
    }

    flushParagraph();
    flushBullets();
    flushOrdered();

    return blocks;
}

export default function AssistantRichText({ content }: AssistantRichTextProps) {
    const blocks = parseBlocks(content);

    return (
        <div className="space-y-3 text-[13px] leading-6 text-text-primary">
            {blocks.map((block, index) => {
                if (block.type === 'bulletList') {
                    return (
                        <ul key={`block-${index}`} className="space-y-1.5 pl-4 text-text-primary marker:text-secondary/90 list-disc">
                            {block.items.map((item, itemIndex) => (
                                <li key={`bullet-${itemIndex}`} className="pl-1">
                                    {renderInline(item)}
                                </li>
                            ))}
                        </ul>
                    );
                }

                if (block.type === 'orderedList') {
                    return (
                        <ol key={`block-${index}`} className="space-y-1.5 pl-4 text-text-primary marker:font-semibold marker:text-primary/90 list-decimal">
                            {block.items.map((item, itemIndex) => (
                                <li key={`ordered-${itemIndex}`} className="pl-1">
                                    {renderInline(item)}
                                </li>
                            ))}
                        </ol>
                    );
                }

                return (
                    <p key={`block-${index}`} className="break-words text-[13px] leading-6 text-text-primary">
                        {block.lines.map((line, lineIndex) => (
                            <Fragment key={`line-${lineIndex}`}>
                                {lineIndex > 0 && <br />}
                                {renderInline(line)}
                            </Fragment>
                        ))}
                    </p>
                );
            })}
        </div>
    );
}
