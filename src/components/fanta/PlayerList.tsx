import React from "react";
import { Player } from "../../types/Player";

interface PlayerListProps {
    players: Player[];
    onClick: (pl: Player) => void;
}

export const PlayerList = (props: PlayerListProps) => {

    return <div className="players-list">
        {props.players.map((v, id) => 
        <div className="result" onClick={() => props.onClick(v)} key={v.name + id.toString()}>
            <span className={"role-icon role-" + (v.role ?? "")}>{v.role}</span>
            <p>{v.name}</p>
        </div>
        )}
    </div>
}