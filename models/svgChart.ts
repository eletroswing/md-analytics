interface data {
  time: number;
  value: number;
}

interface chartData {
  data: data[];
}

function formatNumber(number: number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + "k";
  } else {
    return (number / 1000000).toFixed(1) + "M";
  }
}

export default function createLineChart(chart: chartData) {
  const data = chart.data.slice(0, 23);
  const maxValue = data.reduce(
    (max: any, point: any) => (Number(point.value) > Number(max) ? Number(point.value) : Number(max)),
    0
  );
  const minValue = 0;
  const interval = (maxValue - minValue) / 5;
  const regularValues = Array.from(
    { length: 6 },
    (_, index) => minValue + index * interval
  );

  var yAxis = ``;

  var gridLines = ``;
  for (let i = 0; i < 6; i++) {
    const yCoord = -i * 10;
    gridLines += `
      <line x1="0" y1="${yCoord}" x2="110" y2="${yCoord}" class="axismark-third" />
    `;
  }

  regularValues.forEach((value, index) => {
    yAxis = `
${yAxis}
<text fill="white" font-size="4" y=  "-${index * 10}">${formatNumber(Number(value.toFixed(2)))}</text>
    `;
  });

  var line = ``;
  data.forEach((item) => {
    line += `${(item.time/2)*10} ${(item.value * 50) / maxValue}
`;
    line += `${(item.time/2)*10 + 1} ${(item.value * 50) / maxValue}
`;

  })

  const svgContent = `<svg id="head"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1"     
  viewBox="-19,-53.5,167,71.5"      
  width="750" height="320"
  font-family="Helvetica, Arial, Liberation Sans"
>

<!-- also a workaround for librsvg: a <rect> must be placed somewhere before text for a good display of text -->
<rect id="imagebackground" rx="2" ry="2" x="-19" y="-53.5" width="167" height="71.5" stroke-width="0.1" stroke="none" fill="#1f1f23"/>

<title>plain text svg graphic</title>
<desc>   
  This svg graphic is to edit with an text editor.
  Please do not overwrite this file by saving with an image editor.
</desc>

<style id="styles" type="text/css"> <![CDATA[
  .graphgeneral {         /*-- general look of graphs and markers, e.g. in legend --*/
    stroke-width:    0.7;
    fill:            none;
    stroke-linejoin: round;
    stroke-linecap:  round;
  }
  .graphgeneralstretch {  /*-- general look of graphs and markers on a stretched chart --*/ 
    stroke-width:    0.7;
    fill:            none;
    stroke-linejoin: round;
    stroke-linecap:  round;
  } 

  .graph1lineblank { /*-- look of graph 1 --*/
    stroke:          rgb(34 197 94);
  }
  .graph1line {
    stroke:          rgb(34 197 94); 
  }    

  .graph2lineblank { /*-- look of graph 2 --*/
    stroke:          rgb(75%, 10%, 10%);
  }
  .graph2line {
    stroke:          rgb(75%, 10%, 10%); 
  }    

  .graph3lineblank { /*-- look of graph 3 --*/
    stroke:          rgb(00%, 60%, 00%);
  }
  .graph3line {
    stroke:          rgb(00%, 60%, 00%); 
  }  

  .graph4lineblank { /*-- look of graph 4 --*/
    stroke:          rgb(00%, 60%, 60%);
  }
  .graph4line {
    stroke:          rgb(00%, 60%, 60%); 
  }  

  .graph5lineblank { /*-- look of graph 5 --*/
    stroke:          rgb(60%, 00%, 60%);
  }
  .graph5line {
    stroke:          rgb(60%, 00%, 60%); 
  }  

  .graph6lineblank { /*-- look of graph 6 --*/
    stroke:          rgb(60%, 60%, 00%);
  }
  .graph6line {
    stroke:          rgb(60%, 60%, 00%); 
  }  

  .graph7lineblank { /*-- look of graph 7 --*/
    stroke:          rgb(00%, 00%, 30%);
  }
  .graph7line {
    stroke:          rgb(00%, 00%, 30%); 
  }  

  .graph8lineblank { /*-- look of graph 8 --*/
    stroke:          rgb(00%, 30%, 00%);
  }
  .graph8line {
    stroke:          rgb(00%, 30%, 00%); 
  }  
  .axisline {
    stroke:         white;
    stroke-width:   0.35;
    stroke-linecap: round;
  }
  .titletext {
    font-size:    6.6px;       
  }
  .axistext-x {
    font-size:    6px;
  }
  .axistext-x-number {
    font-size:    6px;
  }
  .axistext-y {
    font-size:    6px;
  }
  .axismark-main {
    stroke:       white;
    stroke-width: 0.25;
  }
  .axismark-second {
    stroke:       white;
    stroke-width: 0.25;
  }  
  .axismark-third {
    stroke:       rgba(255, 255, 255, 0.2);
    stroke-width: 0.1;
  }  
  .legendtext {
    font-size:    6px;
    text-anchor:  start;
  }   
]]></style>

<defs>
<!--== axis dashes definitions ==-->
<!-- x-axis mark, modify "height" -->
<pattern id="x-axismark-main" x="0" width="10" height="2" patternUnits="userSpaceOnUse"> 
<line x1="0" y1="-1" x2="0" y2="2" class="axismark-main"/>
</pattern>

<!-- y-axis mark, modify "width" -->
<pattern id="y-axismark-main" width="2" height="10" patternUnits="userSpaceOnUse">
<line x1="-1" y1="0" x2="2" y2="0" class="axismark-main"/>    
</pattern>

<!-- y-axis2 mark, modify "width" -->
<pattern id="y-axis2mark-main" width="1" height="10" patternUnits="userSpaceOnUse">
<line x1="-1" y1="0" x2="11" y2="0" class="axismark-main"/>    
</pattern> 
</defs> 
${gridLines}

<g transform="scale(1, -1)">  

  <!-- x axis, modify "x2" and "width" -->
  <rect id="x-axismark" x="-0.5" y="-1.8" width="120" height="1.75" fill="url(#x-axismark-main)"/>
  <line id="x-axis" x1="0" y1="0" x2="110" y2="0" class="axisline"/>

  <!-- y axis, modify "height" -->
  <rect id="y-axismark" x="-1.75" y="-0.5" width="1.75" height="51" fill="url(#y-axismark-main)"/>
  <line id="y-axis" x1="0" y1="0" x2="0" y2="50" class="axisline"/> 
</g>

<!-- x axis text, modify each value -->
<g id="axistext-x" class="axistext-x-number" transform="translate(0, 7.8)" text-anchor="middle"> 
  <text fill="white" font-size="4" x=  "0">12am</text>
  <text fill="white" font-size="4" x= "10">2am</text>
  <text fill="white" font-size="4" x= "20">4am</text>
  <text fill="white" font-size="4" x= "30">6am</text>
  <text fill="white" font-size="4" x= "40">8am</text>
  <text fill="white" font-size="4" x= "50">10am</text>
  <text fill="white" font-size="4" x= "60">12pm</text>
  <text fill="white" font-size="4" x= "70">2pm</text>
  <text fill="white" font-size="4" x= "80">4pm</text>
  <text fill="white" font-size="4" x= "90">6pm</text>
  <text fill="white" font-size="4" x="100">8pm</text>
  <text fill="white" font-size="4" x="110">10pm</text>
  
  <text id="title-x" class="axistext-x" x="50" y="7.8" fill="white">Time of the views</text> 
</g>

<!-- y axis text, modify each value -->
<g id="axistext-y" class="axistext-y" text-anchor="end" transform="translate(-3, 1.5)"> 
  ${yAxis}
  <text id="title-y" x="25" y="-10.9" transform="rotate(-90)" fill="white" text-anchor="middle" >Total of views</text>
</g> 


<!-- legend -->
<g id="legend" class="legendtext" transform="translate(115, -50)">

  <g id="legend-background" class="axismark-main">
    <rect x="0" y="0" fill="#1f1f23" width="27" height="8.4"/>
  </g>
  <g class="graphgeneral"><g class="graph1line">
    <polyline id="legend-line1" points="2 4.62 7 4.62" marker-start="none" marker-end="none"/>
  </g></g>
  <text id="legend-text1" x="9" y="6.4" fill="white">Views</text> 
</g>  

<!--====== graph data with origin values, you can manually copy or attach the values here ======-->
<!-- modify displacement "translate" -->
<defs>

<g id="graph1">
  <!-- graph 1 -->
  <polyline id="graph1-line" stroke-width="1" points="  
    ${line}
  "/>

  </g>
</defs>

<g class="graphgeneralstretch" transform="scale(1, -1) translate(-0, -0)"> 

  <!-- graph 1 --> 
  <use id="graphuse1-1" transform="translate(0, 0)" class="graph1line" xlink:href="#graph1"/>
</g>
</svg>`;

  return svgContent;
}
