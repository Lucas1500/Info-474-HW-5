const m = {
    width: 800,
    height: 600
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

const g = svg.append('g')

d3.json('nygeo.json').then(function(data) {

    d3.csv('data.csv').then(function(pointData) {

        const albersProj = d3.geoAlbers()
            .scale(75000)
            .rotate([71.0547, 0])
            .center([-2.9, 40.7])
            .translate([m.width/2, m.height/2]);

        const geoPath = d3.geoPath()
        .projection(albersProj)

        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
          .attr('fill', '#ccc')
          .attr('d', geoPath)

        g.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
                .attr('cx', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[0]
                })
                .attr('cy', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[1]
                })
                .attr('r', 5)
                .attr('fill', 'steelblue')
                .on( "click", function(){
                  d3.select(this)
                    .attr("opacity",1)
                    .transition()
                    .duration( 1000 )
                    .attr( "cx", m.width * Math.round( Math.random() ) )
                    .attr( "cy", m.height * Math.round( Math.random() ) )
                    .attr( "opacity", 0 )
                    .on("end",function(){
                      d3.select(this).remove();
                    })
                })
    })
})
