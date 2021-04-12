function eraser( context )
{
	this.init( context );
}

eraser.prototype =
{
	context: null,

	prevMouseX: null, prevMouseY: null,

	points: null, count: null,

	init: function( context )
	{
		this.context = context;

		this.points = new Array();
		this.count = 0;
	},

	destroy: function()
	{
	},

	strokeStart: function( mouseX, mouseY )
	{
		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;
	},

	stroke: function( mouseX, mouseY )
	{
		var dx, dy, angle, px, py;
		
		dx = BRUSH_SIZE;
		dy = BRUSH_SIZE;
    //this.context.lineWidth = BRUSH_SIZE;
		this.context.fillStyle = "rgba(" + BACKGROUND_COLOR[0] + ", " + BACKGROUND_COLOR[1] + ", " + BACKGROUND_COLOR[2] + ", " + BRUSH_PRESSURE + ")";
		this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", " + BRUSH_PRESSURE + ")";
		this.context.beginPath();
    this.context.clearRect(mouseX-dx, mouseY-dy, 2*dx, 2*dy);
		this.context.closePath();

		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;
	},

	strokeEnd: function()
	{
		
	}
}
