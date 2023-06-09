import { CircularProgress } from "@mui/material";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { IoMdOptions } from 'react-icons/io';
// import { getPlayerData } from "../../services";
import { ClientFactory } from "../../services/ClientFactory";
import { Player } from "../../types/Player";
import { PlayerData } from "../../types/PlayerData";
import { VisualizationMode } from "../../types/VisualizationMode";

interface PlayerStatsProps {
    data: Player;
    mode: VisualizationMode
}

const blue = "#66779D";
const red = "#E07A5F";
const green = "#81B29A";

const desktopConfig = {

}

class StyleManager{

    private static threshold = 800;

    private static mobileConfig = {
        HTOT: 200,
        Pt: 20,
        Pb: 20,
        Pl: 20,
        H: 200 - 20 - 20
    }

    private static desktopConfig = {
        HTOT: 300,
        Pt: 20,
        Pb: 20,
        Pl: 20,
        H: 300 - 20 - 20
    }

    public static H(width: number){
        return width > this.threshold ? StyleManager.desktopConfig.H : StyleManager.mobileConfig.H;
    }

    public static HTOT(width: number){
        return width > this.threshold ? StyleManager.desktopConfig.HTOT : StyleManager.mobileConfig.HTOT;
    }
    
}


export const PlayerStats = (props: PlayerStatsProps) => {

    const chartRef = useRef<HTMLInputElement>(null);
    const tooltipRef = useRef<HTMLInputElement>(null);
    const [statHovered, setStatHovers] = useState<PlayerData>();
    const [playerData, setPlayerData] = useState<PlayerData[]>();
    const [loading, setLoading] = useState<boolean>(true);

    // const W = 1000
    const HTOT = 300
    const Pt = 20
    const Pb = 20
    const Pl = 20
    const H = HTOT - Pt - Pb

    const getFv = (stat: PlayerData) => {
        return stat.voto + getBonus(stat)
    }

    const getBonus = (stat: PlayerData) => {
        return 3*stat.gf + 1*stat.ass + 3*stat.rp - 1*stat.gs - 0.5*stat.amm - 1*stat.esp + 2*stat.rf - 3*stat.rs
    }


    const getYScale = () => {
        if (props.mode == VisualizationMode.FV || props.mode == VisualizationMode.PARZIALI)
            return [0, 18]
        return [-6, 12]
    }

    const mouseHover = (mouseEvent: any, stat: PlayerData) => {
        d3.select(tooltipRef.current)
            .style("left", mouseEvent.layerX + "px")
            .style("top", mouseEvent.layerY + "px")
            .style("opacity", "0.9")
        setStatHovers(stat)
    }

    const mouseMove = (mouseEvent: any, data: PlayerData) => {
        d3.select(tooltipRef.current)
            .style("left", mouseEvent.layerX + "px")
            .style("top", mouseEvent.layerY + "px")
    }

    const mouseLeave = (mouseEvent: any, data: PlayerData) => {
        setStatHovers(undefined)
        d3.select(tooltipRef.current)
            .style("left", 0 + "px")
            .style("top", 0 + "px")
            .style("opacity", "0")
    }

    const initChart = async (): Promise<PlayerData[]> => {

        // load data
        const service = ClientFactory.getService();
        const playerData = await service.getPlayerData(props.data.fantaCode)
        setPlayerData(playerData)
        

        // init svg
        const svg = d3.select(chartRef.current)
            .append("svg")
            // .attr("width", W)
            // .attr("height", StyleManager.HTOT())
                .append("g")
                .attr("class", "box")
        
        svg.append("g").attr("class", "chart").attr("transform", `translate(0, ${Pt})`)
        svg.append("g").attr("class", "yAxisBox")
        svg.append("g").attr("class", "xAxisBox")

        return playerData;
    }

    const drawChart = (data: PlayerData[]) => {        
        
        setLoading(true)
        const svg = d3.select(chartRef.current).select("svg").select("g.box");
        
        const boxWidth = parseInt(d3.select(chartRef.current).style('width'), 10);

        const W = boxWidth
        const chartH = StyleManager.H(boxWidth)

        d3.select(chartRef.current).select("svg").attr("width", W)
        d3.select(chartRef.current).select("svg").attr("height", StyleManager.HTOT(boxWidth))

        // scales init
        const xScale = d3.scaleBand()
            .domain(Array(38).fill(1).map((x,i) => (i+1).toString()) ?? [])
            .range([Pl, W])
            .padding(0.2)
        
        const yScale = d3.scaleLinear()
            .domain(getYScale())
            .range([chartH, 0])

        const yAxis = d3.axisLeft(yScale)

        let tickAmountRatio = 1;
        if (W < 800)
            tickAmountRatio = 5
        const xAxis = d3.axisBottom(xScale)
            .tickValues(Array(38).fill(1).map((x,i) => i).filter(i => i%tickAmountRatio == 0).map(i => (i+1).toString()))

        // draw axis
        svg.select("g.yAxisBox")
            .select("g")
            .remove()
        svg.select("g.xAxisBox")
            .select("g")
            .remove()

        svg.select("g.yAxisBox")
            .append("g")
            .style("transform", `translate(${Pl}px,${Pt}px)`)
            .call(yAxis)
        svg.select("g.xAxisBox")
            .append("g")
            .style("transform", `translate(${0}px,${chartH + Pt}px)`)
            .call(xAxis)

        svg.select("g.chart").selectAll("rect").remove()

        const d = []
        for(let i=getYScale()[0]+2; i<getYScale()[1]; i+=2)
            d.push(i)

        svg.select("g.grid").remove()
        svg.select("g.chart").append("g").attr("class", "grid").style("transform", `translate(${Pl}px, ${0}px)`)
            .selectAll("line")
            .data(d)
            .enter()
            .append("line")
            .attr("x1", 0)
            .attr("x2", W)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "#5B5754")
            .style("opacity", 0.2)

        // data
        const dayBox = svg.select("g.chart").selectAll("rect")
            .data(data ?? [])
            .enter()
            .append("g")
                // .attr("key", d => props.data.name + d.day)
                .attr("transform", d => "translate(" + xScale(d.day.toString()) + " 0)")
        
        if (props.mode == VisualizationMode.FV){
            dayBox.append("rect")
                .attr("width", xScale.bandwidth())
                .attr("height", d => chartH - yScale(getFv(d)))
                .attr("y", d => yScale(getFv(d)))
                .attr("fill", green)
        }
        else if (props.mode == VisualizationMode.PARZIALI){
            dayBox.append("rect")
                .attr("width", xScale.bandwidth())
                .attr("height", d => chartH - yScale(d.voto))
                .attr("y", d => yScale(d.voto))
                .attr("fill", green)
                .on("mouseover", (a,b) => mouseHover(a,b))
                .on("mousemove", (a,b) => mouseMove(a,b))
                .on("mouseleave", (a,b) => mouseLeave(a,b))
            dayBox.append("rect")
                .attr("width", xScale.bandwidth())
                .attr("height", d => getBonus(d) >= 0 ? chartH - yScale(getBonus(d)) -2.5  : chartH - yScale(-getBonus(d)))
                .attr("y", d => getBonus(d) >= 0 ? (yScale(d.voto) - chartH + yScale(getBonus(d)) ) : yScale(d.voto) )
                .attr("fill", d => getBonus(d) >= 0 ? blue : red)
                .on("mouseover", (a,b) => mouseHover(a,b))
                .on("mousemove", (a,b) => mouseMove(a,b))
                .on("mouseleave", (a,b) => mouseLeave(a,b))
        }
        else {
            dayBox.append("rect")
                .attr("width", xScale.bandwidth())
                .attr("height", d => getBonus(d) >= 0 ? -yScale(getBonus(d)) + yScale(0)  : (yScale(0) - yScale(-getBonus(d)) ))
                .attr("y", d => getBonus(d) >= 0 ? yScale(getBonus(d)) : yScale(0) )
                .attr("fill", d => getBonus(d) >= 0 ? blue : red)
                .on("mouseover", (a,b) => mouseHover(a,b))
                .on("mousemove", (a,b) => mouseMove(a,b))
                .on("mouseleave", (a,b) => mouseLeave(a,b))
        }
        setLoading(false)
    }

    useEffect(() => {
        initChart().then((data) => {
            drawChart(data)
            setPlayerData(data)
        })
    }, [])

    useEffect(() => {
        if (playerData)
            drawChart(playerData)
    }, [props])


    
    return <>
        
        <div className="playerStatsSection tab">
            <p className="player-name">{props.data?.name ?? ""}</p>
            
            {loading && <div className="spinnerBox">
                <CircularProgress style={{padding: "3rem 0px", position: "absolute"}}/>
            </div>
            }
            
            <div ref={chartRef} className={"player-stats-box " + (loading ? "hidden" : "")} >
                {<div ref={tooltipRef} className={(statHovered != null) ? "tooltip" : "tooltip"}>
                    
                    {statHovered && <>
                        <div className="item">
                            <div className="tooltip-sq" style={{background: "#fff"}}></div>
                            <span>Fanta voto: {statHovered.voto + getBonus(statHovered)}</span>
                        </div>

                        <div className="item">
                            <div className="tooltip-sq" style={{background: green}}></div>
                            <span>Voto: {statHovered.voto}</span>
                        </div>

                        {getBonus(statHovered) != 0 && <div className="item">
                            <div className="tooltip-sq" style={{background: (getBonus(statHovered) >= 0) ? blue : red}}></div>
                            <span>Bonus: {getBonus(statHovered)}</span>
                        </div>}

                        {statHovered.gf > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: blue}}></div>
                            <span>+ {statHovered.gf} goal</span>
                        </div>}

                        {statHovered.ass > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: blue}}></div>
                            <span>+ {statHovered.ass} assist</span>
                        </div>}

                        {statHovered.rf > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: blue}}></div>
                            <span>+ {statHovered.rf} rigori segnati</span>
                        </div>}

                        {statHovered.rp > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: blue}}></div>
                            <span>+ {statHovered.rp} rigori parati</span>
                        </div>}

                        {statHovered.gs > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: red}}></div>
                            <span>- {statHovered.gs} goal subiti</span>
                        </div>}
                        
                        {statHovered.rs > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: red}}></div>
                            <span>- {statHovered.rs} rigori sbagliati</span>
                        </div>}

                        {statHovered.esp > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: red}}></div>
                            <span>- espulsione</span>
                        </div>}

                        {statHovered.amm > 0 && <div className="item">
                            <div className="tooltip-crcl" style={{background: red}}></div>
                            <span>- ammonizione</span>
                        </div>}
                        
                    </>}
                    
                </div>}
            </div>
        </div>
    </>
}