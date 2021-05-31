// Harcoded position of hospital and nuclear plant
var hospitals = [
    {name: 1, position: [-119.959400, 0.180960]},
    {name: 2, position: [-119.915900, 0.153120]},
    {name: 3, position: [-119.909520, 0.151090]},
    {name: 4, position: [-119.904300, 0.121800]},
    {name: 5, position: [-119.883420, 0.134560]},
    {name: 6, position: [-119.855580, 0.182990]},
    {name: 7, position: [-119.828610, 0.041470]},
    {name: 8, position: [-119.744800, 0.065250]}];
var nuclearPlant = [-119.784825, 0.162679];

var neighborHood = [
    {name: "PALACE HILLS", position: [-119.975400, 0.165560]},
    {name: "NORTHWEST", position: [-119.930400, 0.183860]},
    {name: "OLD TOWN", position: [-119.873400, 0.193060]},
    {name: "SAFE TOWN", position: [-119.820400, 0.167060]},
    {name: "SOUTH WEST", position: [-119.930400, 0.110060]},
    {name: "DOWNTOWN", position: [-119.930400, 0.140060]},
    {name: "WILSON FOREST", position: [-119.730400, 0.088060]},
    {name: "SCENIC VISTA", position: [-119.780400, 0.032060]},
    {name: "BROADVIEW’s", position: [-119.843400, 0.052060]},
    {name: "CHAPPARAL’s", position: [-119.803400, 0.052060]},
    {name: "TERRAPIN SPRINGS", position: [-119.770400, 0.073060]},
    {name: "PEPPER MILL’s", position: [-119.765400, 0.103060]},
    {name: "CHEDDARFORD’s", position: [-119.811400, 0.106060]},
    {name: "EASTON", position: [-119.870800, 0.153120]},
    {name: "WESTON", position: [-119.898520, 0.151090]},
    {name: "SOUTHTON", position: [-119.900400, 0.119060]},
    {name: "OAK WILLOW", position: [-119.853400, 0.083060]},
    {name: "EAST PARTON", position: [-119.843400, 0.117060]},
    {name: "WEST PARTON", position: [-119.876400, 0.106060]}];

const GEO_OPACITY_DEFAULT = 0.3;
const GEO_OPACITY_HOVER = 0.7;

//define svg size of each geo graph
var geoWidth = 300;
var geoHeight = 200;
//Draw Geomap using geodata
var projection = d3.geoMercator().center([-119.78, 0.15]).scale(120000);
var geopath = d3.geoPath().projection(projection);
const topicColor = ["red", "#ff0000"];
var wsTooltipContainer = d3.select("body").append("div")
    .attr('id', "wsTooltipContainer");

var wsTooltipDiv = wsTooltipContainer.append("div")
    .attr("class", "wsTooltip")
    .attr("id", "wsTooltip")
    .style("visibility", "hidden");
