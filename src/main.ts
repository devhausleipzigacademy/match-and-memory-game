import {
	addChildren,
	removeChildren,
	addClasses,
	removeClasses,
	toggleClasses,
	newElement,
	shuffle,
} from "./utils";

import { Card, Cards, CardMatchDict, Player } from "./types";

import { FlipCard } from "./components/flip-card";

import deck from "./cardDeck";

//////////////////////////////////////////
/// Prepare Game Board & Initial State ///
//////////////////////////////////////////

const cardGrid = document.getElementById("card-grid") as HTMLElement;

let selectedCards: Array<HTMLElement> = [];

const players: Array<Player> = [
	{
		name: "Player 1",
		score: 0,
	},
	{
		name: "Player 2",
		score: 0,
	},
];

const scoreBoard = document.getElementById("score-board") as HTMLElement;

function renderScores() {
	removeChildren(scoreBoard);
	console.log(scoreBoard.children);

	const scoreElements: Array<HTMLElement> = players.map((player, index) => {
		const element = newElement("div");
		if (index == playerTurn) {
			element.innerHTML = `<mark>${player.name}: ${player.score}</mark>`;
		} else {
			element.innerHTML = `${player.name}: ${player.score}`;
		}
		return element;
	});

	addChildren(scoreBoard, scoreElements);
}

let playerTurn: number = 0;

function nextTurn() {
	playerTurn = (playerTurn + 1) % players.length;
	renderScores();
}

function increaseScore() {
	players[playerTurn].score++;
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

const subset = deck;

let cardMatchDict: CardMatchDict = {};

for (const card of subset) {
	const id = card.id;
	cardMatchDict[id] = {
		matched: false,
		card: card,
	};
}

const cards: Cards = [...subset, ...subset];
shuffle(cards);

const flipCards = cards.map((card) => {
	const front = newElement("span");
	front.innerText = card.front;

	const back = newElement("span");
	back.innerText = card.back;

	const flipCard = FlipCard([front], [back]);
	flipCard.id = `${card.id}_${Math.floor(Math.random() * 100000)}`;

	return flipCard;
});

renderScores();
placeCards(flipCards);

///////////////////////
/// Event Listeners ///
///////////////////////

document.addEventListener("click", (event) => {
	const target = event.target as HTMLElement;

	if (target.matches(".flip-box *")) {
		const flipCard = target.closest(".flip-box") as HTMLElement;

		const cardId = flipCard.id.split("_")[0];

		const { matched, card } = cardMatchDict[cardId];

		if (!matched && selectedCards.length < 2) {
			selectedCards.push(flipCard);

			toggleClasses(flipCard, ["flipped"]);

			if (selectedCards.length == 2) {
				if (selectedCards[0] == selectedCards[1]) {
					cardMatchDict[cardId].matched = true;
					increaseScore();
				} else {
					for (const element of selectedCards) {
						toggleClasses(element, ["flipped"]);
					}
				}
				selectedCards = [];
				nextTurn();
			}
		}
	}
});
