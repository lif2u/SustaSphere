var pi = Math.PI;
var weWantToBeAnimated = false;
var viewWidth = window.innerWidth;
var viewHeigth = window.innerHeight;
var viewAspect = viewWidth / viewHeigth;
var viewAngle = 80;
var viewNose = 0.1;
//var viewDistance = 850;
var viewHorizon = 600000;
var sateliteCount = 3;
var destiZoom = -1000;
var promoView = true;
var sustaWorldVertiAngle = -0.2;

spawn = {
	objectHori: 0,
	subjectHori: 0,
	objectVerti: 65,
	subjectVerti: 65,
	objectDesti: 0,
	subjectDesti: -35,
	
}

var initHoriLookAtPos = 0;
var horiLookAtPos = 0;
var destiLookAtPos = 0;
var vertiLookAtPos = 65;
var horiLookFromPos = 0;
var destiLookFromPos = -15;
var vertiLookFromPos = 45;
var vertiFoilOffset = 10;
var domeDirtHoriPos = 0;
var domeDirtVertiPos = 26;
var domeDirtDestiPos = -41;

var maxTextHoriLeft = -1750;
var textHoriShiftRight = 0;
var maxTextHoriRight = 1500;
var maxTextVeriTop = 1800;
var maxTextDestiPosition = -1500;

var newsWeight = 900;
var takeOffThrust = 0.7;
var takeOffSpeed = 0.0;
var horiTurner = 0.01;

var initialTakeOffAngle = -90;
var flightAngle = initialTakeOffAngle;
var maxAltitude	= 300;
var flightAltitudeObjective = 100;
var flightAccelerator = 1.3;

var deltaTextAngle = 0;
var destiTextAngle = 0.001;
var textAngle = 15;
var maxTextLineLength = 48; ///TODO
var textMeshList = new Array(0);

var takeoffState = true;
var moveState = false;

var parameters = {
	width: 2000,
	height: 2000,
	widthSegments: 250,
	heightSegments: 250,
	depth: 1500,
	param: 4,
	filterparam: 1
};

hexa = {
	hubWidth: 2.0,
	tiltFactor: 1.0,
	domeRadius: 50,
	strutLength: 20.62,
	strutWidth: 2.0,
	xAngle: (-10.08 * 2),
	xLowAngle: -10.08,
	xSpaceAngle: -5,
	xHubAngle: 90,
	xLowHubAngle: 72,
	zTiltAngle: 49.20,
	zLowTiltAngle: 10.08,
	strut: [
	{
		index: 0,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 18, 
		xDir: 1, 
		xTranslate: 0,
		xOffset: 60, 
		zOffset: 60, 
		zAngle: -29,
		xAngle: 10.08
	},
	{	
		index: 1,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,		
		yOffset: 0, 
		xDir: 1,
		xTranslate: 0,
		xOffset: -90, 
		zOffset: 120, 
		zAngle: -88,
		xAngle: 10.08
	},
	{
		index: 2,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 0, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 90, 
		zOffset: 180, 
		zAngle: 90,
		xAngle: -10.08
	},
	{
		index: 3,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 60, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 30, 
		zOffset: 240, 
		zAngle: -27,
		xAngle: 10.08
	},
	{
		index: 4,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 30, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 120, 
		zOffset: 300, 
		zAngle: 29,
		xAngle: 10.08
	},
	{
		index: 5,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 90, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 360, 
		zOffset: 360, 
		zAngle: -360,
		xAngle: -10.08
	},
	]
};

penta = {
	hubWidth: 2.0,
	tiltFactor: 1.0,
	hubLength: 50,
	shortHubLength: 4,
	strutWidth: 2.0,
	type: [
	{
		index: 0,
		purpose: 'inner frame of a pentagon',
		length: 17.43,
		tiltOffset: -1,
	},
	{
		index: 1,
		purpose: 'outer frame of a pentagon',
		length: 20.18,
		tiltOffset: 0,
	}
	],
	strut: [
	{
		index: 0,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 18, 
		xDir: 1, 
		xTranslate: 0,
		xOffset: 18, 
		zOffset: 10.04, 
		zAngle: -32,
		xAngle: 10.04
	},
	{	
		index: 1,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,		
		yOffset: 18, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 18, 
		zOffset: 10.04, 
		zAngle: 32,
		xAngle: 10.04
	},
	{
		index: 2,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 18, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 18, 
		zOffset: 10.04, 
		zAngle: 104,
		xAngle: 10.04
	},
	{
		index: 3,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 18, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 18, 
		zOffset: 10.04, 
		zAngle: 360,
		xAngle: -10.04
	},
	{
		index: 4,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 18, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 18, 
		zOffset: 10.04, 
		zAngle: -104,
		xAngle: 10.04
	},
	{
		index: 5,
		hubOffset: 0,
		xHubOffset: 0,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 90, 
		xDir: 1,
		xTranslate: 0,
		xOffset: 90, 
		zOffset: 360, 
		zAngle: -90,
		xAngle: -10.04
	},
	{
		index: 6,
		hubOffset: 90,
		xHubOffset: 20.18 + 2,
		yHubOffset: 0,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: 1,
		yTranslate: 0,
		yOffset: 18, 
		xDir: 1,
		xTranslate: 20.18 + 2,
		xOffset: 18, 
		zOffset: 360, 
		zAngle: -18,
		xAngle: -10.04
	},
	{
		index: 7,
		hubOffset: 18,
		xHubOffset: 20.18 + 2,
		yHubOffset: 20.18 + 2,
		yHubTranslate: 0,
		xHubTranslate: 20.18 + 2,
		yDir: 1,
		yOffset: 18-72, 
		yTranslate: 20.18 + 2,
		xDir: 1,
		xTranslate: (20.18 + 2) * Math.sin(2 * pi / (360 /18)),
		xOffset: 18-72, 
		zOffset: 10.04, 
		zAngle: 72-18,
		xAngle: -10.04
	},
	{
		index: 8,
		hubOffset: 72-18,
		xHubOffset: ((20.18) - (20.18 + 2) * Math.sin(2 * pi / (360 /18))),
		yHubOffset: 20.18 + 2,
		yHubTranslate: (20.18 + 2) * Math.cos(2 * pi / (360 /18)),
		xHubTranslate: 0,
		yDir: -1,
		yOffset: 18-72, 
		yTranslate: 0,
		xDir: 1,
		xTranslate: 0,
		xOffset: 18-72, 
		zOffset: 360, 
		zAngle: 18-72,
		xAngle: -10.04
	},
	{
		index: 9,
		hubOffset: -18,
		xHubOffset: 20.18 + 2,
		yHubOffset: 20.18 + 2,
		yHubTranslate: 0,
		xHubTranslate: 0,
		yDir: -1,
		yOffset: 18, 
		yTranslate: 0,
		xDir: 1,
		xTranslate: 0,
		xOffset: 18, 
		zOffset: 360, 
		zAngle: 18,
		xAngle: -10.04
	},
	]
};

