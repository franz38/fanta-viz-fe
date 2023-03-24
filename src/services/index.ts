import * as d3 from "d3";
import { Stat } from "../types/Stat";
import { Player } from "../types/Player";
import { resolve } from "path";

export const getPlayerData = async (playerName: string): Promise<Player> => {
    const rawData = await d3.csv("./fanta/parsed.csv");
    
    let pd: Stat[] = rawData.filter(r => r["Nome"] == playerName)
        .map(r => {
            const row : Stat = {
                id: parseInt(r[""] ?? ""),
                role: r["Ruolo"] ?? "",
                voto: parseInt(r["Voto"] ?? ""),
                gf: parseInt(r["Gf"] ?? ""),
                gs: parseInt(r["Gs"] ?? ""),
                rp: parseInt(r["Rp"] ?? ""),
                rs: parseInt(r["Rs"] ?? ""),
                rf: parseInt(r["Rf"] ?? ""),
                au: parseInt(r["Au"] ?? ""),
                amm: parseInt(r["Amm"] ?? ""),
                esp: parseInt(r["Esp"] ?? ""),
                ass: parseInt(r["Ass"] ?? ""),
                day: parseInt(r["Day"] ?? ""),
                nome: r["Nome"] ?? ""
            }
            return row
        })

    const missing: Stat[] = []
    Array(38).fill(1).forEach((v,i) => {
        if (!(pd.find(v => v.day == i+1))){
            missing.push({
                id: i,
                role: "",
                voto: 0,
                gf: 0,
                gs: 0,
                rp: 0,
                rs: 0,
                rf: 0,
                au: 0,
                amm: 0,
                esp: 0,
                ass: 0,
                day: i+1
            })
        }
    })
    pd = [...pd, ...missing].sort((a,b) => a.day > b.day ? 1 : -1)
    const pl: Player = {
        name: pd.find(p => p.nome)?.nome ?? "",
        role: pd.find(p => p.role)?.role ?? "",
        stats: pd
    };
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(pl)
        }, 1000)
    });
}

export const getPlayers = async (): Promise<Player[]> => {
    const data = await d3.csv("./fanta/parsed.csv")

    const mapped = new Map<string, string>(
        data.map(r => [r["Nome"] ?? "", r["Ruolo"] ?? ""] as [string, string] )
    )

    const uniques: Player[] = Array.from(mapped.keys()).map(p => ({
        name: p,
        role: mapped.get(p) ?? ""
    }));

    return uniques;
}