var columns = ["Location","Damage_Intensity","Total_Report", "Note"];
var ProjectInfo = [
    {Area: 1, Note:["None", "Palace Hills area of town is known for its advanced medical surgical care", "None", "None", "None","None"]},
    {Area: 2, Note:["None", "None", "is a growing neighborhood of upscale condominiums, modern apartment buildings, and townhouses", "None","None","None"]},
    {Area: 3, Note:["None", "OLD TOWN HOSPITAL in the historic Old Town district is known for its expertise in diabetes and endocrinology, digestive health, oncology, and orthopedics",
            "is the historic center of our city and the structures here are renowned for their decorative brickwork",
            "we are working to modernize the electrical distribution system. Expect power outages lasting 30-60 minutes throughout the week",
            "None",
            "old water supply lines are being replaced throughout the neighborhood"]},
    {Area: 4, Note: ["None","None","is a neighborhood of older single-family homes",
            "None","None","None"]},
    {Area: 5, Note: ["None", "None", "SOUTHWEST’s mixture of light industry, single-family homes and garden apartments, and theaters ",
            "repairs to the substation that supplies Southwest is causing intermittent power outages","None","None"]
    },
    {Area: 6, Note: ["None", "Trauma&Children Hospital", "Housing is an eclectic mix of luxury lofts and modest apartments",
            "None","resurfacing of collector roads, traffic signal repairs. Delays expected","None"]},
    {Area: 7, Note: ["None","None","is a developing area of new single-family homes in a beautiful, tranquil, wooded area",
            "None","Wilson Highway – shoulder repair resulting in occasional traffic delays","None"]},
    {Area: 8, Note: ["None","None","has large, custom-built single-family homes to secure, gated communities, trendy apartments, and exclusive condominiums","None",
            "resurfacing of residential streets resulting in minimal delays to traffic","None"]},
    {Area: 9, Note: ["None", "COMMUNITY HOSPITAL", "None", "None","older single-family homes known for their architectural styles and masonry construction are mixed with city parks",
            "resurfacing of residential streets resulting in minimal delays to traffic","None"]},
    {Area: 10, Note: ["None", "None","rural lifestyle and rustic 18th and 19th century farmhouses","None",
            "resurfacing of collector roads. Expect delays","None"]},
    {Area: 11, Note: ["None","GOLDCARE HOSPITAL in Terrapin Springs is a full-service, non-profit community hospital",
            "mixes farm houses with newer, custom homes with lots of acreage","None","None","None"]},
    {Area: 12, Note: ["None","None", "low-density housing, great restaurants and shopping along the water attracts tourists and locals alike",
            "None","None","None"]},
    {Area: 13, Note: ["None","None","quiet residential areas and slow-paced lifestyle",
            "None","resurfacing of collector roads. Expect delays","None"]},
    {Area: 14, Note: ["None", "None", "is renowned for excellent schools and quaint single-family brick homes with manicured lawns",
            "None","None","None"]},
    {Area: 15, Note: ["None", "None", "Cozy condos and apartment, and lofts above businesses","None","None","None"]},
    {Area: 16, Note: ["None", "EAGLEPEAK HOSPITAL", "is a quiet neighborhood of older homes and modern garden-style apartment buildings",
            "None", "resurfacing of residential streets resulting in minimal delays to traffic", "None"]},
    {Area: 17, Note: ["None", "None", "is close to work, shopping and nightlife for educated couples and young single professionals",
            "None", "None","None"]},
    {Area: 18, Note: ["None", "None", "is known for its masonry facades, strong community sports programs and short commute","None","None"
            ,"a broken water main is currently being repaired at the intersection of Blair and Quealy"
        ]},
    {Area: 19, Note: ["None","None","located in the heart of the city, is home for families looking for a short commute to work and play call",
                "None","None","routine maintenance on the sewer lines is ongoing"]}
];





function analyzed_geo_data(data) {
     info = [];
    var temp_data_array = [];
    temp_data_array = d3.nest().key(d => d.location).entries(data);
    const reducer_geo = (accumulator, currentValue) => accumulator + currentValue;
    temp_data_array.forEach(d => {
        let temp_value = [];
        let temp_data = [];
        d.values.forEach(d1 => {
            // d1.values.forEach(d2 => {
            temp_value.push(d1.noreport);
            temp_data.push(d1.data);
            // })
        })
            var collect_value_data  = _.unzip(temp_data);
            var collect_report_data = _.unzip(temp_value);
            // console.log(collect_report_data)
            var report=[];
            collect_report_data.forEach( d3 => {
                report.push(d3.reduce(reducer_geo));
            })

            var get_mean = [];
            collect_value_data.forEach( (d,i) => {
                var sum = 0;
                for (var j = 0; j < collect_report_data[0].length; j++) {
                    sum += d[j]*collect_report_data[i][j]
                }
                get_mean.push(sum)

            })
            d.value = get_mean.map(function(n, i) {
                if (report[i] != 0) {
                    return n / report[i];
                }
                else{
                    return n = -1;
                }
            });
            d.noreport = report;

    });

    //prepare data for tooltip
    temp_data_array.forEach((d,i)=>info.push({Location:d.key, Total_Report: d.noreport, Damage_Intensity: d.value, Note:ProjectInfo[i].Note}))
    // info.sort((a, b) => (a.Total_Report - b.Total_Report));
    return temp_data_array;


}


