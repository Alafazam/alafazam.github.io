interface MarkdownContentProps {
  html: string;
}

// Renders pre-compiled Markdown HTML with Tailwind Typography styling.
const MarkdownContent = ({ html }: MarkdownContentProps) => (
  <div
    className="prose prose-slate dark:prose-invert max-w-none prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default MarkdownContent;
