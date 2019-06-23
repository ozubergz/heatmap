var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

var margin = { left: 100, right: 20, top: 70, bottom: 90 },
width = 1250 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var svg = d3.select('body').
append('svg').
attr('width', width + margin.left + margin.right).
attr('height', height + margin.top + margin.bottom);

var tooltip = d3.select('body').
append('div').
attr('id', 'tooltip').
style('opacity', 0);

d3.json(url).then(data => {

  //set data
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  color = ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"],
  base = 8.66;

  data = data.monthlyVariance;

  data.forEach(d => {
    d.month = months[d.month - 1];
  });

  console.log(data);

  //set scales
  var years = data.map(d => d.year);

  var xScale = d3.scaleBand().
  domain(years).
  range([0, width]);

  var yScale = d3.scaleBand().
  domain(months).
  range([0, height]);

  var colorScale = d3.scaleQuantize().
  domain(d3.extent(data, d => d.variance)).
  range(color);

  //set axes
  var xAxis = d3.axisBottom(xScale).
  tickValues(xScale.domain().filter(year => {
    return year % 10 === 0;
  })).
  tickFormat(d3.format('d'));

  var yAxis = d3.axisLeft(yScale);

  //set g-axes
  svg.append('g').
  call(xAxis).
  attr('id', 'x-axis').
  attr('class', 'axis').
  attr('transform', `translate(${margin.left}, ${height + margin.top})`);

  svg.append('g').
  call(yAxis).
  attr('id', 'y-axis').
  attr('class', 'axis').
  attr('transform', `translate(${margin.left}, ${margin.top})`);

  //heading
  svg.append('text').
  attr('x', width / 2.5).
  attr('y', margin.top / 2).
  attr('id', 'title').
  style('font-size', '24px').
  text('Monthly Global Land-Surface Temperature');

  svg.append('text').
  attr('x', width / 2.2).
  attr('y', margin.top / 1.2).
  style('font-size', '20px').
  attr('id', 'description').
  text("1753 - 2015: Base Temp 8.66℃");

  //set map
  const barWidth = width / (data.length / 12);
  const barHeight = height / 12;

  svg.append('g').
  attr('transform', `translate(${margin.left + 1}, ${margin.top - 0.5})`).
  selectAll('rect').
  data(data).enter().
  append('rect').
  attr('x', d => xScale(d.year)).
  attr('y', d => yScale(d.month)).
  attr('width', xScale.bandwidth()).
  attr('height', yScale.bandwidth()).
  attr('class', 'cell').
  attr('data-year', d => d.year).
  attr('data-month', d => months.indexOf(d.month)).
  attr('data-temp', d => base + d.variance).
  attr('fill', d => colorScale(d.variance)).
  on('mouseover', d => {
    tooltip.transition().duration(20).style('opacity', 0.8);
    tooltip.attr('data-year', d.year);
    tooltip.html(d3.format("d")(d.year) + ", " + d.month + "<br/>" +
    d3.format(".1f")(base + d.variance) + "<br/>" +
    d3.format("+.1f")(d.variance)).
    style('top', d3.event.pageY - 90 + 'px').
    style('left', d3.event.pageX - 45 + 'px');
  }).
  on('mouseout', d => {
    tooltip.transition().duration(100).style('opacity', 0);
  });

  //set legend
  var legendSize = 20;
  var temps = data.map(d => base + d.variance);
  var minTemp = d3.min(temps);
  var maxTemp = d3.max(temps);

  var array = [];
  var step = (maxTemp - minTemp) / color.length;
  for (let i = 1; i < color.length; i++) {
    array.push(minTemp + i * step);
  }

  var legend = svg.selectAll('.legend').
  data(array).
  enter().append('g').
  attr('class', 'legend').
  attr('id', 'legend').
  attr('transform', function (d, i) {
    return 'translate(' + i * legendSize + ', ' + (margin.top + height + 40) + ')';
  });

  legend.append('rect').
  attr('transform', function (d, i) {
    return 'translate(' + margin.left + ', 0)';
  }).
  attr('width', legendSize).
  attr('height', legendSize).
  attr('fill', (d, i) => color[i]);

  legend.append('text').
  attr('class', 'legendTxt').
  text(d => Math.round(d)).
  attr('transform', function (d, i) {
    return `translate(${margin.left + 6}, 33)`;
  });

});