const cardGrid = document.getElementById("card-grid") as HTMLElement;

function addClasses(element: HTMLElement, classes: Array<string>) {
	element.classList.add(...classes);
}

function removeClasses(element: HTMLElement, classes: Array<string>) {
	element.classList.remove(...classes);
}

function toggleClasses(element: HTMLElement, classes: Array<string>) {
	for (const className of classes) {
		element.classList.toggle(className);
	}
}

function newElement(tag: string, classes: Array<string> = []) {
	const element = document.createElement(tag);
	addClasses(element, classes);
	return element;
}

function addChildren(parent: HTMLElement, children: Array<HTMLElement>): void {
	for (const child of children) {
		parent.appendChild(child);
	}
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

function FlipBox(
	frontChildren: Array<HTMLElement>,
	backChildren: Array<HTMLElement>
) {
	const flipBox = newElement("div", ["flip-box"]);

	const flipBoxInner = newElement("div", ["flip-box-inner"]);
	addChildren(flipBox, [flipBoxInner]);

	const flipBoxFront = newElement("div", ["flip-box-front"]);
	addChildren(flipBoxFront, frontChildren);

	const flipBoxBack = newElement("div", ["flip-box-back"]);
	addChildren(flipBoxBack, backChildren);

	addChildren(flipBoxInner, [flipBoxFront, flipBoxBack]);

	return flipBox;
}

const testCards = Array.from({ length: 18 }, () => {
	return {
		frontText: "front",
		backText: "back",
	};
});

const flipCards = testCards.map((card) => {
	const front = newElement("span");
	front.innerText = card.frontText;

	const back = newElement("span");
	back.innerText = card.backText;

	return FlipBox([front], [back]);
});

placeCards(flipCards);

document.addEventListener("click", (event) => {
	const target = event.target as HTMLElement;

	if (target.matches(".flip-box *")) {
		const flipBox = target.closest(".flip-box") as HTMLElement;
		toggleClasses(flipBox, ["flipped"]);
	}
});

// how should we model data for cards + game state

// players?
// turns?
// what information does each flip card need?

// how do we compare two cards to see if they're the same?
