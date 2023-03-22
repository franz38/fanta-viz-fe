import React, { useState } from "react";
// import { ArrowRight, Camera } from '@mui/icons-material'
import { GrAdd } from 'react-icons/gr';
import {AiOutlineSearch} from 'react-icons/ai'
import { Player } from "./wrapper";
import { PlayerList } from "./PlayerList";

interface AddPlayerFormProps {
    players: Player[]; 
    onSelect: (playerName: string) => void;
}
export const AddPlayerForm = (props: AddPlayerFormProps) => {

    const [suggested, setsuggested] = useState<Player[]>([]);
    const [query, setQuery] = useState<string>("");
    const [focus, setFocus] = useState<boolean>();

    const onSearch = (query_: string) => {
        setQuery(query_)
        if (query_.length > 2){
            setsuggested(props.players.filter(v => v.name.toLowerCase().includes(query_.toLowerCase())))
        }
        else if (query_.length == 0)
            setsuggested([])
    }

    const onSelect = (v: string) => {
        props.onSelect(v)
        setsuggested([])
        setQuery("")
    }
    

    return <>
        {/* <AddCircle /> */}
        <div className="addPlayerSection">

            <div className="box">
                <div className="searchbox">
                    <AiOutlineSearch className="icon" style={{width:"1rem", height: "1rem"}} onClick={() => setFocus(true)}/>
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => onSearch(e.target.value)}
                        onBlur={() => setFocus(false)}
                    ></input>
                </div>

                <div className="results">
                    <PlayerList players={suggested} onClick={(pl) => onSelect(pl.name)} />
                </div>

            </div>
            
            

        </div>
         
    </>
}