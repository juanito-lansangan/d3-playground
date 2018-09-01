import * as d3 from "d3";

export default class Chart {
  constructor(el) {
    console.log(el);
    this.init();
  }

  init() {
    console.log("initializing Chart script...");
    this.drawBarChart();
  }

  drawBarChart() {
    // const width = 420;
    // const barHeight = 20;

    // const x = d3.scaleLinear().range([0, width]);

    // const chart = d3.select(".chart").attr("width", width);
    // .attr("height", barHeight * data.length);

    // d3.tsv("/data/data.tsv", this.type).then(data => {
    //   console.log(data);
    // });
    const svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("/data/data.tsv", function(d) {
      d.frequency = +d.frequency;
      return d;
    }).then((data, error) => {
      console.log(data);
      if (error) throw error;

      x.domain(
        data.map(function(d) {
          return d.letter;
        })
      );
      y.domain([
        0,
        d3.max(data, function(d) {
          return d.frequency;
        })
      ]);

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "%"))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(d.letter);
        })
        .attr("y", function(d) {
          return y(d.frequency);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return height - y(d.frequency);
        });
    });
  }

  type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }
}
