export const REVEAL_MEDIA: Record<'boy' | 'girl', string> = {
  boy: '/boy.mp4',
  girl: '/girl.mp4',
};

export type RevealGender = 'boy' | 'girl';

export function pickRevealMedia(gender: RevealGender | null | undefined) {
  // if (gender === 'boy') return REVEAL_MEDIA.boy;
  return '/girl.mp4';
}