function filterGeoTimeRange(timeRange) {
    // console.log(timeRange)
    d3.select("#loader").style("display", "block");
    // console.log("to5")
    var selectedGeoData = array_data_total.flat().filter(function (d) {
        return timeRange[0] <= d.time && d.time <= timeRange[1];
    });
    console.log(selectedGeoData)
    var check_full_location = [];
    var location_in_geo = [];
    check_full_location = d3.nest().key(d=>d.location).entries(selectedGeoData)
    check_full_location.forEach(d=>location_in_geo.push(d.key))
    for (i=1; i<20; i++){
        location_in_geo.includes(i)? 0:selectedGeoData.push({data: [0,0,0,0,0,0], step: i, noreport: [0,0,0,0,0,0], location: i});
    }
    var geo_data = analyzed_geo_data(selectedGeoData)

    // console.log(geo_data)
    for (var i=0; i<6; i++)
    {
        updateGeoFill(i,geo_data)
    }

    var selectedHeatmap_data = [];
    array_data_total.forEach(function (d) {
        return selectedHeatmap_data.push(d.filter(function (d1) {
            return timerangedata[0] <= d1.time && d1.time <= timerangedata[1];
        }))
    })
    svg_heatmap.selectAll("g").remove();
    var cellSize = 4;
    Update_heatmap(selectedHeatmap_data, cellSize,1840)
    drawLinegraph(selectedHeatmap_data)

    // console.log("to6")
}

function updateGeoFill(i,geo_data) {
    for (var location =1; location < 20; location ++) {

        d3.select("#geo" + i + location).attr("fill", function () {
            (geo_data[location-1].value)[i]==undefined?(geo_data[location-1].value)[i]=0:0;
            if ((geo_data[location-1].value)[i] > 0) {
                return colorScale((geo_data[location - 1].value)[i]);
            }
            else {
               return "white";
            }
        })
            .attr("stroke-width", function () {
                return report_scale((geo_data[location-1].noreport)[i])
            })
            .on('mouseover', function (d) {
                tooltip_geo.html('<div class="heatmap_tooltip">' + "Location: " + d.properties.Nbrhood + "<br/>" + "Damage Level: " + (geo_data[d.properties.Id-1].value)[i].toFixed(2) + "<br/>" +
                    "Report Quantity: " + ((geo_data[d.properties.Id -1]).noreport[i]) + "<br/>" +'</div>');
                tooltip_geo.style("visibility", "visible");
            })

    }
}


