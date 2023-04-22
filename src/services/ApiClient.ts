import { Player } from "../types/Player";
import { PlayerData } from "../types/PlayerData";
import { IApiClient } from "./IApiClient";

export class ApiClient implements IApiClient {
  async getPlayerData(fantaCode: number): Promise<PlayerData[]> {
    return fetch(
      "https://fantaviz-api-af.azurewebsites.net/api/playerData/" +
        fantaCode.toString()
    ).then((response) => {
      if (response.status >= 200 && response.status < 300)
        return response.json();
      else throw response;
    });
  }

  async getPlayers(): Promise<Player[]> {
    return fetch("https://fantaviz-api-af.azurewebsites.net/api/players").then(
      (response) => {
        if (response.status >= 200 && response.status < 300)
          return response.json();
        else throw response;
      }
    );
  }
}
