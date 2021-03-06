//bkColor = document.querySelector("#bkColor");
const REV = 1,
	/*BRUSHES = ["test", "sketchy", "shaded", "chrome", "fur", "longfur", "web", "", "simple", "squares", "ribbon", "", "circles", "grid"],*/
	BRUSHES = ["sketchy", "shaded", "chrome", "fur", "longfur", 
		"web", "simple", "squares", "ribbon", 
		"circles", "grid", 
		"eraser",
		"", "", "", "", "", "", "", "", // 12-19
		"line", "sketchy_my"
	],
    USER_AGENT = navigator.userAgent.toLowerCase();
console.log(USER_AGENT);

var SCREEN_WIDTH = window.innerWidth, //document.innerWidth, //  //painter.width, 
    SCREEN_HEIGHT = window.innerHeight, //document.innerHeight, // // painter.height, 
    BRUSH_SIZE = 1,
    BRUSH_PRESSURE = 1,
    COLOR = [0, 0, 0],
	COLOR2 = [128, 128, 128],
    BACKGROUND_COLOR = [250, 250, 250],
    STORAGE = window.localStorage,
    brush,
    saveTimeOut,
    wacom,
    i,
    mouseX = 0,
    mouseY = 0,
    container,
    foregroundColorSelector,
    backgroundColorSelector,
    menu,
    about,
    canvas,
    palette,
    flattenCanvas,
    context,
    isFgColorSelectorVisible = false,
    isBgColorSelectorVisible = false,
    isAboutVisible = false,
    isMenuMouseOver = false,
    shiftKeyIsDown = false,
    altKeyIsDown = false;
bColor = "#c0c0c0"
fColor = "#010202"
fColor2 = "#808080"
lineWidth = 1;
brushType = 21; // line simple "Sketchy MrD"; //"Линия"
brushPressure = 1;
const bkColorSel = document.querySelector("#bkColor");
const foreColorSel = document.querySelector("#foreColor");
const foreColor2Sel = document.querySelector("#foreColor2");
const painter = document.querySelector("#painter");
canvas=painter;
MouseX = 0;
MouseY = 0;
prevMouseX = 0;
prevMouseY = 0;

const btnClear = document.querySelector("#btnClear");
const btnCapture = document.querySelector("#btnCapture");
const lineWidthSel = document.querySelector("#lineWidth");
const brushTypeSel = document.querySelector("#brushType");
const brushPressureSel = document.querySelector("#brushPressure");
const labelLineWidth = document.querySelector('.label-lineWidth');


window.addEventListener("load", startup, false);
bkColorSel.addEventListener("input", changeBkColor, false);
bkColorSel.addEventListener("change", changeBkColor, false);
bkColorSel.addEventListener('touchend', changeBkColor, false);

//foreColorSel.addEventListener("input", changeForeColor, false);
foreColorSel.addEventListener("change", changeForeColor, false);
foreColorSel.addEventListener("touchend", changeForeColor, false);
foreColor2Sel.addEventListener("change", changeForeColor2, false);
foreColor2Sel.addEventListener("touchend", changeForeColor2, false);
btnClear.addEventListener("mousedown", btnClearClick, false);
btnCapture.addEventListener("mousedown", btnCaptureClick, false);
lineWidthSel.addEventListener("input", changeLineWidth, false);
lineWidthSel.addEventListener("change", changeLineWidth, false);
lineWidthSel.addEventListener("touchend", changeLineWidth, false);
brushTypeSel.addEventListener("change", changeBrushType, false);
brushTypeSel.addEventListener("touchend", changeBrushType, false);
brushPressureSel.addEventListener("change", changeBrushPressure, false);
brushPressureSel.addEventListener("touchend", changeBrushPressure, false);


context = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
//console.log(context);
flattenCanvas = document.createElement("canvas");
flattenCanvas.width = SCREEN_WIDTH;
flattenCanvas.height = SCREEN_HEIGHT;


