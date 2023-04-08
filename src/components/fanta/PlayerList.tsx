import React from "react";
import { Player } from "../../types/Player";
import { Player4List } from "./Wrapper";
import { Add, AddBox, Remove } from "@mui/icons-material";

interface PlayerListProps {
    players: Player[];
    selectedPlayers: Player4List[];
    onClick: (pl: Player) => void;
}

export const PlayerList = (props: PlayerListProps) => {

    const isSelected = (v: Player): boolean => props.selectedPlayers.some(el => el.fantaCode == v.fantaCode);

    return <div className="players-list">
        {props.players.map((v, id) => 
        <div 
            className={"result tab " + (isSelected(v) ? "selected" : "")} 
        >
                <div style={{display: "flex"}}>
                    <span className={"role-icon role-" + (v.role ?? "")}>{v.role}</span>
                    <p>{v.name}</p>
                </div>

                {isSelected(v) ?
                    <Remove 
                        className={"addIcon"} 
                    /> :
                    <AddBox 
                        className={"addIcon"} 
                        onClick={() => props.onClick(v)} key={v.name + id.toString()}
                    />
                }

        </div>
        )}
    </div>
}