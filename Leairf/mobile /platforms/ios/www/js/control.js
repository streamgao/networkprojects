
/**
 * Created by stream on 05/05/15.
 */

/*---------for menu------------*/
$(document).ready(function(){
                  loadMenu();
                  });

function loadMenu(){
    
    $('#sidebar li.active').addClass('open').children('ul').show();
    $('#sidebar li.has-sub>a').on('click', function(){
                                  $(this).removeAttr('href');
                                  var element = $(this).parent('li');
                                  if (element.hasClass('open')) {
                                  element.removeClass('open');
                                  element.find('li').removeClass('open');
                                  element.find('ul').slideUp();
                                  }
                                  else {
                                  element.addClass('open');
                                  element.children('ul').slideDown();
                                  element.siblings('li').children('ul').slideUp();
                                  element.siblings('li').removeClass('open');
                                  element.siblings('li').find('li').removeClass('open');
                                  element.siblings('li').find('ul').slideUp();
                                  }
                                  });
}
/*--------menu over---------*/




/*--------draw graph---------*/

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        console.log("withCredentials");
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
        console.log("undefined");
    } else {
        console.log("not supported!");
        xhr = null;
    }
    return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {
    // All HTML5 Rocks properties support CORS.
    var url = 'http://airwearable.herokuapp.com/historydata';
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return ;
    }
    // Response handlers.
    xhr.onload = function() {
        var dataParse =JSON.parse(xhr.responseText);
        for (var i=0;i<dataParse.length;i++){
            dataParse[i]['date'] = new Date(JSON.parse(JSON.stringify(dataParse[i]['date'])));
            console.log(dataParse[i]['date'].toString());
            //dataParse[i]['date'].toLocaleFormat('%d-%m-%Y');
            
        }
        
        DrawGraph(dataParse);
        
        return dataParse;
    };
    
    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    };
    xhr.send();
    
    return xhr.onload;
}//makeCorsRequest



function DrawGraph(dataParse){
    var aqiArr = [];
    var dateArr = [];
    
    var width = 420,
    barHeight = 20;
    
    var parseDate = d3.time.format("%m/%d %H:%M");
    
    for(i = 0; i < dataParse.length; i++) {
        aqiArr[i]=dataParse[i]['aqi'];
        dataParse[i]['date']= parseDate(dataParse[i]['date']);
        dateArr[i]=dataParse[i]['date'];
    }
    
    console.log(dataParse.map(function(d) { return d.date; }));
    var x = d3.scale.linear()
    .domain([0, d3.max(aqiArr)])
    .range([0, width]);
    
    var y = d3.scale.ordinal()
    .rangeBands([0,dataParse.length*barHeight])
    .domain( dataParse.map(function(d){return d.date;}) );
    
    
    console.log("Parse Date");
    console.log(y.domain());
    console.log(y.range());
    
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    // .tickFormat(d3.time.format("%Y/%m/%d"))
    .tickFormat(function(d){return d;});
    
    var chart = d3.select(".chart")
        .attr("width", width);
    
    chart.attr("height", barHeight * dataParse.length);
    
    var bar = chart.selectAll("g")
    .data(dataParse)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
    
    chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("x",0)
    .style("color","black")
    .text("date");
    
    
    
    bar.append("rect")
    .attr("width", function(d) { return x(d.aqi)*3; })
    .attr("height", barHeight - 1.5);
    
    bar.append("text")
    .attr("x", function(d) { return x(d.aqi) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.aqi; });
    
    // bar.append("text")
    //     .attr("x", 0 })
    //     .attr("y", barHeight / 2)
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.aqi; });
    
    
    // chart.selectAll(".bar")
    //   .data(data)
    //   .enter().append("rect")
    //   .attr("class", "bar")
    //   .attr("x", function(d) { return x(d.letter); })
    //   .attr("width", x.rangeBand())
    //   .attr("y", function(d) { return y(d.frequency); })
    //   .attr("height", function(d) { return height - y(d.frequency); });
}





