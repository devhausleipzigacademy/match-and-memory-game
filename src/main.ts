const cardGrid = document.getElementById("card-grid") as HTMLElement;

function addChildren(parent: HTMLElement, children: Array<HTMLElement>): void {
	for (const child of children) {
		parent.appendChild(child);
	}
}

function placeCards(cards: Array<any>): void {
	// transform cards data into appropriate elements
	const cardElements = cards.map((card) => {
		const element = document.createElement("div");
		element.innerText = card.frontText;
		element.classList.add("bg-blue-400");
		return element;
	});

	addChildren(cardGrid, cardElements);
}

const testCards = Array.from({ length: 18 }, () => {
	return {
		frontText: "front",
		backText: "back",
	};
});

placeCards(testCards);
