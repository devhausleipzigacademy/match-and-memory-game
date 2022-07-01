import { newElement } from "../utils";

export function PlayerSpot(
	playerOrder: number,
	playerName: string
): HTMLElement {
	const player = newElement("div", ["player-spot", "inactive-player"]);
	player.id = `player-${playerOrder}`;

	player.innerHTML = `
        <p class="player-text"></p>
		<p><span class="player-name">${playerName}</span></p>
        <p class="player-text"></p>
		<p><span class="player-score">0</span></p>
    `;

	return player;
}
