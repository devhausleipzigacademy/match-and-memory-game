import {
	addChildren,
	removeChildren,
	toggleClasses,
	newElement,
	shuffle,
} from "./utils";

import { Cards, CardMatchDict, Player } from "./types";

import { FlipCard } from "./components/flip-card";

import deck from "./cardDeck";
import { Input, Stringifier } from "postcss";

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

let sequenceLength = 2;

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

	renderScores();

	playerTurn = nextPlayerTurn;

	// change color of player's container indicating who's turn it is
	const prevPlayerElement = document.querySelector(
		`#player${prevPlayerTurn + 1}`
	) as HTMLElement;
	const nextPlayerElement = document.getElementById(
		`player${nextPlayerTurn + 1}`
	) as HTMLElement;

	console.log(prevPlayerElement, nextPlayerElement);

	toggleClasses(prevPlayerElement, ["active-player", "inactive-player"]);

	toggleClasses(nextPlayerElement, ["active-player", "inactive-player"]);
}

function increaseScore() {
	players[playerTurn].score++;
}

function placeCards(cards: Array<HTMLElement>): void {
	const cardElements = cards.map((card) => {
		const element = newElement("div", [
			"grid-cell",
			"bg-blue-400",
			"rounded-md",
			"shadow-md",
			"w-[100px]",
			"h-[100px]",
			"border",
			"border-slate-700",
		]);
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

const imgs = [
	"https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YW5pbWFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1200&q=60",
	"https://images.unsplash.com/photo-1484406566174-9da000fda645?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80",
	"https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80",
	"https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
	"https://images.unsplash.com/photo-1555169062-013468b47731?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
	"https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80",
	"https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2352&q=80",
	"https://images.unsplash.com/photo-1497752531616-c3afd9760a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
	"https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
];

const flipCards = cards.map((card) => {
	const front = newElement("span");

	const back = newElement("img", [
		"w-full",
		"h-full",
		"object-cover",
		"rounded-md",
	]);
	console.log(card.id);
	//@ts-ignore
	back.src = imgs[card.id.charAt(2)];

	const flipCard = FlipCard([front], [back]);
	flipCard.id = `${card.id}_${Math.floor(Math.random() * 100000)}`;

	return flipCard;
});

renderScores();
placeCards(flipCards);
roundCounter();

// this could later move to initiate game state function
const firstPlayer = document.querySelector(`#player1`) as HTMLElement;
toggleClasses(firstPlayer, ["active-player", "inactive-player"]);

let frozen: boolean = false;

function resetAfterMatch(cardId) {
	cardMatchDict[cardId].matched = true;
	increaseScore();
	selectedCards = [];
	nextTurn();
}

function resetAfterNoMatch() {
	for (const element of selectedCards) {
		toggleClasses(element, ["flipped"]);
	}

	selectedCards = [];
	nextTurn();
}

function binaryIdMatch(ids: Array<string>) {
	return ids[0] == ids[1];
}

let matchPredicate = binaryIdMatch;

///////////////////////
/// Event Listeners ///
///////////////////////

document.addEventListener("click", (event) => {
	if (frozen == true) {
		return;
	}

	const target = event.target as HTMLElement;

	if (target.matches(".flip-box *")) {
		const currentFlipCard = target.closest(".flip-box") as HTMLElement;

		const currentCardId = currentFlipCard.id.split("_")[0];

		const { matched } = cardMatchDict[currentCardId];

		const ongoingSelection = !matched && selectedCards.length < 2;

		if (!ongoingSelection) {
			return;
		}

		if (selectedCards.length > 0) {
			const alreadySelected = selectedCards.some((selectedCard) => {
				return selectedCard.id == currentFlipCard.id;
			});

			if (alreadySelected) return;
		}

		selectedCards.push(currentFlipCard);
		toggleClasses(currentFlipCard, ["flipped"]);

		if (selectedCards.length != sequenceLength) {
			return;
		}

		const cardIds = selectedCards.map((element) => {
			return element.id.split("_")[0];
		});

		const match = matchPredicate(cardIds);

		if (match) resetAfterMatch(currentCardId);
		else {
			frozen = true;

			setTimeout(() => {
				frozen = false;
				resetAfterNoMatch();
			}, 1500);
		}
	}
});

// eventlistener to record/change player name

document.addEventListener("mouseout", (event) => {
	const target = event.target as HTMLInputElement;

	if (target.matches(".player-spot input")) {
		const nameInput = target.value;

		const playerElement = target.closest(".player-spot") as HTMLElement;
		const playerName: string = playerElement.id;
		const playerNumber = Number(playerName.slice(-1));
		players[playerNumber - 1].name = nameInput;
		console.log(players);
	}
});
