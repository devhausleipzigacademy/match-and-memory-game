import {
	addChildren,
	addClasses,
	removeClasses,
	toggleClasses,
	newElement,
} from "./utils";

import { Card, Cards, CardDict, Player } from "./types";

import { FlipBox } from "./components/flipbox";

import deck from "./cardDeck";

//////////////////////////////////////////
/// Prepare Game Board & Initial State ///
//////////////////////////////////////////

const cardGrid = document.getElementById("card-grid") as HTMLElement;

let selectedCards = [];

const players: Array<Player> = [];

let playerTurn: number = 0;

function nextTurn() {
	playerTurn = (playerTurn + 1) % players.length;
}

function placeCards(cards: Array<any>): void {
	// transform cards data into appropriate elements
	const cardElements = cards.map((card) => {
		const element = newElement("div", ["grid-cell", "bg-blue-400"]);
		addChildren(element, [card]);
		return element;
	});

	addChildren(cardGrid, cardElements);
}

const cards: Cards = [...deck, ...deck].sort(() => 0.5 - Math.random());

console.log(cards);

const flipCards = cards.map((card) => {
	const front = newElement("span");
	front.innerText = card.front;

	const back = newElement("span");
	back.innerText = card.back;

	return FlipBox([front], [back]);
});

placeCards(flipCards);

///////////////////////
/// Event Listeners ///
///////////////////////

document.addEventListener("click", (event) => {
	const target = event.target as HTMLElement;

	if (target.matches(".flip-box *")) {
		const flipBox = target.closest(".flip-box") as HTMLElement;
		toggleClasses(flipBox, ["flipped"]);
	}
});
