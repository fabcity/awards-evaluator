'use client';
import { useState } from 'react';
import type { SupportingMediaItem } from '@/lib/types';

export function MediaCarousel({ media }: { media: SupportingMediaItem[] }) {
  const [idx, setIdx] = useState(0);
  if (media.length === 0) return null;

  const go = (i: number) => setIdx((i + media.length) % media.length);
  const cur = media[idx];

  return (
    <>
      <div className="border border-dark bg-dark relative mb-1">
        <div className="aspect-[16/10] relative overflow-hidden">
          {media.map((m, i) => (
            <div
              key={m.id}
              className={
                'absolute inset-0 bg-cover bg-center transition-opacity duration-300 ' +
                (i === idx ? 'opacity-100' : 'opacity-0')
              }
              style={{ backgroundImage: `url('${m.thumbnailUrl || m.url}')` }}
            />
          ))}
          <button
            onClick={() => go(idx - 1)}
            aria-label="Previous"
            className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 bg-black/70 hover:bg-red text-white flex items-center justify-center text-lg font-bold z-10"
          >
            ‹
          </button>
          <button
            onClick={() => go(idx + 1)}
            aria-label="Next"
            className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 bg-black/70 hover:bg-red text-white flex items-center justify-center text-lg font-bold z-10"
          >
            ›
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3.5 text-white text-[12px] flex justify-between items-center">
            <span className="font-bold truncate">{cur.filename}</span>
            <span className="opacity-80 tabular-nums shrink-0 ml-2">
              {idx + 1} / {media.length}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {media.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setIdx(i)}
            title={m.filename}
            className={
              'flex-none w-[100px] aspect-[16/10] bg-cover bg-center border border-dark transition-opacity ' +
              (i === idx
                ? 'opacity-100 outline outline-2 outline-red -outline-offset-2'
                : 'opacity-55 hover:opacity-100')
            }
            style={{ backgroundImage: `url('${m.thumbnailUrl || m.url}')` }}
          />
        ))}
      </div>
    </>
  );
}
