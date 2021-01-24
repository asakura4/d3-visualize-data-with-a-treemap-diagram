var url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";


var width = 960;
var height = 660;
var padding = {
  top: 30,
  bottom: 30 };

var legendSize = {
  width: 600,
  offset: 10,
  rectSize: 15,
  hPadding: 150,
  vPadding: 10,
  textXOffset: 3,
  textYOffset: -2 };

var legendElemPerRow = Math.floor(legendSize.width / legendSize.hPadding);



var tooltip = d3.select('.graph-part').
append('div').
attr('id', 'tooltip').
attr('class', 'tooltip').
style('opacity', 0);


var svg = d3.select('.graph-part').
append('svg').
attr('class', 'canvas').
attr('width', width).
attr('height', height + padding.top + padding.bottom);


var color = d3.scaleOrdinal(d3.schemeCategory20c);



d3.json(url, (error, data) => {
  if (error) {
    throw error;
  }

  var root = d3.hierarchy(data).
  eachBefore(d => {
    d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
  }).
  sum(d => d.value).
  sort((a, b) => b.value - a.value);


  var treemap = d3.treemap().
  size([width, height]).
  paddingInner(1);

  treemap(root);


  var graphMap = svg.append('g').
  attr('id', 'treemap');

  var cell = graphMap.selectAll("g").
  data(root.leaves()).
  enter().
  append("g").
  attr("transform", d => `translate(${d.x0},${d.y0})`);

  cell.append('rect').
  attr('id', d => d.data.id).
  attr('class', 'tile').
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  attr('data-name', d => d.data.name).
  attr('data-category', d => d.data.category).
  attr('data-value', d => d.data.value).
  attr('fill', d => color(d.data.category)).
  on('mousemove', d => {
    tooltip.style('opacity', 0.9);
    var str = 'Name: ' + d.data.name +
    '<br/>Category: ' + d.data.category +
    '<br/>Value: ' + d.data.value;
    tooltip.html(str).
    attr('data-value', d.data.value).
    style('left', d3.event.pageX + 10 + 'px').
    style('top', d3.event.pageY - 28 + 'px');

  }).
  on('mouseout', () => {
    tooltip.style('opacity', 0);
  });


  cell.append('text').
  attr('class', 'tile-text').
  selectAll('tspan').
  data(d => d.data.name.split(/(?=[A-Z][a-z])/g)).
  enter().
  append('tspan').
  attr('x', 3).
  attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`).
  attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null).
  text(d => d);


  console.log(root.leaves());

  var categories = root.leaves().map(d => d.data.category);
  console.log(categories);
  var categories = categories.filter((category, idx, self) => {
    return self.indexOf(category) === idx;
  });

  //var categories =[ ...new Set(categories)];
  console.log(categories);


  var legend = d3.select('.legend-part').
  append('svg').
  attr('id', 'legend').
  attr('class', 'canvas').
  attr('width', legendSize.width).
  append('g').
  attr('transform', `translate(60, ${legendSize.offset})`);


  var legendElem = legend.selectAll('g').
  data(categories).
  enter().
  append('g').
  attr('transform', (d, i) => {
    return (
      'translate(' +
      i % legendElemPerRow * legendSize.hPadding +
      ',' + (
      Math.floor(i / legendElemPerRow) * legendSize.rectSize +
      legendSize.vPadding * Math.floor(i / legendElemPerRow)) +
      ')');


  });

  legendElem.append('rect').
  attr('width', legendSize.rectSize).
  attr('height', legendSize.rectSize).
  attr('class', 'legend-item').
  attr('fill', d => color(d));

  legendElem.append('text').
  attr('x', legendSize.rectSize + legendSize.textXOffset).
  attr('y', legendSize.rectSize + legendSize.textYOffset).
  text(d => d);
});