interface MarkdownContentProps {
  html: string;
}

// Renders pre-compiled Markdown HTML with Tailwind Typography styling.
const MarkdownContent = ({ html }: MarkdownContentProps) => (
  <div
    className="prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:border prose-img:border-border prose-blockquote:border-l-border prose-code:font-medium"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default MarkdownContent;