// Draw the geospatial diagram
function drawMap(geojsonFeatures, feature_id,geo_data) {
    var svgGeo = d3.select(".geospatial" + feature_id).append("svg").attr("width", geoWidth).attr("height", geoHeight)
        .attr('viewBox', "0 0 700 600");
    groupGeo = svgGeo.append("g").attr("transform", "translate(30,10)");
    // create tooltip
    tooltip_geo = d3.select("#row")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden");
    var store_report = [];
    geo_data.forEach(d=> store_report.push(d.noreport))
    //scale the number of report to [0,5,6]; for stroke-width of geo graph
    report_scale_geo = d3.scaleLinear().domain([math.min(store_report), math.max(store_report)]).range([0.5, 6]);
    //Draw Map
    groupGeo.selectAll("path").data(geojsonFeatures)
        .enter()
        .append("path").attr("d", geopath)
        .attr("id", d => "geo" + feature_id + d.properties.Id)
        // .data(geojson)
        .attr("fill", d => {
            if ((geo_data[d.properties.Id-1].value)[feature_id]<0){
                return "white"
            }
            else {
                return colorScale((geo_data[d.properties.Id - 1].value)[feature_id])
            }
        })
        .attr("fill-opacity", GEO_OPACITY_DEFAULT)
        .attr("stroke", "#222")
        .attr("stroke-width",function(d) {
            return report_scale_geo((geo_data[d.properties.Id-1].noreport)[feature_id])
        })
        .on('mouseover', function (d) {
            tooltip_geo.html('<div class="heatmap_tooltip">' + "Location: " + d.properties.Nbrhood + "<br/>" + "Damage Level: " + (geo_data[d.properties.Id-1].value)[feature_id].toFixed(2) + "<br/>" +
                "Report Quantity: " + ((geo_data[d.properties.Id -1]).noreport[feature_id]) + "<br/>" +'</div>');
            tooltip_geo.style("visibility", "visible");
        })
        .on('mouseout', function () {
            tooltip_geo.style("visibility", "hidden");
            wsTooltipDiv.style("visibility","hidden");
        })
        .on("mousemove", function () {
            wsTooltipDiv.style("top", (d3.event.pageY) + "px").style("left", (d3.event.pageX - 65) + "px");
            tooltip_geo.style("top", (d3.event.pageY - 120) + "px").style("left", (d3.event.pageX - 65) + "px");
        })
        .on("click", function(cell) {
            tooltip_geo.style("visibility", "hidden");
            wsTooltipDiv.style("visibility","visible");
            createTableTooltip(wsTooltipDiv,info, feature_id)
        });
    groupGeo.selectAll("geoHospitals").data(hospitals)
        .enter()
    .append("svg:image")
        .attr("xlink:href", "https://img.icons8.com/small/32/000000/hospital-bed.png")
        .attr("x",d => projection(d.position)[0])
        .attr("y", d => projection(d.position)[1])
        .attr("width", "15")
        .attr("height", "15");

groupGeo.append("svg:image")
        .attr("xlink:href", "https://img.icons8.com/small/52/000000/nuclear-power-plant.png")
.attr("x", d => projection(nuclearPlant)[0])
        .attr("y", d => projection(nuclearPlant)[1])
        .attr("width", "40")
        .attr("height", "40");

    // Draw neighborhood text
    groupGeo.selectAll("neighborText").data(neighborHood)
        .enter()
        .append("text").attr("font-size", "10px")
        .attr("id", d => "locationText" + d.name)
        .attr("x", d => projection(d.position)[0])
        .attr("y", d => projection(d.position)[1])
        .attr("transform", d => {
            if (d.name == "WILSON FOREST")
                return "translate(230,990) rotate(-90)";
            else if (d.name == "CHAPPARAL’s")
                return "translate(30,908) rotate(-90)";
            else if (d.name == "SCENIC VISTA")
                return "translate(-150,255) rotate(-25)";
            return null;
        })
        .text(d => d.name);
}

function createTableTooltip(wsTooltipDiv, info, feature_id) {
    wsTooltipDiv.selectAll("*").remove();
    // process info text

    let table = wsTooltipDiv.append("table")
            .attr("class", "tableTooltip")
            .attr("id", "tableTooltip")
            .style("width", "100%"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .attr("class", column => "column-" + column)
        .text(column => capitalize(column));

    // create a row for each record
    let rows = tbody.selectAll("tr")
        .data(info)
        .enter()
        .append("tr");


    let cells = rows.selectAll("td")
        .data(function (row) {
            return columns.map(function (column) {
                return {column: column, value: row[column]}
            })
        })
        .enter()
        .append("td")
        .style("color", d => ((d.column === "Location")) ? topicColor[1] : "#000")
        .html(function (d) {
            if (d.column == "Location"){
                return neighborHood[d.value-1].name;
            }
           else if (d.column == "Damage_Intensity") {
               return (d.value[feature_id]).toFixed(2);
            }
           else {
               return d.value[feature_id];
            }
        })
    ;
}

function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}




