import { IApiClient } from "./IApiClient";
import { ApiClient } from "./ApiClient";

export class ClientFactory {
  static getService(): IApiClient {
    return new ApiClient();
  }
}
