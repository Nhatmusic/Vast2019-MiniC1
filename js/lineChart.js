// Info to show visualization
var lineChartWidth = 600, lineChartHeight = 160,
    lineChartMargin = {top: 10, right: 20, bottom: 10, left: 50},
    lineChartContentWidth = lineChartWidth - lineChartMargin.left - lineChartMargin.right,
    lineChartContentHeight = lineChartHeight - lineChartMargin.top - lineChartMargin.bottom;

// x, y, and color Scale
var lineChartX = d3.scaleTime().range([0, lineChartContentWidth]),
    lineChartY = d3.scaleLinear().range([0,lineChartContentHeight-50]).domain([10,0]),
    lineChartColor = d3.scaleOrdinal().range(d3.schemeCategory10);

// axises definition
var lineChartXAxis = d3.axisBottom(lineChartX),
    lineChartYAxis = d3.axisLeft(lineChartY).ticks(5);

var click_line = true;

function boxDragStarted() {
    let obj = d3.select(this);
    xOffset = d3.event.x - obj.node().getBoundingClientRect().x + 150;
    yOffset = d3.event.y - obj.node().getBoundingClientRect().y + 100;

}

function boxDragged() {
    d3.event.sourceEvent.stopPropagation();
    let obj = d3.select(this);
    let xCoord = d3.event.x - xOffset - 8;
    let yCoord = d3.event.y - yOffset - 80;
    obj.style("left", xCoord + "px");
    obj.style("top", yCoord + "px");

}

function boxDragEnded() {
    d3.event.sourceEvent.stopPropagation();
}

let selectionPanel = d3.select("#box-plot")
    .append("div")
    .attr("class", "floatingBox")
    .style("left", (180) + "px")
    .style("top", (620) + "px");

d3.selectAll(".floatingBox").call(d3.drag()
    .on("start", boxDragStarted)
    .on("drag", boxDragged)
    .on("end", boxDragEnded));

// top move/drag icon
selectionPanel.append("div")
    .attr("class", "floatingBoxHeader")
    .html("<div>" +
        "-------------------------------------------------------------------------------------- " +
        "Box-plot and Standard Deviation Visualiazation for Uncertainty " +
        "---------------------------------------------------------------------------------------" +
        "</div>");

let panelContent = selectionPanel.append("div")
    .attr("class", "floatingBoxContent")
    .attr("id", "mapContent");

