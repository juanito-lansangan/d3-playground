import * as d3 from "d3";

export default class SingleBarChart {
  constructor(el) {
    console.log(el);
    this.init();
  }

  init() {
    console.log("initializing Chart script...");
    this.drawBarChart();
  }

  drawBarChart() {
    const svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([10, width])
      .padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    // tooltips
    const div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("display", "none");

    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("/data/data.tsv", function(d) {
      d.points = +d.points;
      return d;
    }).then((data, error) => {
      if (error) throw error;

      x.domain(
        data.map(function(d) {
          return d.name;
        })
      );
      y.domain([
        0,
        d3.max(data, function(d) {
          return d.points;
        })
      ]);

      g.append("g")
        .attr("class", "axis axis--x")
        // .attr("transform", "translate(0," + height + ")")
        // add margin top space on the names
        .attr("transform", `translate(0, ${height + 5})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        // .call(d3.axisLeft(y).ticks(10, "%"))
        // .call(
        //   d3
        //     .axisLeft(y)
        //     .ticks(5)
        //     .tickFormat(function(d) {
        //       return `${parseInt(d / 1000)} K`;
        //     })
        // )
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "#5D6971")
        .attr("class", "data-label")
        .text("Mobile Legends Rank Points");

      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(d.name);
        })
        .attr("y", function(d) {
          return y(d.points);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return height - y(d.points);
        })
        .on("mouseover", function(d) {
          div.style("display", "inline");
        })
        .on("mousemove", function(d) {
          div
            .html(`${d.name} <hr/> ${d3.format("~s")(d.points)}`)
            .style("left", d3.event.pageX - 34 + "px")
            .style("top", d3.event.pageY - 12 + "px");
        })
        .on("mouseout", function(d) {
          div.style("display", "none");
        });
    });
  }

  type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }
}
