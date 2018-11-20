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

    d3.json("assets/processed_dep_ratio.json").then(<any>function (data) {
      data.forEach(function(d) {
        d['Year'] = d3.timeParse("%Y")(d['Year']);
      });
      data.forEach(function(d) {
        d.Ratio = +d.Ratio;
        d.active = true;
      });

      
      var svg = d3.select("#chart2"),
            margin = {top: 50, right: 20, bottom: 30, left: 160},
            width = <any>svg.attr("width") - margin.left - margin.right,
            height = <any>svg.attr("height") - margin.top - margin.bottom;
      
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      // Define the line
      var stateline = d3.line()
                            // .interpolate("cardinal")
                            .x(function(d) { return x(d['Year']); })
                            .y(function(d) { return y(d['Ratio']); });

      var g = svg.append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var yAxis = g.append("g")
                    .attr("class", "axisY")

      var xAxis = g.append("g")
                    .attr("class", "axisX")
                    .attr("transform", "translate(0," + height + ")");
      
      updateGraph1(data);
      
      
      function updateGraph1(data){
        
        var xyz = d3.extent(data, function (d) { return d['Year'] })
        var min = d3.min(data, function(d) { return d['Ratio']; });
        var max = d3.max(data, function(d) { return d['Ratio']; })

        x.domain(<any>xyz);
        y.domain([1.0, 3.0]);
        xAxis.call(d3.axisBottom(x));
        yAxis.call(<any>d3.axisLeft(y).ticks(10));

       // -----------
        var dataNest = d3.nest()
                          .key(function(d) {return d['Region'];})
                          .entries(data);


 		var result = dataNest.filter(function(val,idx, arr){
          return this("." + val.key).attr("fill") != "#ccc" 
          return true;
				  // matching the data with selector status
				})
				
				
 		var state = g.selectAll(".line")
      .data(result, function(d){return d['key']});

		state.enter().append("path")
			.attr("class", "line");

		state.transition()
			.style("stroke", function(d,i) {console.log(d); return d['color'] = color(d.key); })
			.attr("id", function(d){ return 'tag'+d.key.replace(/\s+/g, '');}) // assign ID
			.attr("d", function(d){
		
				return stateline(d.values)
			});

		state.exit().remove();
                      
        //----------
        
  
      }
    });

    d3.csv("assets/processed_age_distribution.csv", type).then(function (data) {
      var selection = d3.select('select').property('value');
      var data1 = data.filter(x => x['Region'] == selection);

      d3.select('#countries')
        .on("change", function () {
          var selection = d3.select('select').property('value');
          data1 = data.filter(x => x['Region'] == selection);
          data1['columns'] = data.columns.slice(1);

          updateGraph(data1);
        });

      d3.select('#auto')
        .on("click", function () {

          var selection = d3.select('#countries').node();
            
          (function myLoop (i) {          
            setTimeout(function () {  
              var element=selection[i-1] 
              var val = element.value;
              data1 = data.filter(x => x['Region'] == val);
              data1['columns'] = data.columns.slice(1);
              updateGraph(data1);              
               if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
            }, 1500)
         })(10);
          
           
          



        });



      var data1 = data.filter(x => x['Region'] == selection);
      data1['columns'] = data.columns.slice(1);
      var svg = d3.select("#chart1"),
        margin = { top: 10, right: 100, bottom: 60, left: 100 },
        width = <any>svg.attr("width") - margin.left - margin.right,
        height = <any>svg.attr("height") - margin.top - margin.bottom;

      var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);
      var stack = d3.stack();
      var area = d3.area()
        .x(function (d, i) { return x(d['data']['Year']); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); });

      var legend = svg.selectAll('g')
        .data(['<14', '15-64', '65+'])
        .enter()
        .append('g')
        .attr('class', 'legend');

      legend.append('rect')
        .attr('x', <any>svg.attr("width")-70)
        .attr('y', function (d, i) { return height - (330 - i * 30); })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d, i) { return z(i.toString()); });

      legend.append('text')
        .attr('x', <any>svg.attr("width")-50)
        .attr('y', function (d, i) { return height - (326 - i * 30); })
        .attr("dy", ".35em")
        .style("font", "12px sans-serif")
        .text(function (d) { return d; });

      var legendText = svg.append('text')

      legendText.attr("x", <any>svg.attr("width"))
        .attr("y", height - 350)
        .attr("dy", ".35em")
        .style("font", "14px sans-serif")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .text("Age Groups");


      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var xAxis = g.append("g")
        .attr("class", "axis axis--y")

      var yAxis = g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

      var xLab = svg.append('text')

      xLab.attr("x", 535)
        .attr("y", 625)
        .attr("dy", ".35em")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Year");

      var yLab = svg.append('text').attr("class", "yLab")

      yLab.attr("x", -210)
        .attr("y", 40)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Population (in Million / 10)");
      var is_pct = false;
      updateGraph(data1);

      d3.select('#pp').on("click", function () {
        is_pct = false;
        updateGraph(data1);

      });
      d3.select('#pppct').on("click", function () {
        is_pct = true;
        updateGraph(data1);
      });





      function updateGraph(data) {




        var country = data[0].Region;

        data.map(x => !x.Region);
        if (is_pct) {
          var title = "Percentage of Age in " + country;
          var ylab = "Percentage";
          var X = -270;
          var Y = 50
        }
        else {
          var title = "Age Distribution in " + country;
          var ylab = "Population (in Million / 10)";
          var X = -210;
          var Y = 50;
        }
        d3.select("#title").style("font-weight", "bold").text(title)
        yLab.transition().duration(800).attr("x", X)
          .attr("y", Y)
          .attr("dy", ".35em")
          .attr("transform", "rotate(-90)")
          .style("font", "11px sans-serif")
          .style("text-anchor", "end")
          .text(ylab);

        var keys = data.columns.slice(1);

        if (is_pct) {
          data = data.map(function (d, i) {

            var sum = d.Middle + d.Young + d.Old;

            return { Year: d.Year, Middle: d.Middle * 100 / sum, Old: d.Old * 100 / sum, Young: d.Young * 100 / sum };

          });
          y.domain([0, 100]);
        }
        else {

          y.domain([0, <any>d3.max(data, function (d) { return d['Young'] + d['Middle'] + d['Old'] + 300; })]);

        }
        var xyz = d3.extent(data, function (d) { return d['Year'] })
        x.domain(<any>xyz);
        z.domain(keys);

        stack.keys(keys);



        var layer_selection = g.selectAll(".layer")
          .data(stack(data))

        var layer_selection_enter = layer_selection.enter().append("g")
          // .transition().duration(400)
          .attr("class", "layer");



        layer_selection_enter.append("path").attr("class", "area")

        g.selectAll(".layer").select(".area")
          .style("fill", function (d) {
            return z(d['key']);
          })
          .transition().duration(800)
          .attr("d", <any>area);


        // layer_selection_enter.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
        //   .append("text")
        //   .attr("x", width - 6)
        //   .attr("y", function (d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
        //   .attr("dy", ".35em")
        //   .style("font", "10px sans-serif")
        //   .style("text-anchor", "end")
        //   .text(function (d) { return d.key; });



        yAxis.call(d3.axisBottom(x));
        xAxis.transition().duration(800).call(<any>d3.axisLeft(y).ticks(10));


        layer_selection.exit().remove();
        // svg.exit().remove();
        // yAxis.exit().remove();
        // xAxis.exit().remove();


      }




    });



  }

}