// Generate svg, g, and lines
function generateLocationSvg(lineChart,location, standard_deviation, min_value, sample, max_value) {

    var sort_max_value = max_value.map(d=> d.sort((a,b)=>b-a));
    var sort_min_value = min_value.map(d=> d.sort((a,b)=>a-b));
    var svg = panelContent.append("svg").attr("id","svg"+location).attr("width", lineChartWidth).attr("height", lineChartHeight),
        g = svg.append("g").attr("id","g"+location).attr("transform", "translate(" + lineChartMargin.left + "," + 50 + ")");

    // Draw axises
    g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0, " + 90 + ")").call(lineChartXAxis);
    g.append("g")
        .attr("class", "grid").call(lineChartYAxis);

    // Define blur
    var innerFilter = svg.append("defs")
        .append("filter")
        .attr("id", "innerFilter"+location)
        .append("feGaussianBlur")
        .attr("stdDeviation", 1);

    var outerFilter = svg.append("defs")
        .append("filter")
        .attr("id", "outerFilter"+location)
        .append("feGaussianBlur");
        // .attr("stdDeviation", 4);

    // Draw lines
    rowLabelData.forEach((feature,i)=>{
        // console.log(feature);
        drawLine(lineChart,i,location);
    });
    // console.log(rowLabelData);

    // Append title of graph
    g.append("text").attr("x",50).attr("y",0)
        .text("Location " + neighborHood[+location-1].name)
        .style("font-size","8px");

    // Draw Legend for features
    var legend = svg.append("g").attr("id","legend")
        .attr("transform", "translate(" + lineChartMargin.left + ",10)");

    legend.selectAll(".legendRect").data(rowLabelData).enter().append("rect")
        .attr("class","legendRect").attr("id",d=>"legendRect"+d+location)
        .attr("x", (d,i)=>i*80)
        .attr("y", 0).attr("width", 5).attr("height",5)
        .attr("fill", (d,i)=>{
            return lineChartColor(i)})
    .on("click",d=> click_line==true?MouseOver(d,location):MouseOut(d,location));
    // .on("mouseout",d=>MouseOut(d,location));

    legend.selectAll(".legendText").data(rowLabelData).enter().append("text")
        .attr("class","legendText").attr("id",d=>"legendText"+d+location)
        .attr("x", (d,i)=>i*80+10)
        .attr("y", 5).text(d=>d)
        .style("font-size","8px")

    legend.selectAll(".legendDeviation").data(standard_deviation[location-1]).enter().append("text")
        .attr("class","legendDeviation").attr("id",(d,i)=>"legendDeviation"+rowLabelData[i]+location)
        .attr("x", (d,i)=>i*80+10)
        .attr("y", 16).text((d,i)=>(d!=undefined)?"SD: "+d.toFixed(2)+ " #"+(sort_min_value[i].indexOf(d)+1):"NaN")
        .style("fill", (d,i)=> d==d3.min((min_value)[i])?"red":"black")
        .style("font-size","10px")

    legend.selectAll(".legendSample").data(sample[location-1]).enter().append("text")
        .attr("class","legendSample").attr("id",(d,i)=>"legendSample"+rowLabelData[i]+location)
        .attr("x", (d,i)=>i*80+10)
        .attr("y", 24).text((d,i)=>(d!=undefined)?"Reports: "+d + " #" +(sort_max_value[i].indexOf(d)+1):"0")
        .style("fill", (d,i)=> d==d3.max((max_value)[i])?"blue":"black")
        .style("font-size","10px")


    // // hide the svg
    // svg.style("display","none");

}

var outer_opacity = 0.3;
const normal_line_stroke_width = 1;
const hover_line_stroke_width = 2 ;

// Draw parallelLine graph
function drawLine(lineChart,property,location) {
    var thisColor = lineChartColor(property);
    var lineChartG = d3.select("#g"+location);

    var data = [];
    data = lineChart[location-1]
    var step = [];
    data.forEach(d=>step.push(d.step));
    for (i=0;i<121;i++){
        step.includes(i)? 0:data.push({key: undefined, step: i});
    }
    data.sort((a,b) => a.step-b.step)

    // var areaOuter = d3.area().defined(d=>(d.key))
    //     .x(d=>lineChartX(new Date(d.key)))
    //     .y0(d=>lineChartY((d.dataformetric)[property].max))
    //     .y1(d=>lineChartY((d.dataformetric)[property].min))
    //     .curve(d3.curveCatmullRom.alpha(0.5));
    //
    // lineChartG.append("path").datum(data)
    //     .attr("class","lineChart"+location)
    //     .attr("id","outerArea"+rowLabelData[property]+location)
    //     .attr("fill",thisColor).style("opacity",outer_opacity)
    //     .attr("d", areaOuter)
    //     .attr("filter","url(#outerFilter"+location+")");
    //
    var areaInner = d3.area().defined(d=>(d.key))
        .x(d=>{
            return lineChartX(new Date(d.key))})
        .y0(d=>lineChartY((d.dataformetric)[property].quartile1))
        .y1(d=>lineChartY((d.dataformetric)[property].quartile3))
        .curve(d3.curveCatmullRom.alpha(0.5));

    lineChartG.append("path").datum(data)
        .attr("class","lineChart"+location)
        .attr("id","innerArea"+rowLabelData[property]+location)
        .attr("fill",thisColor).style("opacity",0.6)
        .attr("d", areaInner)
        .attr("filter","url(#innerFilter"+location+")");


    //
    var lineChartLine = d3.line().defined(d=> (d.key))
        .x(d=>{
            // console.log(lineChartX(new Date(d.key)))
            return lineChartX(new Date(d.key))
        })
        .y(d=>{
            // console.log(lineChartY((d.dataformetric)[property].mean))
            return lineChartY((d.dataformetric)[property].median)

        })
        .curve(d3.curveCatmullRom.alpha(0.5));

    lineChartG.append("path").datum(data)
        .attr("class","lineChart"+location)
        .attr("id","parallelLine"+rowLabelData[property]+location)
        .attr("stroke",thisColor)
        .attr("stroke-width",normal_line_stroke_width)
        .attr("fill","none")
        .attr("d",lineChartLine)

}

