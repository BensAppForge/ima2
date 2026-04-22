export type MangaPreset = {
  id: string;
  title: string;
  description: string;
  panels: string[];
};

export const MANGA_PRESETS: MangaPreset[] = [
  {
    id: "cafe-detective",
    title: "The café detective — 4 panel mystery",
    description:
      "A simple 4-panel story. Upload a reference image of a character. The same character appears in every panel with consistent face, hair, and outfit.",
    panels: [
      "Panel 1 of 4. Wide establishing shot. The character from image 1 sits alone at a small café table by a rain-streaked window, stirring coffee. Dim warm interior, cool blue light outside. Style: inked black-and-white manga with fine hatching. Caption box top-left: 'Tuesday. 4:17pm.'",
      "Panel 2 of 4. Medium shot. The same character from image 1 leans forward, eyes narrowed, examining a folded note on the table. Keep the same face, hair, and outfit exactly. Speech bubble above reads: 'So that's what she meant.'",
      "Panel 3 of 4. Close-up of the note itself, handwritten: 'If you read this, I was already gone — M.' Slight coffee stain in the corner. No character in frame. Same inked manga style.",
      "Panel 4 of 4. The same character from image 1, now standing and pulling on a coat, silhouetted against the café doorway. Rain outside. Determined expression — same face as previous panels. Caption bottom-right: 'Some cases find you.'",
    ],
  },
  {
    id: "rooftop-chase",
    title: "Rooftop chase — 3 panel action",
    description: "A short action sequence across three panels.",
    panels: [
      "Panel 1 of 3. The character from image 1 crouches on a neon-lit Tokyo rooftop at night, looking out over the skyline. Dynamic low angle. Consistent face, hair, outfit. Inked manga style with heavy blacks and sharp speed lines.",
      "Panel 2 of 3. Same character from image 1 mid-leap between two rooftops, limbs extended, coat flaring. Exact same face and outfit as panel 1. Strong motion blur and speed lines. Distant neon signs.",
      "Panel 3 of 3. Same character from image 1 landing in a crouch on the far rooftop, one hand touching down. Keep the same face, hair, outfit. Rain beginning to fall. Final caption: 'Halfway there.'",
    ],
  },
];
