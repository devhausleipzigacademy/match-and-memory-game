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

// https://stackoverflow.com/a/25984542
function shuffle(a, b, c, d) {
	c = a.length;
	while (c)
		(b = (Math.random() * c--) | 0), (d = a[c]), (a[c] = a[b]), (a[b] = d);
}
