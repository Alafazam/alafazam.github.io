import { useEffect, useState } from 'react';
import type { ContentItem } from '../utils/content';

export function useDraftPosts(): ContentItem[] | null {
  const [draftPosts, setDraftPosts] = useState<ContentItem[] | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let mounted = true;
    import('../utils/draftContent')
      .then(({ draftPosts: loadedPosts }) => {
        if (mounted) setDraftPosts(loadedPosts);
      })
      .catch((error: unknown) => {
        if (mounted) setLoadError(error instanceof Error ? error : new Error(String(error)));
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loadError) throw loadError;
  return draftPosts;
}
