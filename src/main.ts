import {
	addChildren,
	removeChildren,
	toggleClasses,
	newElement,
	shuffle,
} from "./utils";

import { Cards, CardMatchDict, Player } from "./types";

import { FlipCard } from "./components/flip-card";
import { PlayerSpot } from "./components/player-spot";

import animalDeck from "../data/animalDeck.json";

// Test area

const soundOnSvg = document.getElementById("sound-on") as HTMLImageElement;
const soundOffSvg = document.getElementById("sound-off") as HTMLImageElement;

// Round Counter

let roundsPlayed: number = 0;
const roundBoard = document.getElementById("round-board") as HTMLElement;
const failureSound = new Audio(
	"https://www.dashingstrike.com/Automato/games/ATITD/sounds/fail.wav"
);

function roundCounter() {
	roundsPlayed++;

	removeChildren(roundBoard);
	const element = newElement("div");
	element.innerHTML = `Round: ${roundsPlayed}`;

	addChildren(roundBoard, [element]);
	// check if all players have had a turn and if so increase RoundCounter
}

//////////////////////////////////////////
/// Prepare Game Board & Initial State ///
//////////////////////////////////////////

const cardGrid = document.getElementById("card-grid") as HTMLElement;

const playerArea = document.getElementById("player-area") as HTMLElement;

let selectedCards: Array<HTMLElement> = [];

let sequenceLength = 2;

const players: Array<Player> = [
	{
		id: "0000001",
		name: "Jane",
		order: 1,
		score: 0,
	},
	{
		id: "0000002",
		name: "Steve",
		order: 2,
		score: 0,
	},
	{
		id: "0000003",
		name: "Maxine",
		order: 3,
		score: 0,
	},
	{
		id: "0000004",
		name: "Phillip",
		order: 4,
		score: 0,
	},
];

function renderScore() {
	const scoreElement = document.querySelector(
		`#player-${playerTurn + 1} .player-score`
	) as HTMLElement;

	scoreElement.innerText = `${players[playerTurn].score}`;
}

let playerTurn: number = 0;

function nextTurn() {
	const prevPlayerTurn: number = playerTurn;
	const nextPlayerTurn: number = (playerTurn + 1) % players.length;

	if (nextPlayerTurn == 0) roundCounter();

	renderScore();

	playerTurn = nextPlayerTurn;

	// change color of player's container indicating who's turn it is
	const prevPlayerElement = document.querySelector(
		`#player-${prevPlayerTurn + 1}`
	) as HTMLElement;
	const nextPlayerElement = document.getElementById(
		`player-${nextPlayerTurn + 1}`
	) as HTMLElement;

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
			"rounded-md",
			"w-[120px]",
			"h-[120px]",
		]);
		addChildren(element, [card]);
		return element;
	});

	addChildren(cardGrid, cardElements);
}

function useState<T>(startValue: T): [() => T, (val: T) => T] {
	let state = startValue;
	return [
		() => {
			return state;
		},
		(val) => {
			state = val;
			return state;
		},
	];
}

const [getMatchDict, setMatchDict] = useState({} as CardMatchDict);

function prepareDeck(deck) {
	const subset = deck; // use full deck for now; take subset later to accomodate larger decks.

	const newMatchDict = {};

	for (const card of subset) {
		const id = card.id;
		newMatchDict[id] = {
			matched: false,
			card: card,
		};
	}

	setMatchDict(newMatchDict);

	const cards: Cards = [...subset, ...subset];
	shuffle(cards);

	return cards;
}

function prepareBoard(cards) {
	const flipCards = cards.map((card, ind) => {
		const front = newElement("span");

		const back = newElement("img", [
			"w-full",
			"h-full",
			"object-cover",
			"rounded-md",
		]) as HTMLImageElement;

		const backImg = newElement("img", [
			"w-full",
			"h-full",
			"object-cover",
			"rounded-md",
		]) as HTMLImageElement;

		backImg.src = card.image;

		const backAudio = newElement("audio") as HTMLAudioElement;
		backAudio.src = card.sound;
		backImg.title = card.name;

		const flipCard = FlipCard([front], [backImg, backAudio]);
		flipCard.id = `${card.id}_${Math.floor(Math.random() * 100000)}`;
		flipCard.title = `Card ${ind + 1}`;

		return flipCard;
	});

	placeCards(flipCards);
	roundCounter();
}

function renderPlayers() {
	removeChildren(playerArea);

	const playerSpots = players.map((player) => {
		return PlayerSpot(player.order, player.name);
	});

	toggleClasses(playerSpots[0], ["active-player", "inactive-player"]);

	addChildren(playerArea, playerSpots);
}

function resetAfterMatch(cardId, cardMatchDict) {
	cardMatchDict[cardId].matched = true;
	increaseScore();
	renderScore();
	selectedCards = [];

	const allMatched = Object.entries(cardMatchDict).every((pair) => {
		const [matched, card] = pair;
		return !matched;
	});

	if (allMatched) resetBoard();
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

const cards = prepareDeck(animalDeck);
prepareBoard(cards);
renderPlayers();

let matchPredicate = binaryIdMatch;

let frozen: boolean = false;

function resetBoard() {
	roundsPlayed = 0;
	playerTurn = 0;

	renderPlayers();

	removeChildren(cardGrid);
	const cards = prepareDeck(animalDeck);
	prepareBoard(cards);
}

///////////////////////
/// Event Listeners ///
///////////////////////

const resetButton = document.getElementById("reset-button") as HTMLElement;
resetButton.addEventListener("click", (event) => {
	resetBoard();
});

document.addEventListener("click", (event) => {
	if (frozen == true) {
		return;
	}

	const target = event.target as HTMLElement;

	if (target.matches(".flip-box *")) {
		const currentFlipCard = target.closest(".flip-box") as HTMLElement;

		const currentCardId = currentFlipCard.id.split("_")[0];

		const cardMatchDict = getMatchDict();
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

		// grab the audio eklkenmtn aout iof the flip card
		//  paly method to audio
		const cardAudio = currentFlipCard.querySelector(
			"audio"
		) as HTMLAudioElement;
		if (soundOn) cardAudio.play();

		if (selectedCards.length != sequenceLength) {
			return;
		}

		const cardIds = selectedCards.map((element) => {
			return element.id.split("_")[0];
		});

		const match = matchPredicate(cardIds);

		if (match) resetAfterMatch(currentCardId, cardMatchDict);
		else {
			frozen = true;

			setTimeout(() => {
				frozen = false;
				if (soundOn) failureSound.play();
				resetAfterNoMatch();
			}, 2500);
		}
	}
});

document.addEventListener("mouseout", (event) => {
	const target = event.target as HTMLInputElement;

	if (target.matches(".player-spot input")) {
		if (target.value !== "") {
			const nameInput = target.value;

			const playerElement = target.closest(".player-spot") as HTMLElement;
			const playerName: string = playerElement.id;
			const playerNumber = Number(playerName.slice(-1));
			players[playerNumber - 1].name = nameInput;
		}
	}
});

const soundButton = document.getElementById("sound-button") as HTMLElement;

let soundOn: boolean = true;

soundButton.addEventListener("click", (event) => {
	const target = event.target as HTMLElement;

	if (soundOn) soundOn = false;
	else soundOn = true;

	toggleClasses(soundOnSvg, ["sound-switch"]);
	toggleClasses(soundOffSvg, ["sound-switch"]);
});
