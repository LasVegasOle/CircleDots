var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
      
function drawCircle(x,y) {
  context.beginPath();
  var MULT = 2.5;
  var rad = 4;
  context.arc(MULT*x + centerX, MULT*y + centerY, rad, 0, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();  
}

function drawPattern(){

  context.clearRect(0, 0, canvas.width, canvas.height);

  var num_circles = document.getElementById("num_circles").valueAsNumber;
  var dist_circles = document.getElementById("dist_circles").valueAsNumber;
  var init_circle_dots = document.getElementById("init_circle_dots").valueAsNumber;
  var mult_dots = document.getElementById("mult_circles").valueAsNumber;
  
  var fullGCode ="G28 \n"; // Homing printer
  
  fullGCode += "G92 E0 \n"; // Reset extruder


  // Loop over number of circles

  var radius = dist_circles;  // Radius of the current circle
  var dots_num = init_circle_dots;

  for (var loop_circle = 0; loop_circle < num_circles; loop_circle++) {
 
    // Loop over number of dots per circle
    for (var loop_dots = 0; loop_dots < dots_num; loop_dots++) {

      // Current dot angle
      var dot_angle_rad = ((2*Math.PI)/Math.round(dots_num)) * loop_dots;

      var x = radius * Math.cos(dot_angle_rad);
      var y = radius * Math.sin(dot_angle_rad);

      drawCircle(x,y);

    }

    radius += dist_circles; // double radius after each circle
    dots_num *= mult_dots; 

  }
}


function initCircleDot(){

    var classname = document.getElementsByClassName("inputs"); // Global variable within scopin function

      // Function that fills all the inputs
      var input_change = function() {
        drawPattern();
      };

      // Add event listener to all inputs
      for (var i = 0; i < classname.length; i++) {
          classname[i].addEventListener('click', input_change, false);
      }

    input_change();

    }

function buildGCode() {
  
  var num_circles = document.getElementById("num_circles").valueAsNumber;
  var dist_circles = document.getElementById("dist_circles").valueAsNumber;
  var init_circle_dots = document.getElementById("init_circle_dots").valueAsNumber;
  var mult_dots = document.getElementById("mult_circles").valueAsNumber;

  var start_height = document.getElementById("start_height").valueAsNumber;
  var speed = document.getElementById("speed").valueAsNumber;
  var e_speed = document.getElementById("e_speed").valueAsNumber;
  var extrusion = document.getElementById("extrusion").valueAsNumber;
  var retraction = document.getElementById("retraction").valueAsNumber;
  
  var fullGCode ="G28 \n"; // Homing printer
  
  fullGCode += "G92 E0 \n"; // Reset extruder


  // Loop over number of circles

  var radius = dist_circles;  // Radius of the current circle
  var dots_num = init_circle_dots;

  var total_extrusion = 0;

  for (var loop_circle = 0; loop_circle < num_circles; loop_circle++) {
 
    // Loop over number of dots per circle
    for (var loop_dots = 0; loop_dots < dots_num; loop_dots++) {
      //console.log("loop dots = " + loop_dots);
      // Current dot angle
      var dot_angle_rad = ((2*Math.PI)/dots_num) * loop_dots;

      var x = radius * Math.cos(dot_angle_rad);
      var y = radius * Math.sin(dot_angle_rad);

      //console.log("x = " + x);
      //console.log("y = " + y);

      fullGCode += "G1 X" + Math.round(x*100)/100 
                  + " Y" + Math.round(y*100)/100 
                  + " Z" + Math.round(start_height*100)/100
                  + " F"+ speed + "\n";

      // Extrusion calculation            
      total_extrusion = total_extrusion + extrusion + retraction;  
      fullGCode += "G1 E" + Math.round(total_extrusion*100)/100 + " F" + e_speed + "\n"; // Add dot extrusion

      // Dot retraction  
      total_extrusion -= retraction;
      fullGCode += "G1 E" + Math.round(total_extrusion*100)/100 + " F" + e_speed + "\n";


      fullGCode += "G1 Z" + 2*start_height + " F"+ speed + "\n"; 
    }

    radius += dist_circles; // double radius after each circle
    dots_num *= mult_dots; 
    dots_num = dots_num;
  }

  fullGCode += "G28 \n"; // Initial height and print speed

  return fullGCode;
}

function createFile(){
  var output = getParameters();
  output += buildGCode();
  //console.log(output);
  var GCodeFile = new Blob([output], {type: 'text/plain'});
  saveAs(GCodeFile, "Circle" + '.gcode');
}

function getParameters(){
var params = [];
  params += "; GCode generated with Circle dots from www.3digitalcooks.com \n";
  params += "; Number of circles [mm]: " + document.getElementById("num_circles").value + "\n";
  params += "; Distance between circles [mm]: " + document.getElementById("dist_circles").value + "\n";
  params += "; Init circle number of dots [mm]: " + document.getElementById("init_circle_dots").value + "\n";
  params += "; Dots multiplier [mm]: " + document.getElementById("mult_circles").value + "\n";
  params += "; Start height [mm]: " + document.getElementById("start_height").value + "\n"; 
  params += "; Speed [s]: " + document.getElementById("speed").value + "\n";
  params += "; Extruder speed [s]: " + document.getElementById("e_speed").value + "\n"; 
  params += "; Extrusion [mm]: " + document.getElementById("extrusion").value + "\n"; 
  params += "; Retraction [mm]: " + document.getElementById("retraction").value + "\n";  
return params;
}

initCircleDot();