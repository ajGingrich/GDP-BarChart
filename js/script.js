var objData = [];
var arrData = [];
var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var date;

$.ajax({
    url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
    type: 'GET',
    dataType: 'json',
    success: function(data) {
        ///set margins
        var margin = {top: 40, right: 40, bottom: 40, left:20};
        var height = 500 - margin.top - margin.bottom;
        var width = 900 - margin.right - margin.left;

        //gdpArray = data.data;
        objData = data.data;
        //make array of GDP and years
        for (var i=0; i<objData.length; i++) {
            date = new Date(objData[i][0]);
            arrData.push({year: date.getFullYear(), month: months[date.getMonth()-2], gdp: objData[i][1]})
        }

        var minDate = new Date (arrData[0].year, months.indexOf(arrData[0].month));
        var maxDate = new Date (arrData[arrData.length-1].year, months.indexOf(arrData[arrData.length-1].month));

        var svg = d3.select("#chartContainer")
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var yScale = d3.scaleLinear()
            .domain([0, 20000])
            .range([height, 0]);

        var xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, 825]);

        var axisVertical = d3.axisRight(yScale).ticks(10);
        var axisHorizontal = d3.axisBottom(xScale);

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .html('ok');

        svg.append('g')
            .attr("class", "yAxis")
            .attr('transform', 'translate(825, 0)')
            .call(axisVertical);

        svg.append('g')
            .attr("class", "xAxis")
            .attr('transform', 'translate(0, 420)')
            .call(axisHorizontal);


        var bars = svg.selectAll("rect")
            .data(arrData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            //.attr("margin-top", margin.top)
            .attr("width", 3)
            .attr("height", function(d) {return height - yScale(d.gdp)})
            .attr("x", function(d, i) {return i*3})
            .attr("y", function(d) {return yScale(d.gdp)})
            .on('mouseover', function(d) {return tooltip
                            .html("<div class='toolText'>GDP:  "  + d.gdp + '<br> Year:  ' + d.year + '<br> Month:  ' + d.month + "</div>")
                            .style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on('mouseout', function() {return tooltip.style("visibility", "hidden");});

    },
    error: function() {
        alert('error');
    }
});



