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

			var selectedYear = d3.select('select').property('value');

			var targetGDP:any = {}

			for (var i = 0; i < gdpData.length; ++i) {
				if(gdpData[i].Year==selectedYear) {
					// targetGDP.push({Country:gdpData[i].Country,value:+gdpData[i].Value})
					targetGDP[gdpData[i].Country] = +gdpData[i].Value
				}
			}

			console.log(Object.values(targetGDP))

			// var minG = Math.min(Object.values(targetGDP))

			// @ts-ignore
			var colorScale:any = d3.scaleLinear()
									.domain([0,1000000000000000])
									// @ts-ignore
									.range(["white","black"])
									// .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')])
      							// .interpolate(d3.)
      							// .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);


			// draw map 

			var countries:any=feature(worldMap, worldMap.objects["custom.geo"])
			countries = countries.features
			console.log(countries)
			var paths= svg.selectAll(".country")
						.data(countries)
						.enter()
						.append("path")
						.attr("class","country")
						.attr("d",path)
						.attr("fill",function(d):number{
							var a:any = d
							// console.log(a.properties.name)
							return colorScale(targetGDP[a.properties.name])
						})
						.attr("stroke","black")
						.on("mouseover",function(){
							var selected:any = this
							
							// console.log(selected.__data__.properties.name)

							d3.select(selected)
								.attr("fill","red")
						})
						.on("mouseout",function(){
							var selected:any = this

							d3.select(selected)
								.attr("fill","None")
						})
						.on("click",function(){
							var selected:any = this
							d3.select(selected)
								.attr("fill","green")
						})

			// var selection = d3.select('select').property('value');
			// draw heat map with selected year
			// console.log(selection)
			// console.log(gdpData)

			d3.select('#year')
				.on("change",function() {
					// draw heat map with updated year

				})

		})

		


	})

  }

}
