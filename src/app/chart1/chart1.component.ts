import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.css']
})
export class Chart1Component implements OnInit {

  constructor() { }



  ngOnInit() {





    function type(d, i, columns) {
      d.Year = d3.timeParse("%Y")(d.Year);

      for (var i = <any>2, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
      return d;
    }


    d3.csv("assets/temp_age_distr.csv", type).then(function (data) {

      d3.select('#countries')
        .on("change", function () {
          var selection = d3.select('select').property('value');
          var data1 = data.filter(x => x['Region'] == selection);
          data1['columns'] = data.columns.slice(1);

          updateGraph(data1);
        });



      var data1 = data.filter(x => x['Region'] == 'Nigeria');
      data1['columns'] = data.columns.slice(1);
      var svg = d3.select("svg"),
      margin = { top: 9, right: 20, bottom: 30, left: 50 },
      width = <any>svg.attr("width") - margin.left - margin.right,
      height = <any>svg.attr("height") - margin.top - margin.bottom;


    var parseDate = d3.timeParse("%Y");
    var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);
    var stack = d3.stack();
    var area = d3.area()
      .x(function (d, i) { return x(d['data']['Year']); })
      .y0(function (d) { return y(d[0]); })
      .y1(function (d) { return y(d[1]); });


    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var xAxis = g.append("g")
      .attr("class", "axis axis--y")

    var yAxis = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")");

      updateGraph(data1);
      function updateGraph(data) {
  
        
        var country = data[0].Region;
        data.map(x => !x.Region);
        var keys = data.columns.slice(1);
  
        d3.select('#showme').on("click", function () { });
        d3.select('#hideme').on("click", function () { });
  
        // var newDataset = data.map(function (d, i) {
  
        //   var sum = d.Middle + d.Young + d.Old;
  
        //   return { Year: d.Year, Middle: d.Middle * 100 / sum, Old: d.Old * 100 / sum, Young: d.Young * 100 / sum };
  
        // });
        // y.domain([0, 100])
        // data=newDataset; 
  
  
        y.domain([0, d3.max(data, function (d) { return d['Young'] + d['Middle'] + d['Old'] + 300; })]);
        var xyz = d3.extent(data, function (d) { return d['Year'] })
        x.domain(<any>xyz);
        z.domain(keys);
  
        stack.keys(keys);
        
        console.log(stack(data));
  
        var layer_selection = g.selectAll(".layer")
                                .data(stack(data))
          
        var layer_selection_enter = layer_selection.enter().append("g")
                                            .attr("class", "layer");
          
        // var path_areas_selection = layer_selection_enter.selectAll(".area").data(function(d){
        //   console.log(d);
        //   return [d]
        // })
        
        // var path_areas_enter = path_areas_selection.enter().append("path").attr("class","area");

        // console.log(path_areas_selection);
        // var path_areas = layer_selection.selectAll(".area").data(function(d){
        //   console.log(d)
        //   return [d];
        // })

        layer_selection_enter.append("path").attr("class","area")

        g.selectAll(".layer").select(".area")
            .style("fill", function (d) { 
              console.log(d);
              return z(d.key); })
            .attr("d", <any>area);
        
  
        layer_selection_enter//.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
          .append("text")
          .attr("x", width - 6)
          .attr("y", function (d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
          .attr("dy", ".35em")
          .style("font", "10px sans-serif")
          .style("text-anchor", "end")
          .text(function (d) { return d.key; });
  
  
  
        yAxis.call(d3.axisBottom(x));
        xAxis.call(d3.axisLeft(y).ticks(10));
  
  
        layer_selection.exit().remove();
        // svg.exit().remove();
        // yAxis.exit().remove();
        // xAxis.exit().remove();
  
  
      }
  
     
  

    });

   

  }

}
