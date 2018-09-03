import * as d3 from "d3";

export default class SingleLineChart {
  constructor(el) {
    console.log(el);
    this.init();
  }

  init() {
    console.log("initializing Chart script...");
    this.drawLineChart();
  }

  drawLineChart() {
    const svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    // const x = d3
    //   .scaleBand()
    //   .rangeRound([10, width])
    //   .padding(0.1);

    // const y = d3.scaleLinear().rangeRound([height, 0]);
    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().rangeRound([0, width]);

    const y = d3.scaleLinear().rangeRound([height, 0]);
    const parseTime = d3.timeParse("%d-%b-%y");

    // tooltips
    const div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("display", "none");

    const line = d3
      .line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.close);
      });

    d3.tsv("/data/data.tsv", function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      return d;
    }).then((data, error) => {
      if (error) throw error;

      x.domain(
        d3.extent(data, function(d) {
          return d.date;
        })
      );
      y.domain(
        d3.extent(data, function(d) {
          return d.close;
        })
      );

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0, ${height + 5})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "#000")
        .attr("class", "data-label")
        .text("Price ($)");

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .on("mouseover", function(d) {
          div.style("display", "inline");
        })
        .on("mousemove", function(d) {
          console.log(d);
          div
            .html(`${d.date} <hr/> ${d.close}`)
            .style("left", d3.event.pageX - 34 + "px")
            .style("top", d3.event.pageY - 12 + "px");
        })
        .on("mouseout", function(d) {
          div.style("display", "none");
        });
    });
  }
}
