import { newElement } from "../utils";

export function PlayerSpot(
	playerOrder: number,
	playerName: string
): HTMLElement {
	const player = newElement("div", ["player-spot", "inactive-player"]);
	player.id = `player-${playerOrder}`;

	player.innerHTML = `
<<<<<<< HEAD
        <p class="player-text"></p>
		<p><span class="player-name">${playerName}</span></p>
        <p class="player-text"></p>
=======
        <p class="player-text">Player:</p>
		<input class="input-styling" type="text" placeholder="${playerName}"/>
        <p class="player-text">Score:</p>
>>>>>>> 1b349591a0a3dcf4a5f034cbe46347cbaeb9f478
		<p><span class="player-score">0</span></p>
    `;

	return player;
}