dome = {
	radius: 50,
	pentaOffset: (20.18 + 2) / 2,
	strut: [
		{
		index: 0,
		zDir: 1,
		xDir: 1,
		yDir: -1,
		xOffset: 18 - 18,
		yOffset: (-10.04 * 2) + 1,
		zOffset: 18 - 18 - (10.04 * 2) + 1,
		xAngle: -72 - 18 - (10.04 * 2) + 1,
		zAngle: 90
	},
	{
		index: 1,
		zDir: 1,
		xDir: 1,
		yDir: -1,
		xOffset: 18 - 72 - 18,
		yOffset: 90,
		zOffset: 18 - 72 - 18,
		xAngle: -144 - 18,
		zAngle: 90
	},
	{
		index: 2,
		zDir: 1,
		xDir: 1,
		yDir: -1,
		xOffset: 18 - 144 - 18,
		yOffset: 90,
		zOffset: 18 - 144 - 18,
		xAngle: -216 - 18,
		zAngle: 90
	},
	{
		index: 3,
		zDir: 1,
		xDir: 1,
		yDir: -1,
		xOffset: 18 - 216 - 18,
		yOffset: 90,
		zOffset: 18 - 216 - 18,
		xAngle: -288 - 18,
		zAngle: 90
	},
	{
		index: 4,
		zDir: 1,
		xDir: 1,
		yDir: 1,
		xOffset: 90 - 18,
		yOffset: 90,
		zOffset: 90 - 18,
		xAngle: 0 - 18,
		zAngle: 90
	},
	],
	penta: [
	{
		index: 0,
		yAngle: 18 - 18,
		xAngle: -10.04,//-9,
		zAngle: 0,
		zRadiusAngle: 72 + 18,
		xRadiusAngle: 72 + 18,
		zPentaDir: 1,
		zPentaAngle: -72 - 18,
		xPentaAngle: -72 - 18
	},
	{
		index: 1,
		yAngle: -56 - 18 ,
		xAngle: -10.04,//-22,
		zAngle: 0,//-22,
		zRadiusAngle: 144 + 18,
		xRadiusAngle: 144 + 18,
		zPentaDir: 1,
		zPentaAngle: -144 - 18,
		xPentaAngle: -144 - 18
	},
	{
		index: 2,
		yAngle: -128 - 18,
		xAngle: 0,//9,
		zAngle: 0,//6,
		zRadiusAngle: 216 + 18,
		xRadiusAngle: 216 + 18,
		zPentaDir: 1,
		zPentaAngle: -216 - 18,
		xPentaAngle: -216 - 18
	},
	{
		index: 3,
		yAngle: -200 - 18,
		xAngle: 0,//9,
		zAngle: 0,//-6,
		zRadiusAngle: 288 + 18,
		xRadiusAngle: 288 + 18,
		zPentaDir: 1,
		zPentaAngle: -288 - 18,
		xPentaAngle: -288 - 18
	},
	{
		index: 4,
		yAngle: -272 - 18,
		xAngle: 0,//-18,
		zAngle: 0,//18,
		zRadiusAngle: 360 + 18,
		xRadiusAngle: 360 + 18,
		zPentaDir: 1,
		zPentaAngle: -360 - 18,
		xPentaAngle: -360 - 18
	}
	]
};

susta = {
	light: 0xffffbb,//0xffffff,
	textlight: 'cornflowerblue',//0x339966,
	color: 0x050D05,//'cornflowerblue',
	othercolor: 0x2d5a70,
	foilcolor: 0xe6ffe6,//9DE3CB,
	textcolor: 'grey'//0x006666
};

trailer = {
	textLocation: -1500,
	textOffset: -150
};