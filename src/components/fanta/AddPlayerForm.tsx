import React, { useEffect, useState } from "react";
// import { ArrowRight, Camera } from '@mui/icons-material'
import { GrAdd } from 'react-icons/gr';
import {AiOutlineSearch} from 'react-icons/ai'
import { Player } from "../../types/Player";
import { PlayerList } from "./PlayerList";
import { Player4List } from "./Wrapper";

interface AddPlayerFormProps {
    players: Player[];
    selectedPlayers: Player4List[];
    onSelect: (playerName: Player) => void;
    onRemove: (player: Player) => void;
}
export const AddPlayerForm = (props: AddPlayerFormProps) => {

    const [suggested, setsuggested] = useState<Player[]>([]);
    const [query, setQuery] = useState<string>("");
    const [roles, setRoles] = useState<string[]>([]);
    const [focus, setFocus] = useState<boolean>();

    const onQueryChange = (query_: string) => {
        setQuery(query_)
        let queryFilter = undefined;
        queryFilter = query_
        filterPlayers(queryFilter, undefined) 
    }

    const onRoleChange = (role: string) => {
        let newRoles = []
        if (roles.some(r => r == role)){
            newRoles = roles.filter(r => r != role);
        }
        else {
            newRoles = [...roles, role];
        }
        setRoles(newRoles)
        filterPlayers(undefined, newRoles)
    }

    const filterByRole = (player: Player, rolesFilter: string[]): boolean => {
        return rolesFilter.some(r => r == player.role);
    }

    const filterByQuery = (player: Player, queryFilter: string): boolean => {
        return player.name.toLowerCase().includes(queryFilter.toLowerCase());
    }

    const filterPlayers = (queryFilter?: string, rolesFilter?: string[]) => {
        queryFilter = queryFilter ?? query;
        rolesFilter = rolesFilter ?? roles;

        const filteredPlayers = props.players
            .filter(player => filterByRole(player, rolesFilter ?? []) && filterByQuery(player, queryFilter ?? ""))
        setsuggested(filteredPlayers)
    }

    const onSelect = (player: Player) => {
        props.onSelect(player)
    }

    useEffect(() => {
        setRoles(['P', 'D', 'C', 'A'])
    }, [])

    useEffect(() => {
        setsuggested(props.players)
    }, [props.players])
    

    return <>
        {/* <AddCircle /> */}
        <div className={"playersList " + (focus ? "focused" : "")}>
            <div className="addPlayerSection">

                <div className="searchbox tab">

                    <div className="queryBox">
                        <AiOutlineSearch className="icon" style={{width:"1rem", height: "1rem"}} onClick={() => setFocus(true)}/>
                        <input 
                            type="text" 
                            value={query} 
                            onChange={(e) => onQueryChange(e.target.value)}
                            onFocus={() => setFocus(true)}
                        ></input>
                    </div>

                    <div className={"searchBox-2section " + (focus ? "" : "hidden")}>
                        <div className="rolesBox">
                            <span 
                                className={"role-icon button role-P " + (roles.some(r => r == "P") ? "" : "inactive")} 
                                onClick={() => onRoleChange('P')}>P</span>
                            <span 
                                className={"role-icon button role-D " + (roles.some(r => r == "D") ? "" : "inactive")} 
                                onClick={() => onRoleChange('D')}>D</span>
                            <span 
                                className={"role-icon button role-C " + (roles.some(r => r == "C") ? "" : "inactive")} 
                                onClick={() => onRoleChange('C')}>C</span>
                            <span 
                                className={"role-icon button role-A " + (roles.some(r => r == "A") ? "" : "inactive")} 
                                onClick={() => onRoleChange('A')}>A</span>
                        </div>
                        <button onClick={() => setFocus(false)}>close filters</button>
                    </div>
                </div>

                <div className={"results " + (focus ? "" : "hidden")}>
                    <PlayerList 
                        players={suggested}
                        selectedPlayers={props.selectedPlayers}
                        onClick={(pl) => onSelect(pl)} 
                        onRemove={props.onRemove}
                    />
                </div>
                
            </div>
        </div>
    </>
}