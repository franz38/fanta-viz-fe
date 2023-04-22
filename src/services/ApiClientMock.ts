import { Player } from "../types/Player";
import { PlayerData } from "../types/PlayerData";
import { IApiClient } from "./IApiClient";

export class ApiClientMock implements IApiClient {
  private url = "http://example.com/getPlayerData";

  async getPlayerData(fantaCode: number): Promise<PlayerData[]> {
    const response = await fetch(this.url);
    const data = await response.json();
    return data as PlayerData[];
  }

  async getPlayers(): Promise<Player[]> {
    const response = await fetch(this.url);
    const data = await response.json();
    return data as Player[];
  }
}
