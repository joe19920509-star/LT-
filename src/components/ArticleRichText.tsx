function splitParagraphs(body: string) {
  return body
    .trim()
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** 极简 **粗体** 解析，避免引入 markdown 依赖 */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\*\*(.+)\*\*$/);
        if (m) return <strong key={i}>{m[1]}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ArticleRichText({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      {paragraphs.map((p, idx) => (
        <p key={idx}>
          <Inline text={p} />
        </p>
      ))}
    </div>
  );
}

export { splitParagraphs };