function startup (event) {
	bkColorSel.value   = bColor;
	foreColorSel.value = fColor;
	lineWidthSel.value = lineWidth;
	brushTypeSel.value =  brushType;
	brush = eval("new " + BRUSHES[brushType] + "(context)");
	if (brushType !==23) //sand
		foreColor2Sel.classList.remove('show');
		//foreColor2Sel.classList.add('hidden')
	brushPressureSel.value = brushPressure;
	BRUSH_SIZE = lineWidth;
  	BRUSH_PRESSURE =  brushPressure; //0.05 *
	COLOR = HEX2RGB(fColor);
	BACKGROUND_COLOR = HEX2RGB(bColor);
}

init();
//x =30,y=40,width=50,height=60,radius=5;
//roundedRect(context,x,y,width,height,radius);

//bkColor.select();
function changeBkColor(event) {
	if (painter) {
    bColor = event.target.value;
    painter.style.background = bColor;
		BACKGROUND_COLOR = HEX2RGB(bColor);
		if (STORAGE) 	{
			localStorage.background_color_red = BACKGROUND_COLOR[0];
			localStorage.background_color_green = BACKGROUND_COLOR[1];
			localStorage.background_color_blue = BACKGROUND_COLOR[2];				
		}
	}
	else {
		console.log("bColor not standed - painter not defined");
	}
}

function changeForeColor(event) {
	fColor = event.target.value;
	//console.log("foreColor=", fColor);
	foreColorSel.value = fColor;
	COLOR = HEX2RGB(fColor);
	//console.log(COLOR);
	if (STORAGE)
	{
		localStorage.brush_color_red = COLOR[0];
		localStorage.brush_color_green = COLOR[1];
		localStorage.brush_color_blue = COLOR[2];		
	}
}

function changeForeColor2(event) {
	fColor2 = event.target.value;
	//console.log("foreColor=", fColor);
	foreColor2Sel.value = fColor2;
	COLOR2 = HEX2RGB(fColor2);
	//console.log(COLOR);
	if (STORAGE)
	{
		localStorage.brush_color_red = COLOR[0];
		localStorage.brush_color_green = COLOR[1];
		localStorage.brush_color_blue = COLOR[2];		
	}
}

function btnClearClick(event){
	console.log("btnClearClick")
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function btnCaptureClick(event){
	console.log("btnCaptureClick")
	flatten();
	window.open(flattenCanvas.toDataURL('image/png'),'SaveImage');
}

function changeLineWidth(event) {
	lineWidth = event.target.value;
	BRUSH_SIZE = lineWidth;
	//console.log(lineWidth)
	labelLineWidth.innerHTML = lineWidth+'px';
}

function changeBrushType (event) {
	brushType = event.target.value;
	brush = eval("new " + BRUSHES[brushType] + "(context)");
	console.log(brushType, BRUSHES[brushType]);
	if (brushType== 23) { // sand 
		//console.log("brushType=== 23");
		//foreColor2Sel.classList.remove('.hidden-pic-color');
		//foreColor2Sel.style.visible = "visible";
		//foreColor2Sel.style.display = "block";
		foreColor2Sel.className="pic-color";
		//foreColor2Sel.classList.add('show');
	}
	else {
		//console.log("brushType!== 23");
		//foreColor2Sel.classList.remove('show');
		//foreColor2Sel.classList.add('.hidden-pic-color');
		//foreColor2Sel.style.visible = "hidden";
		//foreColor2Sel.style.display = "none";
		foreColor2Sel.className="hidden-pic-color";
	}
}

function changeBrushPressure (event) {
	brushPressure  = event.target.value;
	BRUSH_PRESSURE =  brushPressure;
	console.log(brushPressure);
}



function roundedRect(ctx,x,y,width,height,radius){
	ctx.beginPath();
	ctx.moveTo(x,y+radius);
	ctx.lineTo(x,y+height-radius);
	ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
	ctx.lineTo(x+width-radius,y+height);
	ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
	ctx.lineTo(x+width,y+radius);
	ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
	ctx.lineTo(x+radius,y);
	ctx.quadraticCurveTo(x,y,x,y+radius);
	ctx.stroke();
}
context.fillStyle = 'rgba(0, 0, 0, 0.1)';
//moveToPoint(context, 30, 10, 60, 30);
function moveToPoint(ctx,x1,y1,x2,y2) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}

