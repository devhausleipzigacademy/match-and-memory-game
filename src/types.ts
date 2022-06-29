export type Card = {
	id: string; // id is unique
	name: string;
	front: string;
	back: string;
};

export type Cards = Array<Card>;

export type CardDict = Record<string, Card>;

export type Player = {
	name: string;
	score: number;
};
