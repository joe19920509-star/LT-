import ReactMarkdown from "react-markdown";

export function MarkdownBody({
  content,
  className = "article-md",
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