function MouseOver(data) {
    // console.log(data[0].location);
    for (var location=1; location < 20; location ++) {
        rowLabelData.forEach((d, i) => {
            if (d == data) {
                d3.select("#parallelLine" + d + location).attr("stroke-width", hover_line_stroke_width);
                d3.select("#innerArea" + d + location).attr("filter", null);
                d3.select("#outerArea" + d + location).attr("filter", null);
                d3.select("#legendRect" + d + location).style("display", null);
                d3.select("#legendText" + d + location).style("display", null);
                d3.select("#legendDeviation" + d + location).style("display", null);
                d3.select("#legendSample" + d + location).style("display", null);
            } else {
                d3.select("#parallelLine" + d + location).attr("display", "none");
                d3.select("#innerArea" + d + location).attr("display", "none");
                d3.select("#outerArea" + d + location).attr("display", "none");
                d3.select("#legendRect" + d + location).style("display", "none");
                d3.select("#legendText" + d + location).style("display", "none");
                d3.select("#legendDeviation" + d + location).style("display", "none");
                d3.select("#legendSample" + d + location).style("display", "none");
            }
        })
    }
click_line = false;
}

function MouseOut(data){

    for (var location=1; location < 20; location ++) {
        rowLabelData.forEach(d => {
            if (d == data) {
                d3.select("#parallelLine" + d + location).attr("stroke-width", normal_line_stroke_width);
                d3.select("#innerArea" + d + location).attr("filter", "url(#innerFilter" + location + ")");
                d3.select("#outerArea" + d + location).attr("filter", "url(#outerFilter" + location + ")");
            } else {
                d3.select("#parallelLine" + d + location).attr("display", null);
                d3.select("#innerArea" + d + location).attr("display", null);
                d3.select("#outerArea" + d + location).attr("display", null);
                d3.select("#legendRect" + d + location).style("display", null);
                d3.select("#legendText" + d + location).style("display", null);
                d3.select("#legendDeviation" + d + location).style("display", null);
                d3.select("#legendSample" + d + location).style("display", null);
            }
        });
    }
    click_line = true;
}


function getMetrics(data) {
    var temp = [];
    temp = data;
    if (Array.isArray(data)) {
        temp = data.flat().map(d => d==-1?d=0:d=d)
    }
    else {
        temp.push(data);
        temp = temp.map(d => d==-1?d=0:d=d)
    }
    // temp = temp.flat()

    var metrics = {};
    // console.log((data));
    metrics.max = math.max(temp.flat());
    metrics.min = math.min(temp.flat());
    metrics.quartile1 = d3.quantile(temp.flat(), 0.25);
    metrics.quartile3 = d3.quantile(temp.flat(), 0.75);
    metrics.median = d3.median(temp.flat());
    metrics.mean = d3.mean(temp.flat());
    metrics.iqr = metrics.quartile3 - metrics.quartile1;
    metrics.lowerInnerFence = metrics.quartile1 - 1.5*metrics.iqr;
    metrics.upperInnerFence = metrics.quartile3 + 1.5*metrics.iqr

    // console.log(metrics);
    return metrics;

}
