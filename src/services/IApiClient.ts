import { Player } from "../types/Player";
import { PlayerData } from "../types/PlayerData";

export interface IApiClient {
    getPlayers(): Promise<Player[]>;
    getPlayerData(fantaCode: number): Promise<PlayerData[]>;
}