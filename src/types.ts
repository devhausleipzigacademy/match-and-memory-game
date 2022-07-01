export type Card = {
	id: string; // id is unique
	name: string;
	image: string;
};

export type Cards = Array<Card>;

export type CardMatchDict = Record<string, { matched: boolean; card: Card }>;

export type Player = {
	name: string;
	order: number;
	score: number;
};
