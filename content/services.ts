export type Service = {
  num: string
  title: string
  description: string
  iconPath: string
}

export const services: Service[] = [
  {
    num: '01',
    title: 'Video Editing',
    description: 'Story-first cuts with pacing and rhythm built to hold attention — from short-form social to long-form films.',
    iconPath: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>',
  },
  {
    num: '02',
    title: 'Motion Graphics',
    description: 'Animated titles, channel intros, lower-thirds and explainer visuals that move with intent.',
    iconPath: '<path d="M5 19V5l7 5 7-5v14"/>',
  },
  {
    num: '03',
    title: 'Content Creation',
    description: 'End-to-end YouTube content — scripting, editing, thumbnail design and channel strategy.',
    iconPath: '<path d="M12 3l7 4v10l-7 4-7-4V7z"/>',
  },
]
