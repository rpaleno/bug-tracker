export function filterBugs(bugs, priority){
    const bug2 = bugs.filter((bug)=>{return bug.priority === priority})
    return bug2
}

export function drawChart(lowCount, midCount, highCount) {
    const google = window.google;
    const data = google.visualization.arrayToDataTable([
    ['Priority', 'Count'],
    ['High', highCount.length],
    ['Mid', midCount.length],
    ['Low', lowCount.length],
    ]);
    const options = {
    title: 'Bugs In Progress',
    is3D: true,
    colors: ["#b33a3a", "#ff6700", "#32cd32"],
    backgroundColor: 'rgb(50, 51, 54)',
    width: '100%',
    height: '100%',
    chartArea: {
        left: '27%',
        top: '20%',
        width: "100%",
        height: '100%',
    },
    titleTextStyle: {
        color: 'white',
        margin: 0,
    },
    legend: {
        textStyle: {
        color: 'white'
        }
    }
    };
    const chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
  }
