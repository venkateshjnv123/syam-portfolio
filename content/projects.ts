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
  feature?: boolean    // true = large card (only first one is used)
}

export const projects: Project[] = [
  {
    id: 'brand-film-01',
    title: 'Cinematic Brand Film',
    category: 'Brand Film',
    duration: '02:30',
    timecode: 'TC 00:02:30',
    tags: ['Edit', 'Color', 'Sound'],
    videoUrl: 'https://youtube.com/@syamtalks?si=T4K062JFcuKp29oz',
    feature: true,
  },
  {
    id: 'product-reveal',
    title: 'Product Reveal — Title Sequence',
    category: 'Motion Graphics',
    duration: '00:45',
    timecode: 'TC 00:00:45',
    videoUrl: 'https://youtube.com/@syamtalks?si=T4K062JFcuKp29oz',
  },
  {
    id: 'reel-series',
    title: 'Social Media Reel Series',
    category: 'Social',
    duration: '00:30',
    timecode: 'TC 00:00:30',
    videoUrl: 'https://youtube.com/@syamtalks?si=T4K062JFcuKp29oz',
  },
  {
    id: 'yt-intro',
    title: 'YouTube Channel Intro Pack',
    category: 'Motion Graphics',
    duration: '00:15',
    timecode: 'TC 00:00:15',
    videoUrl: 'https://youtube.com/@syamtalks?si=T4K062JFcuKp29oz',
  },
  {
    id: 'event-highlight',
    title: 'Corporate Event Highlights',
    category: 'Event Film',
    duration: '03:00',
    timecode: 'TC 00:03:00',
    videoUrl: 'https://youtube.com/@syamtalks?si=T4K062JFcuKp29oz',
  },
  {
    id: 'content-pkg',
    title: 'Creator Content Package',
    category: 'Social',
    duration: '01:00',
    timecode: 'TC 00:01:00',
    videoUrl: 'https://youtube.com/@syamtalks?si=T4K062JFcuKp29oz',
  },
]
