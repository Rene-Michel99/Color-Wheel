function degreesToRadians(degrees) {
	return degrees * (Math.PI / 180);
}

function generateColorWheel(size, centerColor) {
    if (size === void 0) { size = 400; }
    if (centerColor === void 0) { centerColor = "white"; }
    //Generate main canvas to return
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.height = size;
    //Generate canvas clone to draw increments on
    var canvasClone = document.createElement("canvas");
    canvasClone.width = canvasClone.height = size;
    var canvasCloneCtx = canvasClone.getContext("2d");
    //Initiate variables
    var angle = 0;
    var hexCode = [255, 0, 0];
    var pivotPointer = 0;
    var colorOffsetByDegree = 4.322;
    //For each degree in circle, perform operation
    while (angle++ < 360) {
        //find index immediately before and after our pivot
        var pivotPointerbefore = (pivotPointer + 3 - 1) % 3;
        var pivotPointerAfter = (pivotPointer + 3 + 1) % 3;
        //Modify colors
        if (hexCode[pivotPointer] < 255) {
            //If main points isn't full, add to main pointer
            hexCode[pivotPointer] = (hexCode[pivotPointer] + colorOffsetByDegree > 255 ? 255 : hexCode[pivotPointer] + colorOffsetByDegree);
        }
        else if (hexCode[pivotPointerbefore] > 0) {
            //If color before main isn't zero, subtract
            hexCode[pivotPointerbefore] = (hexCode[pivotPointerbefore] > colorOffsetByDegree ? hexCode[pivotPointerbefore] - colorOffsetByDegree : 0);
        }
        else if (hexCode[pivotPointer] >= 255) {
            //If main color is full, move pivot
            hexCode[pivotPointer] = 255;
            pivotPointer = (pivotPointer + 1) % 3;
        }
        //clear clone
        canvasCloneCtx.clearRect(0, 0, size, size);
        //Generate gradient and set as fillstyle
        var grad = canvasCloneCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, centerColor);
        grad.addColorStop(1, "rgb(" + hexCode.map(function (h) { return Math.floor(h); }).join(",") + ")");
        canvasCloneCtx.fillStyle = grad;
        //draw full circle with new gradient
        canvasCloneCtx.globalCompositeOperation = "source-over";
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Switch to "Erase mode"
        canvasCloneCtx.globalCompositeOperation = "destination-out";
        //Carve out the piece of the circle we need for this angle
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Draw carved-put piece on main canvas
        ctx.drawImage(canvasClone, 0, 0);
    }
    //return main canvas
    return canvas;
}
var moving = false;
var movingBar = false;

function dragStart(event){
	moving = !moving;
}
function dragBar(){
	movingBar = !movingBar;
}
function moveBar(event){
	let pointer = document.getElementById("pt_bar");
	var pos_x = event.clientX - (window.screen.width/2) - 240;
	  var pos_y = event.offsetY + 20;
	  if(movingBar)
	  {
	  	var translated3d = "translate3d("+pos_x+"px,"+pos_y+"px,0)";
	  	pointer.style.transform = translated3d;

	  	colorBarMouse(event);
	  }	
}
function move(event) {
  let pointer = document.getElementById("pointer");
  var pos_x = event.clientX - (window.screen.width/2) + 56;
  var pos_y = event.clientY - 16;
  if(moving)
  {
  	var translated3d = "translate3d("+pos_x+"px,"+pos_y+"px,0)";
  	pointer.style.transform = translated3d;
  }
};

var colorWheel = generateColorWheel(500);
document.getElementById("color_wheel").appendChild(colorWheel);
var rgb = document.getElementById("rgb");
var hex = document.getElementById("hex");

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];	
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function colorWheelMouse(evt){
	if(moving){
		var ctx = colorWheel.getContext("2d");
		var data = ctx.getImageData(evt.offsetX, evt.offsetY, 1, 1);
		var rgb_dt = data.data.slice(0, 3);

		rgb.innerHTML = "RGB: " + rgb_dt.join(',');
		hex.innerHTML = "HEX: " + rgbToHex(rgb_dt);

		document.getElementById("color").style.backgroundColor = rgbToHex(rgb_dt);

		var parm = "rgb("+rgb_dt.join(",")+")";
		document.body.style.backgroundColor = parm;
		SetLinearColor(parm);
	}
}
function colorBarMouse(evt){
	if(movingBar){
		var ctx = document.getElementById("linear_canvas").getContext("2d");
		var data = ctx.getImageData(evt.offsetX, evt.offsetY, 1, 1);
		var rgb_dt = data.data.slice(0, 3);

		rgb.innerHTML = "RGB: " + rgb_dt.join(',');
		hex.innerHTML = "HEX: " + rgbToHex(rgb_dt);

		document.getElementById("color").style.backgroundColor = rgbToHex(rgb_dt);
	}
}
function SetLinearColor(color){
	var c = document.getElementById("linear_canvas");
	var ctx = c.getContext("2d");
	var my_gradient = ctx.createLinearGradient(0, 10, 0, 170);
	my_gradient.addColorStop(0, color);
	my_gradient.addColorStop(1,"black");
	ctx.fillStyle = my_gradient;
	ctx.fillRect(0, 0, 500, 500);
}
SetLinearColor("rgb(255,255,255)");
colorWheel.onmousemove = colorWheelMouse;