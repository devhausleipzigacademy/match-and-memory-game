import { newElement } from "../utils";

export function PlayerSpot(
	playerOrder: number,
	playerName: string
): HTMLElement {
	const player = newElement("div", ["player-spot", "inactive-player"]);
	player.id = `player-${playerOrder}`;

	player.innerHTML = `
        <p class="player-text">Player:</p>
		<input class="input-styling" type="text" placeholder="${playerName}"/>
        <p class="player-text">Score:</p>
		<p><span class="player-score">0</span></p>
    `;

	return player;
}
