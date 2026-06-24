import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function QuizShare({ quizId }: { quizId: string }) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ''}${pathname}?quiz=${quizId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const tweetUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check%20out%20this%20quiz%21`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <div className="share-ui glass p-4 flex flex-col items-center gap-3">
      <button className="link-button link-button-primary ripple" onClick={copyToClipboard} aria-live="polite" aria-label="Copy quiz link">
        {copied ? "Link copied!" : "Copy Quiz Link"}
      </button>
      <div className="flex gap-4">
        <Link href={tweetUrl} target="_blank" rel="noopener noreferrer" className="link-button link-button-secondary ripple" aria-label="Share on Twitter">
          {/* Simple Twitter SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M22.46 6c-.77.35-1.5.58-2.33.69a4.07 4.07 0 001.78-2.27c-.81.48-1.71.82-2.67 1.01A4.1 4.1 0 0015.5 4c-2.27 0-4.1 1.85-4.1 4.13 0 .32.03.64.1.94C7.69 8.9 4.07 6.88 1.64 3.86a4.26 4.26 0 00-.55 2.08c0 1.44.73 2.71 1.84 3.45-.68 0-1.33-.2-1.9-.5v.05c0 2.02 1.44 3.71 3.35 4.09-.35.1-.71.15-1.09.15-.27 0-.53-.02-.78-.07.54 1.68 2.1 2.9 3.95 2.93A8.23 8.23 0 012 19.54c-.38 0-.76-.02-1.13-.07a11.66 11.66 0 006.29 1.84c7.55 0 11.68-6.27 11.68-11.71 0-.18-.01-.35-.02-.53.8-.58 1.5-1.3 2.05-2.13z" />
          </svg>
        </Link>
        <Link href={fbUrl} target="_blank" rel="noopener noreferrer" className="link-button link-button-secondary ripple" aria-label="Share on Facebook">
          {/* Simple Facebook SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.44h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
