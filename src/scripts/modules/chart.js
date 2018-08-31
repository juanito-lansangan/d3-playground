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
    const data = [4, 8, 15, 16, 23, 42];
    const width = 420;
    const barHeight = 20;

    const x = d3.scaleLinear().range([0, width]);

    const chart = d3.select(".chart").attr("width", width);
    // .attr("height", barHeight * data.length);

    d3.tsv("/data/data.tsv", this.type).then(data => {
      console.log(data);
      x.domain([
        0,
        d3.max(data, function(d) {
          return d.value;
        })
      ]);

      const bar = chart
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          console.log(d, i);
          return `translate(0, ${i * barHeight})`;
        });
      // console.log(x);
      bar
        .append("rect")
        .attr("width", function(d) {
          return x(d.value);
        })
        .attr("height", barHeight - 1);

      bar
        .append("text")
        .attr("x", function(d) {
          console.log("====================================");
          console.log(d);
          console.log("====================================");
          return x(d.value) - 3;
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) {
          return d.value;
        });
    });
  }

  type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }
}
