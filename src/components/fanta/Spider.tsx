import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const W = 600
const H = 600

const colors = [
    ["orange", "#ffa5004f"],
    ["blue", "#0000ff66"],
    ["green", "orange"]

]

const axis = [
    {k: 0, name: "played"},
    {k: 1, name: "fv"},
    {k: 2, name: "goal"},
    {k: 3, name: "assist"},
    {k: 4, name: "rigori"}
]

export interface SpiderData {
    matchPlayed: number;
    fv: number;
    goals: number;
    assist: number;
    penalty: number;
}

interface SpiderProps {
    data: SpiderData[];
}

class SpiderScale {

    axis: {k: number, name: string, max?: number}[] = [];
    width: number = 0;
    height: number = 0;

    constructor(axis: {k: number, name: string}[], width: number, height: number){
        this.axis = axis
        this.width = width
        this.height = height
    }

    setMax(axis: string, v: number) {
        this.axis = this.axis.map(e => {
            if (e.name == axis)
                return {...e, max: v}
            return e
        })
    }

    map(axisname: string, value: number, percentage?: boolean){
        const axis = this.axis.find(e => e.name == axisname) ?? {k:0, name: ""};
        let scaled = (value ?? axis?.max ?? 1)/(axis?.max ?? 1);
        if (value < 0)
            scaled = 1
        
        if (percentage)
            scaled = value
        
        return {
            x: this.width/2 + scaled * this.width/2 * Math.cos(2*Math.PI*(axis.k/this.axis.length)),
            y: this.height/2 + scaled * this.height/2 * Math.sin(2*Math.PI*(axis.k/this.axis.length)),
        }

    }
    

}

export const Spider = (props: SpiderProps) => {
    const chartRef = useRef<HTMLInputElement>(null);

    const scale = new SpiderScale(axis, W-100, H-100)
    scale.setMax("played", 40)
    scale.setMax("fv", 10)
    scale.setMax("goal", 30)
    scale.setMax("assist", 20)
    scale.setMax("rigori", 5)

    const initChart = () => {

        

        console.log(scale)

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", W)
            .attr("height", H)
                .append("g")
                .attr("class", "box")
        
        const grid = svg.append("g").attr("class", "grid")
            .selectAll("line")
            .data(axis)
            .enter()
            .append("g")

        grid.append("line")
            .attr("x1", scale.width/2)
            .attr("x2", d => scale.map(d.name, -1).x)
            .attr("y1", scale.height/2)
            .attr("y2", d => scale.map(d.name, -1).y)
            .attr("stroke", "#8a8989")
        
        grid.append("text")
            .text(d => d.name)
            .attr("x", d => scale.map(d.name, -1).x)
            .attr("y", d => scale.map(d.name, -1).y)

        svg.append("g").attr("class", "grid2")
            .selectAll("polyline")
            .data([0.25, 0.5, 0.75, 1])
            .enter()
            .append("polyline")
            .attr("stroke", "#8a8989")
            .attr("fill", "none")
            .attr("points", d => {
                let v = ""
                axis.forEach(ax => {
                    const mapped = scale.map(ax.name, d, true)
                    v += mapped.x.toString() + "," + mapped.y.toString() + " "
                })
                const mapped = scale.map(axis[0].name, d, true)
                v += mapped.x.toString() + "," + mapped.y.toString() + " "
                return v
            })

        svg.append("g").attr("class", "values")
    }

    const drawChart = () => {

        const svg = d3.select(chartRef.current)
            .select("svg")
            .select("g.box")

        svg.select("g.values").selectAll("polyline")
            .data(props.data)
            .enter()
            .append("polyline")
            .attr("class", "spider-value")
            .attr("stroke", (d,i) => colors[i][0])
            .attr("fill", (d,i) => colors[i][1])
            .attr("points", d => {
                let v = ""
                v += scale.map("played", d.matchPlayed).x + "," + scale.map("played", d.matchPlayed).y + " "
                v += scale.map("fv", d.fv).x  + "," + scale.map("fv", d.fv).y + " "
                v += scale.map("goal", d.goals).x  + "," + scale.map("goal", d.goals).y + " "
                v += scale.map("assist", d.assist).x  + "," + scale.map("assist", d.assist).y + " "
                v += scale.map("rigori", d.penalty).x  + "," + scale.map("rigori", d.penalty).y + " "
                v += scale.map("played", d.matchPlayed).x + "," + scale.map("played", d.matchPlayed).y + " "

                return v
            })
    }

    useEffect(() => {
        initChart()
        drawChart()
    }, [])

    useEffect(() => {
        drawChart()
    }, [props])

    return <>
        <div ref={chartRef} className={"player-stats-box"} >
            <div id="tooltip"></div>
        </div>
    </>
}