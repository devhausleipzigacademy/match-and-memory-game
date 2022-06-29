export function addClasses(element: HTMLElement, classes: Array<string>) {
	element.classList.add(...classes);
}

export function removeClasses(element: HTMLElement, classes: Array<string>) {
	element.classList.remove(...classes);
}

export function toggleClasses(element: HTMLElement, classes: Array<string>) {
	for (const className of classes) {
		element.classList.toggle(className);
	}
}

export function newElement(tag: string, classes: Array<string> = []) {
	const element = document.createElement(tag);
	addClasses(element, classes);
	return element;
}

export function addChildren(
	parent: HTMLElement,
	children: Array<HTMLElement>
): void {
	for (const child of children) {
		parent.appendChild(child);
	}
}

export function removeChildren(parent: HTMLElement): void {
	const children = [...parent.children];
	for (const child of children) {
		parent.removeChild(child);
	}
}

// Fisher-Yates Algorithm
// https://stackoverflow.com/a/25984542
export function shuffle(array) {
	var count = array.length,
		randomnumber,
		temp;
	while (count) {
		randomnumber = (Math.random() * count--) | 0;
		temp = array[count];
		array[count] = array[randomnumber];
		array[randomnumber] = temp;
	}
}
