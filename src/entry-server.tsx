import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import { StaticRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { AppShell, routerBasename } from './App';

export interface RenderResult {
  /** Markup for <div id="root">, complete with React's hydration markers. */
  html: string;
  /** Head tags this route set through react-helmet, already stringified. */
  head: { title: string; meta: string; link: string };
}

/**
 * Renders one route to HTML at build time.
 *
 * `renderToPipeableStream` rather than `renderToString`: the app code-splits its
 * routes with React.lazy, and only the streaming renderer can suspend and wait
 * for those chunks. `onAllReady` holds the output until every boundary has
 * resolved, which is what a static build wants — no fallbacks in the markup.
 *
 * This is also the whole point of the exercise: React's own renderer emits the
 * hydration markers a serialised DOM cannot have — `<!--$-->` around Suspense
 * boundaries and `<!-- -->` between adjacent text nodes — so hydrateRoot in
 * src/main.tsx can actually adopt this markup instead of discarding it.
 */
export function render(url: string): Promise<RenderResult> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });

    let didError = false;
    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter basename={routerBasename} location={url}>
          <AppShell />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          sink.on('finish', () => {
            if (didError) return;
            // Helmet collects through render side effects, so it can only be
            // read once rendering has finished.
            const helmet = Helmet.renderStatic();
            resolve({
              html: Buffer.concat(chunks).toString('utf8'),
              head: {
                title: helmet.title.toString(),
                meta: helmet.meta.toString(),
                link: helmet.link.toString(),
              },
            });
          });
          pipe(sink);
        },
        onError(error) {
          didError = true;
          reject(error);
        },
      }
    );

    // A route that never settles should fail the build, not hang it.
    setTimeout(() => {
      abort();
      reject(new Error(`Timed out rendering ${url}`));
    }, 20000).unref();
  });
}