//flattenCanvas = canvas;

function init() {
	window.addEventListener('mousemove', onWindowMouseMove, false);
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onWindowKeyDown, false);
	window.addEventListener('keyup', onWindowKeyUp, false);
	window.addEventListener('blur', onWindowBlur, false);
	
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mouseout', onDocumentMouseOut, false);
	
	document.addEventListener("dragenter", onDocumentDragEnter, false);  
	document.addEventListener("dragover", onDocumentDragOver, false);
	document.addEventListener("drop", onDocumentDrop, false);  
	
	canvas.addEventListener('mousedown', onCanvasMouseDown, false);
	canvas.addEventListener('touchstart', onCanvasTouchStart, false);
	
	onWindowResize(null);

//COLOR = "#010202"


  //palette = new Palette();
	if (window.location.hash)
	{
		hash = window.location.hash.substr(1,window.location.hash.length);

		for (i = 0; i < BRUSHES.length; i++)
		{
			if (hash == BRUSHES[i])
			{
				brush = eval("new " + BRUSHES[i] + "(context)");
				//menu.selector.selectedIndex = i;
				break;
			}
		}
	}

	if (!brush)
	{
		brush = eval("new " + BRUSHES[0] + "(context)");
	}
	
/*brush = eval("new " + BRUSHES[0] + "(context)");
	window.location.hash = BRUSHES[0];*/

}

// WINDOW

