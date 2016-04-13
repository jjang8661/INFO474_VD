$(document).ready(function() {

    //Reead the antibiotic data
    $.ajax({
        url: "data.csv",
        async: false,
        dataType: "text",   
        success: function (csvd) {
            // Concert the data as object
            data = $.csv.toObjects(csvd);
        }
    });

    // Build each graph
    buildBarGraph(data);
    buildLineGraph(data);
    buildPieGraph(data);
    
});

// Build the fist graph (grouped bar graph)
function buildBarGraph(d) {
    var penicilinData = {};
    var streptomycinData = {};
    var neomycinData = {};

    // For each object which corresponds to each row,
    data.forEach(function(d) { 
 
        // Filter out the Gram-negative. 
        // Pase the data into each antibiotic datasets.
        if(d["Gram Staining "] == "negative") {
            penicilinData[d["Bacteria "]] = d["Penicilin"]
            streptomycinData[d["Bacteria "]] = d["Streptomycin "]
            neomycinData[d["Bacteria "]] = d["Neomycin"]
        }
    });

    // Determine the traces and layout of the graph
    var traces = [formatBarData(neomycinData,"Neomycin"),formatBarData(penicilinData,"Penicilin"),formatBarData(streptomycinData,"Streptomycin")];
    var layout = {
        title: 'MIC VS. Bacteria (Gram-Negative) ',
        height: window.height,
        width: window.width,
        barmode: 'group',
        xaxis: {
            title: "Bacteria (Gram-Negative)"
        },
        yaxis: {
            title: "MIC",
            range: [0,10]
        },
        hovermode: 'closest'
    };
    Plotly.newPlot('bargraph', traces, layout, {staticPlot: true});
}

// Format the data for the bar graph
function formatBarData(d, name) {
    var bacteriaSet = Object.keys(d);

    // X-axis: bacteria, Y-acis: MIC for each antibiotic
    var bars = {
        x: bacteriaSet.sort(),
        y: bacteriaSet.map(function(value) {
            return d[value]}),
        name: name,
        type: 'bar'
    };
    return bars;
}

// Build the second graph (scatter plot)
function buildLineGraph(d) {
    var streptomycinData = {};
    var neomycinData = {};
    

    // Pase the data into each antibiotic datasets
    data.forEach(function(d) { 
        streptomycinData[d["Bacteria "]] = d["Streptomycin "]
        neomycinData[d["Bacteria "]] = d["Neomycin"]
    });
    
    // Determine the traces and layout of the graph
    var traces = [formatLineData(streptomycinData,neomycinData)];
    var layout = {
        title: 'Streptomycin (MIC) VS. Neomycin (MIC)',
        height: window.height,
        width: window.width,
        xaxis: {
            title: "Streptomycin",
            range: [0,2.5]
        },
        yaxis: {
            title: "Neomycin",
            range: [0,2]
        },
        hovermode: 'closest'
    };
    Plotly.newPlot('scatterplot', traces, layout, {staticPlot: true});
}

// Format the data for the scatter plot
function formatLineData(d1,d2) {
    var bacteriaSet1 = Object.keys(d1);
    var bacteriaSet2 = Object.keys(d1);

    // X-axis: MIC of Streptomycin, Y-acis: MIC of Neomycin
    var line = {
        x: bacteriaSet1.map(function(value) {
            return d1[value]}),
        y: bacteriaSet2.map(function(value) {
            return d2[value]}),
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 12, 
            color: 'rgb(160,82,45)'
        },
        text: bacteriaSet1

    };
    return line;
}

// Build the last graph (pie chart)
function buildPieGraph(d) {
    // Determine the traces and layout of the graph
    var traces = formatPieData(d);
    var layout = {
        title: 'Proportion of the antibiotics that has the lowest MIC',
        height: window.height,
        width: window.width
    };
    Plotly.newPlot('piegraph', traces, layout, {staticPlot: true});
}

// Format the data for the pie chart
function formatPieData(d) {
    var penCount = 0;
    var strCount = 0;
    var neoCount = 0;

    // For each bacteria, find the antibiotics that has the lowest MIC. 
    // And, count the number of bacterias for which each antibiotic has the lowest MIC
    d.forEach(function(d) {

        var lowest = Math.min(d["Penicilin"],d["Streptomycin "],d["Neomycin"]);

        // Find which antibiotic has the lowest MIC for this paticular bacteria, and increase the count.
        if(d["Penicilin"] == lowest) {
            penCount ++;
        } else if (d["Streptomycin "] == lowest) {
            strCount ++;
        } else {
            neoCount ++;
        }
    });

    // Return the data for the proportion of each antibiotics
    var pie = [{
      // Due to the exception of "Proteus vulgaris", increase a count for Neomycin and the overall number of bacteria
      values: [(penCount/17),(strCount/17),((neoCount+1)/17)],
      labels: ['Penicilin', 'Streptomycin', 'Neomycin'],
      color: ['#444','Orange','Green'],
      type: 'pie'
    }];
    return pie;
}



