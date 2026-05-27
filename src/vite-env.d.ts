/// <reference types="vite/client" />

declare module '*&as=picture' {
  /** Output shape of `vite-imagetools` when imported with `?as=picture`.
     Each entry in `sources` is a complete `srcset` string for that format. */
  const picture: {
    sources: Partial<Record<'avif' | 'webp' | 'jpeg' | 'jpg' | 'png', string>>;
    img: { src: string; w: number; h: number };
  };
  export default picture;
}