function onWindowMouseMove( event )
{
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function onWindowResize()
{
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	
	/*menu.container.style.left = ((SCREEN_WIDTH - menu.container.offsetWidth) / 2) + 'px';
	
	about.container.style.left = ((SCREEN_WIDTH - about.container.offsetWidth) / 2) + 'px';
	about.container.style.top = ((SCREEN_HEIGHT - about.container.offsetHeight) / 2) + 'px';
  */
}

function onWindowKeyDown( event )
{
	if (shiftKeyIsDown)
		return;
		
	switch(event.keyCode)
	{
		case 16: // Shift
			shiftKeyIsDown = true;
			/*foregroundColorSelector.container.style.left = mouseX - 125 + 'px';
			foregroundColorSelector.container.style.top = mouseY - 125 + 'px';
			foregroundColorSelector.container.style.visibility = 'visible';
			*/
			break;
			
		case 18: // Alt
			altKeyIsDown = true;
			break;
			
		case 68: // d
			if(BRUSH_SIZE > 1) BRUSH_SIZE --;
			break;
		
		case 70: // f
			BRUSH_SIZE ++;
			break;			
	}
}

function onWindowKeyUp( event )
{
	switch(event.keyCode)
	{
		case 16: // Shift
			shiftKeyIsDown = false;
			//foregroundColorSelector.container.style.visibility = 'hidden';			
			break;
			
		case 18: // Alt
			altKeyIsDown = false;
			break;

		case 82: // r
			brush.destroy();
			//brush = eval("new " + BRUSHES[menu.selector.selectedIndex] + "(context)");
			break;
		case 66: // b
			document.body.style.backgroundImage = null;
			break;
	}
	
	context.lineCap = BRUSH_SIZE == 1 ? 'butt' : 'round';	
}

function onWindowBlur( event )
{
	shiftKeyIsDown = false;
	altKeyIsDown = false;
}


// DOCUMENT

function onDocumentMouseDown( event )
{
	//if (!isMenuMouseOver)
		//event.preventDefault();
}

function onDocumentMouseOut( event )
{
	onCanvasMouseUp();
}

function onDocumentDragEnter( event )
{
	event.stopPropagation();
	event.preventDefault();
}

function onDocumentDragOver( event )
{
	event.stopPropagation();
	event.preventDefault();
}

function onDocumentDrop( event )
{
	event.stopPropagation();  
	event.preventDefault();
	
	var file = event.dataTransfer.files[0];
	
	if (file.type.match(/image.*/))
	{
		/*
		 * TODO: This seems to work on Chromium. But not on Firefox.
		 * Better wait for proper FileAPI?
		 */

		var fileString = event.dataTransfer.getData('text').split("\n");
		document.body.style.backgroundImage = 'url(' + fileString[0] + ')';
	}	
}

// CANVAS

function onCanvasMouseDown( event )
{
	var data, position;
	//console.log("onCanvasMouseDown")

	clearTimeout(saveTimeOut);
	cleanPopUps();
	
	if (altKeyIsDown)
	{
		flatten();
		
		data = flattenCanvas.getContext("2d").getImageData(0, 0, flattenCanvas.width, flattenCanvas.height).data;
		position = (event.clientX + (event.clientY * canvas.width)) * 4;
		
		foregroundColorSelector.setColor( [ data[position], data[position + 1], data[position + 2] ] );
		
		return;
	}
	
	//BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;
	BRUSH_PRESSURE = brushPressure;
	
	brush.strokeStart( event.clientX, event.clientY );

	window.addEventListener('mousemove', onCanvasMouseMove, false);
	window.addEventListener('mouseup', onCanvasMouseUp, false);
	
}

function onCanvasMouseMove( event )
{
	BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;
	
	//console.log("onCanvasMouseMove")
	brush.stroke( event.clientX, event.clientY );
	}

function onCanvasMouseUp()
{
	brush.strokeEnd();
	
	window.removeEventListener('mousemove', onCanvasMouseMove, false);
	window.removeEventListener('mouseup', onCanvasMouseUp, false);
	
	if (STORAGE)
	{
		clearTimeout(saveTimeOut);
		saveTimeOut = setTimeout(saveToLocalStorage, 2000, true);
	}
}


//

function onCanvasTouchStart( event )
{
	cleanPopUps();		

	if(event.touches.length == 1)
	{
		event.preventDefault();
		
		brush.strokeStart( event.touches[0].pageX, event.touches[0].pageY );
		
		window.addEventListener('touchmove', onCanvasTouchMove, false);
		window.addEventListener('touchend', onCanvasTouchEnd, false);
	}
}

function onCanvasTouchMove( event )
{
	if(event.touches.length == 1)
	{
		event.preventDefault();
		brush.stroke( event.touches[0].pageX, event.touches[0].pageY );
	}
}

function onCanvasTouchEnd( event )
{
	if(event.touches.length == 0)
	{
		event.preventDefault();
		
		brush.strokeEnd();

		window.removeEventListener('touchmove', onCanvasTouchMove, false);
		window.removeEventListener('touchend', onCanvasTouchEnd, false);
	}
}

//

function saveToLocalStorage()
{
	localStorage.canvas = canvas.toDataURL('image/png');
}

function flatten()
{
	var context = flattenCanvas.getContext("2d");
	
	context.fillStyle = 'rgb(' + BACKGROUND_COLOR[0] + ', ' + BACKGROUND_COLOR[1] + ', ' + BACKGROUND_COLOR[2] + ')';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(canvas, 0, 0);
}

function cleanPopUps()
{
	if (isFgColorSelectorVisible)
	{
		foregroundColorSelector.hide();
		isFgColorSelectorVisible = false;
	}
		
	if (isBgColorSelectorVisible)
	{
		backgroundColorSelector.hide();
		isBgColorSelectorVisible = false;
	}
	
	if (isAboutVisible)
	{
		about.hide();
		isAboutVisible = false;
	}
}