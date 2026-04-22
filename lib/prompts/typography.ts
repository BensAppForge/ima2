export type TypographyPrompt = {
  id: string;
  language: "English" | "German" | "French" | "Italian" | "Spanish";
  title: string;
  prompt: string;
};

export const TYPOGRAPHY_PROMPTS: TypographyPrompt[] = [
  {
    id: "en-ui",
    language: "English",
    title: "Product UI mock — small labels",
    prompt:
      "A clean SaaS dashboard screenshot on a light grey background. The sidebar has small crisp labels: 'Overview', 'Pipeline', 'Reports', 'Team Settings'. A card in the centre shows the heading 'Monthly Recurring Revenue' with a sparkline and the subtitle 'Last 30 days vs. previous period'. Use Inter-style sans-serif, 12–14px label sizes, realistic kerning and antialiasing. Photorealistic pixel-level text rendering.",
  },
  {
    id: "de-poster",
    language: "German",
    title: "Berlin concert poster (umlauts + ß)",
    prompt:
      "A vintage Berlin concert poster for a band called 'Grüße aus der Tiefe'. Bold condensed sans-serif headline, subtitle reads 'Straßenfest — Größter Auftritt des Jahres — Freitag, 21. Uhr'. Include a ticket price strip at the bottom: 'Einlass ab 18 — Tickets €24'. Slightly distressed risograph print texture, deep blue and cream palette. Crisp legible umlauts and ß.",
  },
  {
    id: "fr-menu",
    language: "French",
    title: "Parisian bistro menu (accents + ligatures)",
    prompt:
      "A photorealistic Parisian bistro menu printed on cream card stock. Header in elegant serif: 'Chez Margaux — Carte du Jour'. Listed items with prices: 'Œufs mayonnaise — 8€', 'Crème brûlée à la vanille — 9€', 'Bavette à l'échalote — 22€', 'Île flottante — 7€'. Handwritten-style annotation in the margin: 'Accompagné d'une salade'. All accents, œ ligature, and apostrophes must render correctly.",
  },
  {
    id: "it-signage",
    language: "Italian",
    title: "Florence gelato signage",
    prompt:
      "A hand-painted wooden signboard outside a Florentine gelateria. Large script headline: 'Gelateria dell'Arno — dal 1952'. Below, a chalkboard-style list of flavours: 'Pistacchio di Bronte, Stracciatella, Nocciola, Fior di Latte, Amarena'. Footer in small caps: 'Aperto tutti i giorni — Via dei Neri 32'. Rich terracotta and cream palette, realistic chalk texture, accented letters crisp.",
  },
  {
    id: "es-book",
    language: "Spanish",
    title: "Spanish novel cover (ñ, accents, ¿¡)",
    prompt:
      "A minimalist Spanish-language novel cover. Title in large serif: '¿Dónde estará mañana?'. Author below: 'María Ángeles Peña'. Bottom tagline: 'Una novela sobre el mar, la memoria y los años que nos quedan'. Deep indigo background with a single thin line-drawn seagull. Keep all tildes, accents, and inverted question marks pixel-perfect.",
  },
  {
    id: "multi-lang-grid",
    language: "English",
    title: "Multi-language greeting grid",
    prompt:
      "A 2x3 grid poster of postcard-style greetings, one per tile, each with a city landmark silhouette. Tiles: 'HELLO — London', 'GRÜSS DICH — Munich', 'BONJOUR — Paris', 'CIAO — Rome', 'HOLA — Madrid', 'OLÁ — Lisbon'. Use a single consistent modern sans-serif typeface. Each tile uses a different duotone palette but shares grid alignment. Text must be crisp and legibly kerned.",
  },
];
