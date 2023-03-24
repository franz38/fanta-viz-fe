import { Stat } from "./Stat";


export interface Player {
    name: string;
    role: string;
    stats?: Stat[];
}
