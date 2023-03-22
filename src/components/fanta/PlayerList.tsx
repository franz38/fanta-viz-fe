import React from "react";
import { Player } from "./wrapper";

interface PlayerListProps {
    players: Player[];
    onClick: (pl: Player) => void;
}

export const PlayerList = (props: PlayerListProps) => {

    return <div className="players-list">
        {props.players.map(v => 
        <div className="result" onClick={() => props.onClick(v)}>
            <span className={"role-icon role-" + (v.role ?? "")}>{v.role}</span>
            <p>{v.name}</p>
        </div>
        )}
    </div>
}