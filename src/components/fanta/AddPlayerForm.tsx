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
}
export const AddPlayerForm = (props: AddPlayerFormProps) => {

    const [suggested, setsuggested] = useState<Player[]>([]);
    const [query, setQuery] = useState<string>("");
    const [roles, setRoles] = useState<string[]>([]);
    const [focus, setFocus] = useState<boolean>();

    // const onSearch = (query_: string) => {
    //     setQuery(query_)
    //     if (query_.length > 2){
    //         setsuggested(props.players.filter(v => v.name.toLowerCase().includes(query_.toLowerCase())))
    //     }
    //     else if (query_.length == 0)
    //         setsuggested([])
    // }

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
        <div className="addPlayerSection">

            <div className="searchbox tab">

                <div className="queryBox">
                    <AiOutlineSearch className="icon" style={{width:"1rem", height: "1rem"}} onClick={() => setFocus(true)}/>
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => onQueryChange(e.target.value)}
                        onBlur={() => setFocus(false)}
                    ></input>
                </div>

                <div className="rolesBox">
                    <span 
                        className={"role-icon role-P " + (roles.some(r => r == "P") ? "" : "inactive")} 
                        onClick={() => onRoleChange('P')}>P</span>
                    <span 
                        className={"role-icon role-D " + (roles.some(r => r == "D") ? "" : "inactive")} 
                        onClick={() => onRoleChange('D')}>D</span>
                    <span 
                        className={"role-icon role-C " + (roles.some(r => r == "C") ? "" : "inactive")} 
                        onClick={() => onRoleChange('C')}>C</span>
                    <span 
                        className={"role-icon role-A " + (roles.some(r => r == "A") ? "" : "inactive")} 
                        onClick={() => onRoleChange('A')}>A</span>
                </div>
            </div>

            <div className="results">
                <PlayerList 
                    players={suggested}
                    selectedPlayers={props.selectedPlayers}
                    onClick={(pl) => onSelect(pl)} />
            </div>
            
        </div>
         
    </>
}