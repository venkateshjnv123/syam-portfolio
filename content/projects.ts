// ─────────────────────────────────────────────────────────────────────────────
// MONTHLY UPDATE FILE
// Edit this file each month to update your work section.
// Replace videoUrl with actual YouTube / Vimeo links.
// The first project with feature: true becomes the big card.
// ─────────────────────────────────────────────────────────────────────────────

export type Project = {
  id: string
  title: string
  category: string
  duration: string     // e.g. "02:14"
  timecode: string     // e.g. "TC 00:02:14"
  tags?: string[]      // only shows on the feature card
  videoUrl: string     // YouTube or Vimeo URL
  thumb?: string       // poster image (in /public)
  feature?: boolean    // true = large card (only first one is used)
}

export const projects: Project[] = [
  {
    id: 'cinematic-documentary',
    title: 'Cinematic Documentary',
    category: 'Documentary',
    duration: '—',
    timecode: 'TC 00:00:00',
    tags: ['Edit', 'Color', 'Sound'],
    videoUrl: 'https://www.youtube.com/watch?v=i5e4NvzTAb4',
    thumb: '/syamimage.jpeg',
    feature: true,
  },
  {
    id: 'how-to-start-a-business',
    title: 'How to Start a Business',
    category: 'Brand',
    duration: '—',
    timecode: 'TC 00:00:00',
    videoUrl: 'https://vimeo.com/1198088730',
    thumb: '/syamimage.jpeg',
  },
  {
    id: 'google-my-business',
    title: 'Google My Business',
    category: 'Brand',
    duration: '—',
    timecode: 'TC 00:00:00',
    videoUrl: 'https://vimeo.com/1198088732',
    thumb: '/syamimage.jpeg',
  },
  {
    id: 'aesthetic-video',
    title: 'Aesthetic Video',
    category: 'Social',
    duration: '—',
    timecode: 'TC 00:00:00',
    videoUrl: 'https://vimeo.com/1160648297',
    thumb: '/syamimage.jpeg',
  },
  {
    id: 'cool-cuts',
    title: 'Cool Cuts',
    category: 'Social',
    duration: '—',
    timecode: 'TC 00:00:00',
    videoUrl: 'https://vimeo.com/1160648700',
    thumb: '/syamimage.jpeg',
  },
]
