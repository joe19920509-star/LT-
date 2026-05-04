export type EditionPillar = "时尚" | "新闻" | "财经";

export type EditionItemInternal = {
  kind: "internal";
  slug: string;
  category: string;
  title: string;
  dek: string;
};

export type EditionItemExternal = {
  kind: "external";
  id: string;
  category: EditionPillar;
  title: string;
  dek: string;
};

export type EditionItem = EditionItemInternal | EditionItemExternal;

export type EditionBoardData = {
  headline: string;
  subline: string;
  ordered: EditionItem[];
  tags: string[];
};
