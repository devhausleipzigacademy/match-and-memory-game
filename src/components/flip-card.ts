import { addChildren, newElement } from "../utils";

export function FlipCard(
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
