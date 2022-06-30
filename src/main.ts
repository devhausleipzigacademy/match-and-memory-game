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

// Test area

// Round Counter

let roundsPlayed: number = 0;
const roundBoard = document.getElementById("round-board") as HTMLElement;

function roundCounter() {
	roundsPlayed++;
	console.log(roundsPlayed);

	removeChildren(roundBoard);
	const element: HTMLElement = newElement("div");
	element.innerHTML = `Round: ${roundsPlayed}`;

	addChildren(roundBoard, [element]);
	// check if all players have had a turn and if so increase RoundCounter
}

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
	{
		name: "Player 3",
		score: 0,
	},
	{
		name: "Player 4",
		score: 0,
	},
];

function renderScores() {
	const playerScoreBoard = document.querySelector(
		`#player${playerTurn + 1} .player-score`
	) as HTMLElement;

	console.log("render scores func called");

	removeChildren(playerScoreBoard);
	const scoreElement = newElement("p");

	const activePlayer = players[playerTurn];
	console.log(activePlayer);

	scoreElement.innerHTML = `${players[playerTurn].score}`;

	addChildren(playerScoreBoard, [scoreElement]);
}

let playerTurn: number = 0;

function nextTurn() {
	const prevPlayerTurn: number = playerTurn;
	const nextPlayerTurn: number = (playerTurn + 1) % players.length;
	if (nextPlayerTurn == 0) roundCounter();
	playerTurn = nextPlayerTurn;
	renderScores();
	console.log("next turn func called");

	// change color of player's container indicating who's turn it is
	const prevPlayerElement = document.querySelector(
		`#player${prevPlayerTurn + 1}`
	) as HTMLElement;
	const nextPlayerElement = document.getElementById(
		`player${nextPlayerTurn + 1}`
	) as HTMLElement;
	toggleClasses(prevPlayerElement, ["border-indigo-800", "border-yellow-400"]);
	toggleClasses(nextPlayerElement, ["border-indigo-800", "border-yellow-400"]);
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

	const back = newElement("span");
	back.innerText = card.back;

	const flipCard = FlipCard([front], [back]);
	flipCard.id = `${card.id}_${Math.floor(Math.random() * 100000)}`;

	return flipCard;
});

renderScores();
placeCards(flipCards);
roundCounter();

// this could later move to initiate game state function
const firstPlayer = document.querySelector(`#player1`) as HTMLElement;
toggleClasses(firstPlayer, ["border-indigo-800", "border-yellow-400"]);

let frozen: boolean = false;

///////////////////////
/// Event Listeners ///
///////////////////////

document.addEventListener("click", (event) => {
	if (frozen == true) {
		return;
	}

	const target = event.target as HTMLElement;

	if (target.matches(".flip-box *")) {
		const flipCard = target.closest(".flip-box") as HTMLElement;

		const cardId = flipCard.id.split("_")[0];

		const { matched, card } = cardMatchDict[cardId];

		if (!matched && selectedCards.length < 2) {
			if (selectedCards.length == 1) {
				const selectedElement1 = selectedCards[0];
				if (selectedElement1.id == flipCard.id) {
					return;
				}
			}

			selectedCards.push(flipCard);
			toggleClasses(flipCard, ["flipped"]);

			if (selectedCards.length == 2) {
				const selectedElement1 = selectedCards[0];
				const selectedElement2 = selectedCards[1];

				const cardId1 = selectedElement1.id.split("_")[0];
				const cardId2 = selectedElement2.id.split("_")[0];

				if (cardId1 == cardId2 && selectedElement1.id != selectedElement2.id) {
					cardMatchDict[cardId].matched = true;
					increaseScore();
					selectedCards = [];
					nextTurn();
				} else {
					frozen = true;

					setTimeout(() => {
						frozen = false;

						for (const element of selectedCards) {
							toggleClasses(element, ["flipped"]);
						}

						selectedCards = [];
						nextTurn();
					}, 1500);
				}
			}
		}
	}
});
