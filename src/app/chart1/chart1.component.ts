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



    var flagDR = 0;
    function type(d, i, columns) {
      d.Year = d3.timeParse("%Y")(d.Year);

      for (var i = <any>2, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
      return d;
    }


    d3.csv("assets/processed_age_distribution.csv", type).then(function (data) {
      var selection = d3.select('select').property('value');
      var data1 = data.filter(x => x['Region'] == selection);

      d3.select('#countries')
        .on("change", function () {
          var selection = d3.select('select').property('value');
          data1 = data.filter(x => x['Region'] == selection);
          data1['columns'] = data.columns.slice(1);
          updateGraph(data1);
          updateGraph2(data1);
        });

      d3.select('#auto')
        .on("click", function () {
          //   var selection = d3.select('#countries').node();

          //   (function myLoop (i) {          
          //     setTimeout(function () {  
          //       var element=selection[i-1] 
          //       var val = element.value;
          //       data1 = data.filter(x => x['Region'] == val);
          //       data1['columns'] = data.columns.slice(1);
          //       updateGraph(data1);              
          //        if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
          //     }, 1500)
          //  })(10);
          if (flagDR == 0) {
            d3.selectAll(".dr").transition().duration(800).style("opacity", 1);
            d3.selectAll(".area").transition().duration(800).style("opacity", 0.4);
            d3.selectAll(".yaxis").transition().duration(800).style("stroke-opacity", 0.4);
            d3.selectAll(".yLab").transition().duration(800).style("opacity", 0.3);
            // d3.selectAll(".yaxis text").transition().duration(800).style("opacity", 0.4);
            flagDR = 1;
          }
          else {
            d3.selectAll(".dr").transition().duration(800).style("opacity", 0);
            d3.selectAll(".area").transition().duration(800).style("opacity", 1);
            d3.selectAll(".yaxis").transition().duration(800).style("stroke-opacity", 1);
            d3.selectAll(".yLab").transition().duration(800).style("opacity", 1);
            // d3.selectAll(".yaxis text").transition().duration(800).style("opacity", 1);
            flagDR = 0;
          }




        });



      var data1 = data.filter(x => x['Region'] == selection);
      data1['columns'] = data.columns.slice(1);
      var svg = d3.select("#chart1"),
        margin = { top: 10, right: 150, bottom: 60, left: 100 },
        width = <any>svg.attr("width") - margin.left - margin.right,
        height = <any>svg.attr("height") - margin.top - margin.bottom;

      var svg2 = d3.select("#chart2"),
        margin = { top: 10, right: 150, bottom: 60, left: 100 },
        width = <any>svg2.attr("width") - margin.left - margin.right,
        height = <any>svg2.attr("height") - margin.top - margin.bottom;

      var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        _y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(['orange', 'yellow', 'silver']);
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
        .attr('x', <any>svg.attr("width") - 70)
        .attr('y', function (d, i) { return height - (330 - i * 30); })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d, i) { return z(i.toString()); });

      legend.append('text')
        .attr('x', <any>svg.attr("width") - 50)
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
        .attr("class", "yaxis")


      var yAxis = g.append("g")
        .attr("class", "yArea")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

      var yDep = g.append("g")
        .attr("class", "dr")
        .attr("transform", "translate(" + width + ",0" + ")")
        .style("opacity", 0);;

      var xLab = svg.append('text')

      xLab.attr("x", 500)
        .attr("y", 530)
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

      var depLab = svg.append('text').attr("class", "dr")

      depLab.attr("x", 320)
        .attr("y", -890)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Dependency Ratio")
        .style("opacity", 0);

      ///....

      var legend2 = svg2.selectAll('g')
        .data(['<14', '15-64', '65+'])
        .enter()
        .append('g')
        .attr('class', 'legend');

      legend2.append('rect')
        .attr('x', <any>svg2.attr("width") - 70)
        .attr('y', function (d, i) { return height - (330 - i * 30); })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d, i) { return z(i.toString()); });

      legend2.append('text')
        .attr('x', <any>svg2.attr("width") - 50)
        .attr('y', function (d, i) { return height - (326 - i * 30); })
        .attr("dy", ".35em")
        .style("font", "12px sans-serif")
        .text(function (d) { return d; });

      var legendText2 = svg2.append('text')

      legendText2.attr("x", <any>svg2.attr("width"))
        .attr("y", height - 350)
        .attr("dy", ".35em")
        .style("font", "14px sans-serif")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .text("Age Groups");

      var g2 = svg2.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var xAxis2 = g2.append("g")
        .attr("class", "yaxis")


      var yAxis2 = g2.append("g")
        .attr("class", "yArea")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

      

      var xLab2 = svg2.append('text')

      xLab2.attr("x", 500)
        .attr("y", 530)
        .attr("dy", ".35em")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Year");

      var yLab2 = svg2.append('text').attr("class", "yLab")

      yLab2.attr("x", -210)
        .attr("y", 40)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Population (in Million / 10)");

      var depLab2 = svg2.append('text').attr("class", "dr")

      depLab2.attr("x", 320)
        .attr("y", -890)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("font", "11px sans-serif")
        .style("text-anchor", "end")
        .text("Dependency Ratio")
        .style("opacity", 0);



      //    ....



      var is_pct = false;
      updateGraph(data1);
      updateGraph2(data1);

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
        _y.domain([0.0, 4.0]);

        stack.keys(keys);



        var layer_selection = g.selectAll(".layer")
          .data(stack(data))

        var layer_selection_enter = layer_selection.enter().append("g")
          // .transition().duration(800)
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
        yDep.call(d3.axisRight(_y));


        layer_selection.exit().remove();
        // svg.exit().remove();
        // yAxis.exit().remove();
        // xAxis.exit().remove();

        var rects = g.selectAll("rect").data(data, function (d) { return d['Year']; });
        rects.enter() //ENTER
          .append('rect')
          .attr('class', 'dr')
          .attr('x', function (d) { return x(d['Year']); })
          .attr('y', function (d) { return _y(d['Middle'] / (d['Young'] + d['Old'])); })
          .attr('width', 2)
          .attr('height', function (d) { return height - _y(d['Middle'] / (d['Young'] + d['Old'])); })
          .style('fill', 'black')
          .style("opacity", 0);

        rects.transition()
          .duration(800)
          .attr('x', function (d) { return x(d['Year']); })
          .attr('y', function (d) { return _y(d['Middle'] / (d['Young'] + d['Old'])); })
          .attr('width', 2)
          .attr('height', function (d) { return height - _y(d['Middle'] / (d['Young'] + d['Old'])); })
          .style('fill', 'black')

        //rects.exit().remove();

        var circle = g.selectAll('circle').data(data, function (d) { return d['Year']; });

        circle.enter()
          .append('circle')
          .attr('class', 'dr')
          .attr('r', 4)
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y(d['Middle'] / (d['Young'] + d['Old'])); })
          .style('fill', 'red')
          .style("opacity", 0)
          .on("mouseover", function (d) {
            d3.select(this)
              .style("opacity", 0.5)
              .style("cursor", "pointer");
            g.append('line')
              .attr("id", "limit")
              .attr('x1', x(d['Year']))
              .attr('y1', _y(d['Middle'] / (d['Young'] + d['Old'])))
              .attr('x2', width)
              .attr('y2', _y(d['Middle'] / (d['Young'] + d['Old'])))
              .attr('stroke', 'red')
              .style("stroke-width", "3")
              .style("stroke-dasharray", "3 6")
            var num = Math.round(d['Middle'] / (d['Young'] + d['Old']) * 10) / 10
            g.append('text')
              .attr('id', 'texty')
              .attr('x', x(d['Year']))
              .attr('y', _y(d['Middle'] / (d['Young'] + d['Old'])) - 20)
              .attr('fill', 'red')
              .attr('text-anchor', 'middle')
              .text(num.toString())
          })
          .on("mouseleave", function (d) {
            d3.select(this)
              .style("opacity", 1)
              .style("cursor", "none");
            g.selectAll('#limit').remove()
            g.selectAll('#texty').remove()
          });

        circle.transition()
          .duration(800)
          .attr('r', 4)
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y(d['Middle'] / (d['Young'] + d['Old'])); })
          .style('fill', 'red')
        // .on("mouseover", function(d){
        //   d3.select(this)
        //     .style("cursor", "pointer");
        // })
        // .on("mouseleave", function(d){
        //   d3.select(this)
        //     .style("cursor", "none");
        // });

        circle.exit().remove();

      }

      function updateGraph2(data) {
        var country = data[0].Region;

        data.map(x => !x.Region);
       
          var title2 = "Dependency ratio in " + country;
          var ylab2 = "Percentage";
          var X = -270;
          var Y = 50
     
       

        yLab.transition().duration(800).attr("x", X)
          .attr("y", Y)
          .attr("dy", ".35em")
          .attr("transform", "rotate(-90)")
          .style("font", "11px sans-serif")
          .style("text-anchor", "end")
          .text(ylab2);

        var keys = data.columns.slice(1);

        
          data = data.map(function (d, i) {

            var sum = d.Middle + d.Young + d.Old;

            return { Year: d.Year, Middle: d.Middle * 100 / sum, Old: d.Old * 100 / sum, Young: d.Young * 100 / sum };

          });
          y.domain([0, 100]);
      

        //  y.domain([0, <any>d3.max(data, function (d) { return d['Young'] + d['Middle'] + d['Old'] + 300; })]);

            
        var xyz = d3.extent(data, function (d) { return d['Year'] })
        var x = d3.scaleTime().range([0, width]);
        //console.log(xyz)
        x.domain(<any>xyz);
        _y.domain([0.0, 4.0]);
        

        yAxis2.call(d3.axisBottom(x));
        xAxis2.transition().duration(800).call(<any>d3.axisLeft(_y).ticks(10));

        


        var circle = g2.selectAll('circle').data(data, function (d) { return d['Year']; });
        circle.enter()   .append('circle')
        .attr('class', 'dr')
        .attr('r', 20)
        .attr('cx', function (d) { return x(d['Year']); })
        .attr('cy', function (d) { return _y(d['Middle'] / (d['Young'] + d['Old'])); })
        .style('fill', 'grey')
        circle.enter()    .append('circle')
        .attr('class', 'dr')
        .attr('r', 15)
        .attr('cx', function (d) { return x(d['Year']); })
        .attr('cy', function (d) { return _y(d['Middle'] / (d['Young'] + d['Old'])); })
        .style('fill', 'yellow')
        
        circle.enter()
          .append('circle')
          .attr('class', 'dr')
          .attr('r', 8)
          .attr('cx', function (d) { return x(d['Year']); })
          .attr('cy', function (d) { return _y(d['Middle'] / (d['Young'] + d['Old'])); })
          .style('fill', 'orange')
         
          circle.transition()
          .duration(800)
          
          d3.select("#title2").style("font-weight", "bold").text(title2)


      }




    });



  }

}
