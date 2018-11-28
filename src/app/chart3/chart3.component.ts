import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {feature} from 'topojson';

@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrls: ['./chart3.component.css']
})
export class Chart3Component implements OnInit {

  constructor() { }

  ngOnInit() {

	var contryList = ["China","Nigeria","Japan","Bangladesh","India","Pakistan","Indonesia","Mexico","Brazil","United States of America"]

  	var margin = { top: 100, left: 50, bottom: 50, right: 10 };
	var width = 1200 - margin.left - margin.right;
	var height = 900 - margin.top - margin.bottom;



  	var svg = d3.select("#graphArea").append("svg")
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	var projection=d3.geoMercator()
					.translate([width/3,height/3])

	var path=d3.geoPath()
				.projection(projection)


	d3.json("assets/worldmap.json").then(function (worldMap:any) {
		d3.csv("assets/GDPOnly.csv").then(function(gdpData:any){

			function getTargetGDP(selectedYear:number) {
				var targetGDP:any = {}
				for (var i = 0; i < gdpData.length; ++i) {
					if(gdpData[i].Year==selectedYear) {
						// targetGDP.push({Country:gdpData[i].Country,value:+gdpData[i].Value})
						targetGDP[gdpData[i].Country] = +gdpData[i].Value
					}
				}
				return targetGDP
			}

			function getMaxGDP(targetGDP) {
				return Math.max(...Object.values(targetGDP))
			}

			var selectedYear = 2000;
			var targetGDP = getTargetGDP(selectedYear)
			var maxGDP = getMaxGDP(targetGDP)
			
			console.log(maxGDP)

			// console.log(Object.keys(targetGDP))

			// var minG = Math.min(Object.values(targetGDP))

			// @ts-ignore
			var colorScale:any = d3.scaleLinear()
									.domain([0,maxGDP])
									// @ts-ignore
									.range([0,1])
									// .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')])
      							// .interpolate(d3.)
      							// .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);



			// draw map 

			var countries:any=feature(worldMap, worldMap.objects["custom.geo"])
			countries = countries.features
			// console.log(countries)
			var paths= svg.selectAll(".country")
						.data(countries)
						.enter()
						.append("path")
						.attr("class","country")
						.attr("d",path)
						.attr("fill",function(d):any{
							var a:any = d
							// console.log(a.properties.name)
							// if(contryList.indexOf(a.properties.sovereignt)!=-1 && targetGDP[a.properties.sovereignt]) {
							// 	console.log(targetGDP[a.properties.sovereignt])
							// 	console.log(a.properties.sovereignt)
							// 	return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
							// }
							// return 'None'

							if(targetGDP[a.properties.sovereignt]) {
								// console.log(targetGDP[a.properties.sovereignt])
								// console.log(a.properties.sovereignt)
								return d3.interpolateReds(colorScale(targetGDP[a.properties.sovereignt]))
							}
							return 'None'

							// console.log(targetGDP[a.properties.name])
							// console.log(colorScale(targetGDP[a.properties.name]))
							// console.log(d3.schemeReds[colorScale(targetGDP[a.properties.name])])
							
						})
						.attr("stroke","black")
						.on("mouseover",function(){
							var selected:any = this
							
							// console.log(selected.__data__.properties.name)

							// d3.select(selected)
								// .attr("fill","red")
						})
						.on("mouseout",function(){
							var selected:any = this

							// d3.select(selected)
								// .attr("fill","None")
						})
						.on("click",function(){
							// var selected:any = this
							// d3.select(selected)
								// .attr("fill","green")
						})

			// var selection = d3.select('select').property('value');
			// draw heat map with selected year
			// console.log(selection)
			// console.log(gdpData)

			d3.selectAll('.yearButton')
				.on("click",function() {
					// draw heat map with updated year
					console.log(d3.select(this).property('value'))
					
				})

		})

		


	})

  }

}
