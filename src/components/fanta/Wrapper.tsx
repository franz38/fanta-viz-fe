import React, { useEffect, useState } from "react";
import { PlayerStats } from "./PlayerStats";
import { VisualizationMode } from "../../types/VisualizationMode";
import { AddPlayerForm } from "./AddPlayerForm";
import "../../style/style.scss";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup,  } from "@mui/material";
import { ClientFactory } from "../../services/ClientFactory";
import { Player } from "../../types/Player";

export interface Player4List extends Player {
    selected?: boolean;
}

export const Wrapper = () => {

    const [visualMode, setVisualMode] = useState<VisualizationMode>(VisualizationMode.PARZIALI);
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
    const [players, setPlayers] = useState<Player[]>([])
    const [showVizPanel, setShowVizPanel] = useState<boolean>();
    const [showSelectionPanel, setShowSelectionPanel] = useState<boolean>();

    const changeVisualMode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisualMode(e.target.value as VisualizationMode)
    }

    const addPlayer = async (pn: Player) => {
        setSelectedPlayers([...selectedPlayers, pn]);
    }

    const removePlayer = (player: Player) => {
        setSelectedPlayers(selectedPlayers.filter(pl => pl.name != player.name));
    }

    const loadPlayersList = async () => {
        const service = ClientFactory.getService();
        const plList = await service.getPlayers()
        setPlayers(plList)
    }

    useEffect(() => {
        loadPlayersList()
    }, [])

    return <div className="wrapper" key="wrapper">

        <div className="main">

            <div className="leftBar">
                <AddPlayerForm 
                    players={players} 
                    selectedPlayers={selectedPlayers} 
                    onSelect={addPlayer}
                    onRemove={removePlayer}
                />
            </div>

            <div className="content">
                <div className="playerDataList">
                    {selectedPlayers.map((pd, id) => <PlayerStats data={pd} mode={visualMode} key={"pd-" + pd.fantaCode.toString()} />)}
                </div>
            </div>

        </div>
        
        {/* display settings */}
        <Dialog
            open={showVizPanel ?? false}
            // TransitionComponent={Transition}
            keepMounted
            onClose={() => setShowVizPanel(false)}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Visualization configuration"}</DialogTitle>
            <DialogContent>

                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Visualization type</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={visualMode}
                        onChange={(e) => changeVisualMode(e)}
                    >
                        <FormControlLabel value={VisualizationMode.FV} control={<Radio />} label="FANTA VOTO" />
                        <FormControlLabel value={VisualizationMode.PARZIALI} control={<Radio />} label="PARZIALI" />
                        <FormControlLabel value={VisualizationMode.BONUS} control={<Radio />} label="BONUS/MALUS" />
                    </RadioGroup>
                </FormControl>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowVizPanel(false)}>Ok</Button>
            </DialogActions>
        </Dialog>

        {/* <Drawer
            anchor={"right"}
            open={showSelectionPanel}
            onClose={() => setShowSelectionPanel(false)}
            >   
                <div className="selected-panel">
                    <span className="panel-header">Selected players</span>
                    <PlayerList players={selectedPlayers} onClick={player => removePlayer(player)} />
                </div>
        </Drawer> */}
       
    </div>
}