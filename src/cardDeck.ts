import { Cards } from "./types";

let count = 0;
const deck: Cards = Array.from(Array(9), () => {
	const cardObj = {
		id: `id${count}`,
		name: `Example${count}`,
		front: `front${count}`,
		back: `back${count}`,
	};
	count++;
	return cardObj;
});

export default deck;
