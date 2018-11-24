import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

import * as kk from 'src/app/d3-scale-radial.js';





@Component({
  selector: 'app-chart2',
  templateUrl: './chart2.component.html',
  styleUrls: ['./chart2.component.css']
})
export class Chart2Component implements OnInit {

  constructor() { }

  ngOnInit() {


    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    innerRadius = 140,
    outerRadius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

//var y = kk.scaleRadial()    .range([innerRadius, outerRadius]);
var y = d3.scaleLinear()  .range([innerRadius, outerRadius]);
    

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"].reverse());



d3.csv("assets/processed_economic_activity.csv", <any>function(d, i, columns) {
  

  for (var i = <any>2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d['total'] = t;
  
  d.Year= (d.Year).toString();
  return d;
}).then(<any>function(newdata) {
    var dk = newdata;
    var selection = d3.select('select').property('value');
  
    dk=newdata.filter(x => x['Region'] == selection);
    dk['columns'] = newdata.columns.slice(1);
    d3.select('#Ecountries')
    .on("change", function () {
      var selection = d3.select('select').property('value');
      dk = newdata.filter(x => x['Region'] == selection);
      dk['columns'] = newdata.columns.slice(1);
      Updatechart2(dk);
    });

    console.log(dk)

    Updatechart2(dk);



    function Updatechart2(data){
     
  data.map(x => !x.Region);
  x.domain(data.map(function(d) { return d['Year']; }));
  y.domain([0,<any> d3.max(data, function(d) { return d['total']; })]);
  z.domain(data.columns.slice(1));

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("fill", <any>function(d) { return z(d.key); })
    .selectAll("path")
    .data(function(d) { return d; })
    .enter().append("path")
      .attr("d",<any> d3.arc()
          .innerRadius(function(d) { return y(d[0]); })
          .outerRadius(function(d) { return y(d[1]); })
          .startAngle(function(d) { return x(d['data']['Year']); })
          .endAngle(function(d) { return x(d['data']['Year']) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius));
    

  var label = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "rotate(" + ((x(d['Year']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

  label.append("line")
      .attr("x2", -5)
      .attr("stroke", "#000");

  label.append("text")
      .attr("transform", function(d) { return (x(d['Year']) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
      .text(function(d) { return d['Year']; });

  var yAxis = g.append("g")
      .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(y.ticks(5).slice(1))
    .enter().append("g");

  yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("r", y);

  yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 5)
      .text(y.tickFormat(5, "s"));

  yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .text(y.tickFormat(5, "s"));

  yAxis.append("text")
      .attr("y", function(d) { return -y(y.ticks(5).pop()); })
      .attr("dy", "-1em")
      .text("Population");

  var legend = g.append("g")
    .selectAll("g")
    .data(data.columns.slice(1).reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", <any>z);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(<any>function(d) { return d; });

    }
      
   });




  }

 

}
