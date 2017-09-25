
function spawnTextLine(textLine) {
	var textShifts = [
		"",
		" ",
		"  ",
		"   ",
		"    ",
		"     ",
		"      ",
		"       ",
		"        ",
		"         ",
		"          ",
		"           ",
		"            ",
		"             ",
		"              ",
		"               ",
		"                ",
		"                 ",
		"                  ",
		"                   ",
		"                    ",
		"                     ",
	];
	var textPitches = [
		180,
		120,
		100,
		80,
		60,
		40
	];
	try {
		console.log('Trying to spawn TextMesh: ' + textLine.name + ' at time: ' + performance.now());
		
		var phrase = textShifts[Math.round((maxTextLineLength - textLine.phrases[textLine.index - 1].length)/2)] + textLine.phrases[textLine.index - 1];
		var textGeo = new THREE.TextGeometry( phrase, {
			font: textLine.font,
			size: textPitches[1],
			height: 5,
			curveSegments: 6,
			bevelEnabled: true,
			bevelThickness: 3,
			bevelSize: 3,
			bevelSegments: 2
		} );
		var textMesh = new THREE.Mesh( textGeo, textLine.material );
		textMesh.position.x = textLine.horiPos;
		textMesh.position.z = textLine.destiPos;
		textMesh.position.y = textLine.vertiPos;
		textMesh.rotation.x = THREE.Math.degToRad(textLine.horiAngle);
		textMesh.rotation.y = THREE.Math.degToRad(textLine.vertiAngle);
		textMesh.name = textLine.name;
		console.log('TextMesh has been spawned with name ' + textMesh.name + ' and UUID '  + textMesh.uuid + 'at time: ' + performance.now());
	}
	catch(failure) {
		console.log('Spawning TextMesh ' + textLine.name + ' has failed: ' + failure);
	}
	finally {
		textLine.group.add(textMesh);
		return (
			textLine.name, 
			textLine.index,
			textLine.font,
			textLine.phrases,
			textLine.horiPos, 
			textLine.vertiPos,
			textLine.destiPos, 
			textLine.horiAngle,
			textLine.vertiAngle,
			textLine.material,
			textLine.group
		);
	}
}

function newLight(lightName, lidx) {
	
	try {
		console.log('Trying to spawn Light: ' + lightName + ' at time: ' + performance.now());
		if (lidx == 0) { 
			var light = new THREE.HemisphereLight( susta.light, susta.othercolor, 1 );
			light.position.set( 0, 250, 0 ).normalize();
			light.name = "Susta Light"; 
		}
		else if (lidx == 1) {
			var light = new THREE.DirectionalLight( susta.light, 0.5 );
			light.position.set( 250, 23, -250 ).normalize();
			light.name = "Bowl Light";
		}
		else {
			var light = new THREE.DirectionalLight( susta.light, 0.5 );
			light.position.set( horiLookFromPos, vertiLookFromPos, destiLookFromPos ).normalize();
			light.name = "Dome Light";
		}
		console.log('Light ' + lightName + ' has been spawned at time: ' + performance.now());
	}
	catch(err) {
		console.log('Error: ' + err);
	}
	finally {
		light.name = lightName;
		return light;
	}
}

function modFoil(foilMesh, foilType, cutType, skyMap) {
	
	try {
		console.log('Trying to modify foil: ' + foilMesh.name + ' at time: ' + performance.now());
		
		var cutterMat = new THREE.MeshBasicMaterial(
		{
			color: 'blue',
			transparent: false
		} 
		);
		
		var foilMat = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			color: new THREE.Color( susta.foilcolor ),
			shininess: 100,
			side: THREE.DoubleSide,
			transparent: true, 
			opacity: 0.8,
			envMap: skyMap
		} );

		var cutterGeo = new THREE.CylinderGeometry( 7, 7, 4, 64, 1, true);
		var cutGeo = new THREE.SphereGeometry(5, 32, 32);
		
		var cutterMesh = new THREE.Mesh( cutterGeo, cutterMat );
		
		cutterMesh.position.set(horiLookFromPos,domeDirtVertiPos,domeDirtDestiPos);
		if (foilType == 0) {
			cutterMesh.position.z += 0;
			cutterMesh.position.y += 0;
			cutterMesh.rotation.x = THREE.Math.degToRad(-65);
		}
		else {
			cutterMesh.position.y += 25;
			cutterMesh.position.z -= 26;
			cutterMesh.rotation.x = THREE.Math.degToRad(-118);
		}
		
		var cutterBspNode = new ThreeBSP(cutterMesh);
		var foilBspNode1 = new ThreeBSP(foilMesh);
		var cuttedFoilBspNode1 = foilBspNode1.subtract( cutterBspNode );
		var cuttedFoilMesh = cuttedFoilBspNode1.toMesh( foilMat );
		
		if (cutType == 1) {
			cuttedFoilMesh.rotation.y = THREE.Math.degToRad(-120);
			var foilBspNode2 = new ThreeBSP(cuttedFoilMesh);
			var cuttedFoilBspNode2 = foilBspNode2.subtract( cutterBspNode );
			cuttedFoilMesh = cuttedFoilBspNode2.toMesh( foilMat );
			
		}
		if (cutType == 2) {
			cuttedFoilMesh.rotation.y = THREE.Math.degToRad(60);
			var foilBspNode2 = new ThreeBSP(cuttedFoilMesh);
			var cuttedFoilBspNode2 = foilBspNode2.subtract( cutterBspNode );
			var cuttedFoilMesh2 = cuttedFoilBspNode2.toMesh( foilMat );
			cuttedFoilMesh2.rotation.y = THREE.Math.degToRad(-120);
			var foilBspNode3 = new ThreeBSP(cuttedFoilMesh2);
			var cuttedFoilBspNode3 = foilBspNode3.subtract( cutterBspNode );
			cuttedFoilMesh = cuttedFoilBspNode3.toMesh( foilMat );
		}
	}
	catch(err) {
		console.log('Error: ' + err);
	}
	finally {
		//cuttedFoilMesh.add(cutterMesh);
		console.log('Modified foil ' + foilMesh.name + ' has been spawned at time: ' + performance.now());
		return cuttedFoilMesh;
	}
}

function newView(view) {
	view.lookAt(new THREE.Vector3(horiLookAtPos, vertiLookAtPos, destiLookAtPos));
	view.position.set(horiLookFromPos, vertiLookFromPos, destiLookFromPos);
	return view;
}

function setView(view) {
	view.lookAt(new THREE.Vector3(horiLookAtPos, vertiLookAtPos, destiLookAtPos));
	view.position.set(horiLookFromPos, vertiLookFromPos, destiLookFromPos);
	return view;
}

function newHexaStruts(hub, tidx) {
	var spaceAngle = new THREE.Euler(0,0,0, 'XYZ');
	var struts = new THREE.Group();
	var strutGeo = new THREE.CylinderGeometry( (hexa.strutWidth / 2), (hexa.strutWidth / 2), hexa.strutLength, 32, 0 );
	var strutMat = new THREE.MeshPhongMaterial( {color: susta.color} );
	var strut0 = new THREE.Mesh( strutGeo, strutMat);
	var sidx = 0;
	
	strut0.position.x = hub.position.x;
	strut0.position.y = hub.position.y;
	strut0.position.z = hub.position.z;
	strut0.position.z += 1.5;
	
	
	//console.log('Start newHexaStrut: ' + hub.position.z);
	
	if (tidx==2) {
		strut0.rotation.x = THREE.Math.degToRad(hexa.xAngle);
		strut0.position.y += ((hexa.strutLength / 2) + hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.xAngle));
		strut0.position.z += ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.xAngle));
	}
	else if (tidx==3) {
		strut0.rotation.x = THREE.Math.degToRad(hexa.xLowAngle);
		strut0.position.x += 0.2;
		strut0.position.y += 0.8 + ((hexa.strutLength / 2) + hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.xLowAngle));
		strut0.position.z += ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.xLowAngle));
	}
	//spaceAngle.set(THREE.Math.degToRad((0)),THREE.Math.degToRad(-36),THREE.Math.degToRad(-36), 'XYZ');
	//strut0.setRotationFromEuler(spaceAngle);
	
	//strut0.rotateX(2 * pi / (360 / 90));
	//strut0.rotateZ(2 * pi / (360 / 0));
	
	struts.add(hub);
	
	var strut1 = strut0.clone();
	strut1.position.x -= ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut1.position.y -= ( hexa.hubWidth + 1) * Math.cos(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut1.rotation.z = (2 * pi / (360 / hexa.strut[sidx].zAngle));
	var strut2 = strut0.clone();
	sidx += 1;
	strut2.position.x += ((hexa.strutLength / 2) + hexa.hubWidth -1.5);
	strut2.rotation.y = THREE.Math.degToRad(hexa.strut[sidx].xAngle);
	strut2.position.y = hub.position.y ;//((hexa.strutLength / 2) ) * Math.cos(2 * pi / (360 / hexa.strut[sidx].yOffset));
	//strut2.position.z += ((hexa.strutLength / 2) ) * Math.cos(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut2.position.z = hub.position.z + 0.5 - ((hexa.strutLength / 2) ) * Math.sin(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut2.rotation.z = (2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut2.rotation.x = (2 * pi / (360 / -5));
	var strut3 = strut0.clone();
	sidx += 1;
	strut3.position.x -= ((hexa.strutLength / 2) + hexa.hubWidth -1.5);
	strut3.rotation.y = THREE.Math.degToRad(hexa.strut[sidx].xAngle);
	strut3.position.y = hub.position.y ;//((hexa.strutLength / 2) ) * Math.cos(2 * pi / (360 / hexa.strut[sidx].yOffset));
	//strut2.position.z += ((hexa.strutLength / 2) ) * Math.cos(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut3.position.z = hub.position.z + 0.5 + ((hexa.strutLength / 2) ) * Math.sin(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut3.rotation.z = (2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut3.rotation.x = (2 * pi / (360 / 5));
	var strut4 = strut0.clone();
	sidx += 1;
	strut4.position.x = hub.position.x;
	strut4.position.y = hub.position.y;
	strut4.position.z = hub.position.z + 1;
	strut4.rotation.x = THREE.Math.degToRad(hexa.strut[sidx].xAngle);
	strut4.position.y -= ((hexa.strutLength / 2) + hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut4.position.z -= ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut4.position.x -= ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut4.position.y += ( hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut4.rotation.z = (-2 * pi / (360 / hexa.strut[sidx].zAngle));
	
	var strut5 = strut0.clone();
	sidx += 1;
	strut5.position.x = hub.position.x;
	strut5.position.y = hub.position.y;
	strut5.position.z = hub.position.z + 1;
	strut5.rotation.x = THREE.Math.degToRad(hexa.strut[sidx].xAngle);
	strut5.position.y -= ((hexa.strutLength / 2) + hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut5.position.z -= ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.strut[sidx].xAngle));
	strut5.position.x -= ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut5.position.y += ( hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut5.rotation.z = (-2 * pi / (360 / hexa.strut[sidx].zAngle));
	
	sidx = 0;
	strut0.position.x += ((hexa.strutLength / 2) + hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut0.position.y -= ( hexa.hubWidth + 1) * Math.cos(2 * pi / (360 / hexa.strut[sidx].zAngle));
	strut0.rotation.z = (-2 * pi / (360 / hexa.strut[sidx].zAngle));
	
	if (tidx==2) {

	}
	else if (tidx==3) {
		strut1.position.x -= 0.7;
		strut1.position.y += 0;
		strut1.rotation.z -= THREE.Math.degToRad(-3);
		strut2.position.y -= 0.2;
		strut3.position.y -= 0.2;
	}
	struts.add(strut0);
	struts.add(strut1);
	struts.add(strut2);
	struts.add(strut3);
	
	if (tidx==2) {
		struts.add(strut4);
		struts.add(strut5);
	}
	else if (tidx==3) {
		struts.position.x -= 0;
		struts.position.y -= 51.5;
		struts.position.z -= 28;
	}
	
	/*struts.position.y += 12;
	struts.position.x -= 20 * Math.sin(2 * pi / (360 / 28));
	struts.position.z += 14 * Math.cos(2 * pi / (360 / 28));*/
	
	//spaceAngle.set(THREE.Math.degToRad(hexa.xSpaceAngle),THREE.Math.degToRad(0),THREE.Math.degToRad(0), 'XYZ');
	//struts.setRotationFromEuler(spaceAngle);
	
	//struts.rotation.x = (2 * pi / (360 / hexa.xSpaceAngle));
	//struts.position.y += ((hexa.strutLength / 1) + (hexa.hubWidth * 2)) * Math.sin(2 * pi / (360 / hexa.xSpaceAngle));
	//struts.position.z = ((hexa.strutLength / 1) + (hexa.hubWidth * 2)) * Math.cos(2 * pi / (360 / hexa.xSpaceAngle));
	
	//struts.rotateX(2 * pi / (360 / 90));
	//struts.rotateZ(2 * pi / (360 / 30));
	//struts.rotation.z = (2 * pi / (360 / 30));
	
	return struts;
}

function newHexaHub(tidx) {
	//var spaceAngle = new THREE.Euler(0,0,0, 'XYZ');
	var hubGeo = new THREE.CylinderGeometry( hexa.hubWidth, hexa.hubWidth, ( hexa.hubWidth * 2), 32, 1 );
	var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
	var hub = new THREE.Mesh( hubGeo, hubMat );
	
	hub.position.y -= hexa.hubWidth;
	
	hub.position.y += ((1 * hexa.domeRadius) - hexa.hubWidth) * Math.sin(2 * pi / (360 / 45));
	hub.position.z = ((1 * hexa.domeRadius) + hexa.hubWidth) * Math.sin(2 * pi / (360 / 45));
	hub.position.x = ((-1 * hexa.domeRadius) - 0) * Math.sin(2 * pi / (360 / 0));
	
	if (tidx==2) {
		hub.rotation.x = THREE.Math.degToRad(hexa.xHubAngle);
	}
	else if (tidx==3) {
		hub.rotation.x = THREE.Math.degToRad(hexa.xLowHubAngle);
	}
	
	return hub;
}

function newPentaHub(tidx,sidx) {
	if (tidx == 4) {
		var hubGeo = new THREE.CylinderGeometry( 2,2,65, 32, 1 );
		var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
		var hub = new THREE.Mesh( hubGeo, hubMat );
		hub.translateX(penta.strut[sidx].xHubTranslate + (penta.strut[sidx].xHubOffset * Math.sin(2 * pi / (360 / penta.strut[sidx].hubOffset))));
		hub.translateY(penta.strut[sidx].yHubTranslate + (penta.strut[sidx].yHubOffset * Math.cos(2 * pi / (360 / penta.strut[sidx].hubOffset))));
		hub.rotateX(2 * pi / (360 / 90));
	}
	else {
		if (sidx == 18) {
			var hubGeo = new THREE.CylinderGeometry( penta.hubWidth, penta.hubWidth, (penta.hubLength * penta.tiltFactor), 32, 1 );
			var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
			var hub = new THREE.Mesh( hubGeo, hubMat );
			//hub.position.y = (penta.hubLength * 0.7) / 2;
			//var hubMat = new THREE.MeshPhongMaterial( {color: 'magenta'} );
			sidx = sidx - 10;
		}
		else {
			var hubGeo = new THREE.CylinderGeometry( penta.hubWidth, penta.hubWidth, (penta.hubWidth * 2), 32, 1 );
			var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
			var hub = new THREE.Mesh( hubGeo, hubMat );
			hub.position.z -= 0.5;
		}
	}
	
	if (tidx == 1) {
		hub.translateX(penta.strut[sidx].xHubTranslate + (penta.strut[sidx].xHubOffset * Math.sin(2 * pi / (360 / penta.strut[sidx].hubOffset))));
		hub.translateY(penta.strut[sidx].yHubTranslate + (penta.strut[sidx].yHubOffset * Math.cos(2 * pi / (360 / penta.strut[sidx].hubOffset))));
		hub.rotateX(2 * pi / (360 / 90));

		if (sidx == 8) {
			
			//hubs.add(tiltedHub);
			//hubMat.color.setHex( 0x2d5910 );
		}
		
	}
	//hubs.add(hub);
	return hub;
}

function newPentaStrut(centeridx,tidx,sidx,hub) {
	var struts = new THREE.Group();
	//console.log('Creating an ' + penta.strut[sidx].purpose);
	var strutGeo = new THREE.CylinderGeometry( (penta.strutWidth / 2), (penta.strutWidth / 2), penta.type[tidx].length, 32, 0 );
	var strutMat = new THREE.MeshPhongMaterial( {color: susta.color} );
	var strut0 = new THREE.Mesh( strutGeo, strutMat);
	var cidx = 8;
	//var xCenter = penta.strut[cidx].xHubTranslate + (penta.strut[cidx].xHubOffset * Math.sin(2 * pi / (360 / penta.strut[cidx].hubOffset)));
	//var yCenter = (penta.strut[cidx].yHubTranslate + (penta.strut[cidx].yHubOffset * Math.cos(2 * pi / (360 / penta.strut[cidx].hubOffset)))) / 2;
	//var zCenter = 0;
	if (centeridx == 1) {
		var xCenter = penta.strut[cidx].xHubTranslate - 0.0 +(penta.strut[cidx].xHubOffset * Math.sin(2 * pi / (360 / penta.strut[cidx].hubOffset)));
		var yCenter = (penta.strut[cidx].yHubTranslate - 0.0 + (penta.strut[cidx].yHubOffset * Math.cos(2 * pi / (360 / penta.strut[cidx].hubOffset)))) / 2;
		var zCenter = 0;
	}
	else {
		var xCenter = penta.strut[cidx].xHubTranslate +(penta.strut[cidx].xHubOffset * Math.sin(2 * pi / (360 / penta.strut[cidx].hubOffset)));
		var yCenter = (penta.strut[cidx].yHubTranslate + (penta.strut[cidx].yHubOffset * Math.cos(2 * pi / (360 / penta.strut[cidx].hubOffset)))) / 2;
		var zCenter = 0;
	}
	var strut0Offset = (penta.type[tidx].length / 2) + penta.strutWidth + penta.type[tidx].tiltOffset;
	if (tidx == 0) {
		if (sidx == 0) {
			if (centeridx == 1) {
				//strutMat.color.setHex( 0x2d5910 );
				strut0.position.y = (yCenter - hub.position.y) / 2;
				strut0.position.x = (xCenter - hub.position.x) / 2;
			}
			else {
				strut0.position.y = (yCenter - hub.position.y) / 2;
				strut0.position.x = (xCenter - hub.position.x) / 2;
			}

			
		}
		if (sidx == 1) {
			strut0.position.y = (yCenter - hub.position.y) / 2;
			strut0.position.x = hub.position.x - ((hub.position.x - xCenter) / 2);
		}
		if (sidx == 2) {
			//strutMat.color.setHex( 0x2d5910 );
			if (centeridx == 0) {
				var strutGeo = new THREE.CylinderGeometry( (penta.strutWidth / 2), (penta.strutWidth / 2), penta.type[tidx + 1].length, 32, 0 );
				var strutMat = new THREE.MeshPhongMaterial( {color: susta.color} );
				var strut1 = new THREE.Mesh( strutGeo, strutMat);
				//var strut1 = strut0.clone();
			
				strut1.position.y = hub.position.y + ((hub.position.y - yCenter) / 2);
				strut1.position.x = 1 + hub.position.x + ((hub.position.x - xCenter) / 2) - 2.0;
				strut1.rotation.y = (2 * pi / (360 / 33));
				strut1.position.z = ((penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset))) - 7.5;
				strut1.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle + 0.05));
				struts.add(strut1);
			}
			if (centeridx == 4) {
				var strutGeo = new THREE.CylinderGeometry( (penta.strutWidth / 2), (penta.strutWidth / 2), penta.type[tidx + 1].length, 32, 0 );
				var strutMat = new THREE.MeshPhongMaterial( {color: susta.color} );
				var strut1 = new THREE.Mesh( strutGeo, strutMat);
				//var strut1 = strut0.clone();
			
				strut1.position.y = hub.position.y + ((hub.position.y - yCenter) / 2);
				strut1.position.x = 1 + hub.position.x + ((hub.position.x - xCenter) / 2) - 2.0;
				strut1.rotation.y = (2 * pi / (360 / 33));
				strut1.position.z = ((penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset))) - 7.5;
				strut1.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle + 0.05));
				struts.add(strut1);
			}
			strut0.position.y = yCenter + ((hub.position.y - yCenter) / 2);
			strut0.position.x = xCenter + ((hub.position.x - xCenter) / 2);
		}
		if (sidx == 3) {
			strut0.position.y = yCenter + ((hub.position.y - yCenter) / 2);
			strut0.position.x = xCenter;
			//strut0.rotateX(2 * pi / (360 / penta.strut0[sidx].xAngle));
			//strutMat.color.setHex( 0x2d5910 );
			if (centeridx == 0) {
				var strut2Geo = new THREE.CylinderGeometry( (penta.strutWidth / 2), (penta.strutWidth / 2), penta.type[tidx + 1].length, 32, 0 );
				var strut2Mat = new THREE.MeshPhongMaterial( {color: susta.color} );
				var strut2 = new THREE.Mesh( strut2Geo, strut2Mat);
				strut2.position.y = hub.position.y + ((hub.position.y - yCenter) / 2) - 0.8;
				strut2.position.x = hub.position.x + ((hub.position.x - xCenter) / 2);
				strut2.rotation.y = (2 * pi / (360 / 90.5));
				strut2.position.z = ((penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset))) - 6.9;
				strut2.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle + 1.49));
				struts.add(strut2);
			}
		}
		if (sidx == 4) {
			strut0.position.y = yCenter + ((hub.position.y - yCenter) / 2);
			strut0.position.x = xCenter - ((xCenter - hub.position.x) / 2);
			//strut0.rotateX(2 * pi / (360 / penta.strut0[sidx].xAngle));
		}
		
		//strut0.position.y = penta.strut0[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut0[sidx].yOffset));
		//strut0.position.x = penta.strut0[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut0[sidx].xOffset));
		if (centeridx == 1) {
			if (sidx == 0) {
				strut0.position.z = (penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset));
				strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle + 0.2));
				strut0.rotateX(2 * pi / (360 / penta.strut[sidx].xAngle));
			}
			else if (sidx == 3) {
				strut0.position.z = (penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset));
				strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle - 0.005));
				strut0.rotateX(2 * pi / (360 / penta.strut[sidx].xAngle));
			}
			else if (sidx == 4) {
				strut0.position.z = (penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset));
				strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle - 0.1));
				strut0.rotateX(2 * pi / (360 / penta.strut[sidx].xAngle));
			}
			else {
				strut0.position.z = (penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset));
				strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle));
				strut0.rotateX(2 * pi / (360 / penta.strut[sidx].xAngle));
			}
		}
		else {
			strut0.position.z = (penta.type[tidx].length / 2) * Math.sin(2 * pi / (360 / penta.strut[sidx].zOffset));
			strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle));
			strut0.rotateX(2 * pi / (360 / penta.strut[sidx].xAngle));
		}
	}
	if (tidx == 1) {
		if (sidx == 5) {
			strut0.position.y = hub.position.y + (penta.strut[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut[sidx].yOffset)));
			//console.log('y: ' + strut0.position.y)
			strut0.position.x = hub.position.x + (penta.strut[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut[sidx].xOffset)));
			strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle));
		}
		if (sidx == 6) {
			strut0.position.y = hub.position.y + (penta.strut[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut[sidx].yOffset)));
			strut0.position.x = hub.position.x + (penta.strut[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut[sidx].xOffset)));
			strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle));
		}
		if (sidx == 7) {
			strut0.position.y = hub.position.y + (penta.strut[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut[sidx].yOffset)));
			strut0.position.x = hub.position.x + 0.4 + (penta.strut[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut[sidx].xOffset)));
			strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle));
		}
		if (sidx == 8) {
			strut0.position.y = hub.position.y + 0.6 + (penta.strut[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut[sidx].yOffset)));
			strut0.position.x = hub.position.x + 0.4 + (penta.strut[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut[sidx].xOffset)));
			strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle));
		}
		if (sidx == 9) {
			strut0.position.y = hub.position.y + 0.6 + (penta.strut[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut[sidx].yOffset)));
			strut0.position.x = hub.position.x - 0.4 + (penta.strut[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut[sidx].xOffset)));
			strut0.rotateZ(2 * pi / (360 / penta.strut[sidx].zAngle));
		}
		if (sidx == 10) {
			//if (lastPentaHub7PositionX > 0) {
				strut0.position.x = hub.position.x + 10;
				strut0.position.y = hub.position.y;// - ((hub.position.y - lastPentaHub7PositionY)/2);
				strut0.position.z = hub.position.z - 10;// - ((hub.position.z - lastPentaHub7PositionZ)/2);
				strut0.rotateX(2 * pi / (360 / -90));
				strut0.rotateY(2 * pi / (360 / -90));
			//}
		}
		
		/*if (sidx == 6) {
			strut0.rotateX(2 * pi / (360 / penta.strut0[sidx].xAngle));
			strut0.position.x = hub.position.x + (penta.strut0[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut0[sidx].xOffset)));
			strut0.position.y = hub.position.y + (penta.strut0[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut0[sidx].yOffset))) - 0.5;
			strut0.position.z = hub.position.z - (strut0Offset * Math.sin(2 * pi / (360 / 10.04)));
			strut0.rotateZ(2 * pi / (360 / penta.strut0[sidx].zAngle));
		}
		if (sidx == 9) {
			strut0.rotateX(2 * pi / (360 / penta.strut0[sidx].xAngle));
			strut0.position.x = hub.position.x + (penta.strut0[sidx].xDir * strut0Offset * Math.sin(2 * pi / (360 / penta.strut0[sidx].xOffset)));
			strut0.position.y = hub.position.y + (penta.strut0[sidx].yDir * strut0Offset * Math.cos(2 * pi / (360 / penta.strut0[sidx].yOffset)));
			strut0.position.z = hub.position.z - (strut0Offset * Math.sin(2 * pi / (360 / -10.04)));
			strut0.rotateZ(2 * pi / (360 / penta.strut0[sidx].zAngle));
		}*/
	}
	struts.add(strut0);
	return struts;
}

function newOuterFrame(pidx,tidx) {
	var spaceAngle = new THREE.Euler(0,0,0, 'XYZ');
	var oFrame = new THREE.Group();
	//var strutScaler = new THREE.Vector3(1,1,1);
	var cidx = 8;
	var xCenterOffset = penta.strut[cidx].xHubTranslate + (penta.strut[cidx].xHubOffset * Math.sin(2 * pi / (360 / penta.strut[cidx].hubOffset)));
	var zCenterOffset = (penta.strut[cidx].yHubTranslate + (penta.strut[cidx].yHubOffset * Math.cos(2 * pi / (360 / penta.strut[cidx].hubOffset)))) / 2;
	var typeIndex = 1;
	var strutIndex = 5;
	if (tidx == 2) {
		hexaHub = newHexaHub(tidx);
		hexaFrame = newHexaStruts(hexaHub, tidx);
		hexaFrame.rotation.x -= THREE.Math.degToRad(hexa.zTiltAngle);
		hexaFrame.position.y -= ((1 * hexa.domeRadius) - hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.zTiltAngle));
		hexaFrame.position.y += hexaHub.position.y - (hexa.strutLength / 2) + 0.3;
		hexaFrame.position.z += ((1 * hexa.domeRadius) - hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.zTiltAngle));
		hexaFrame.position.z += 0;
		oFrame.add(hexaFrame);	
	}
	else if (tidx == 3) {
		hexaHub = newHexaHub(tidx);
		hexaFrame = newHexaStruts(hexaHub, tidx);
		hexaFrame.rotation.x -= THREE.Math.degToRad(hexa.zLowTiltAngle);
		hexaFrame.position.y -= ((1 * hexa.domeRadius) - hexa.hubWidth) * Math.sin(2 * pi / (360 / hexa.zLowTiltAngle));
		hexaFrame.position.y += hexaHub.position.y - (hexa.strutLength / 2) + 0.3;
		hexaFrame.position.z += ((1 * hexa.domeRadius) - hexa.hubWidth) * Math.cos(2 * pi / (360 / hexa.zLowTiltAngle));
		hexaFrame.position.z += 0;
		oFrame.add(hexaFrame);	
	}
	else if (tidx == 5) {
		for (strutIndex = 5; strutIndex < 10; strutIndex++) {
			typeIndex = 4;
			pentaHub = newPentaHub(typeIndex, strutIndex);
			typeIndex = 1;
			
			if (strutIndex == 8){
				pentaLongHub = newPentaHub(typeIndex, strutIndex+10);
				pentaHubRef9 = newPentaHub(typeIndex, strutIndex+1);
				pentaHubRef7 = newPentaHub(typeIndex, strutIndex-1);
				
				pentaHubRef6 = newPentaHub(typeIndex, strutIndex-2);
				pentaHubRef5 = newPentaHub(typeIndex, strutIndex-3);
				var tiltedHub8 = pentaHub.clone();
				var tiltedHub5 = pentaHub.clone();
				var tiltedHub6 = pentaHub.clone();
				var tiltedHub18 = pentaLongHub.clone();

				var tiltedHub9 = tiltedHub8.clone();				
				var tiltedHub7 = tiltedHub8.clone();
				tiltedHub9.position.x = pentaHubRef9.position.x;
				tiltedHub9.position.y = pentaHubRef9.position.y;
				tiltedHub9.position.z = pentaHubRef9.position.z;
				tiltedHub7.position.x = pentaHubRef7.position.x;
				tiltedHub7.position.y = pentaHubRef7.position.y;
				tiltedHub7.position.z = pentaHubRef7.position.z;
				tiltedHub6.position.x = pentaHubRef6.position.x;
				tiltedHub6.position.y = pentaHubRef6.position.y;
				tiltedHub6.position.z = pentaHubRef6.position.z;
				tiltedHub5.position.x = pentaHubRef5.position.x;
				tiltedHub5.position.y = pentaHubRef5.position.y;
				tiltedHub5.position.z = pentaHubRef5.position.z;
				
				oFrame.add(tiltedHub9);
				oFrame.add(tiltedHub8);
				oFrame.add(tiltedHub7);
				oFrame.add(tiltedHub6);
				oFrame.add(tiltedHub5);
			}
			oFrame.add(newPentaStrut(tidx,typeIndex,strutIndex,pentaHub));	
			oFrame.position.z = dome.radius;
			oFrame.position.y = pentaHub.position.y - 3;
			oFrame.position.x = 0 - 4.55;//(penta.type[1].length / 2) - (penta.hubWidth / 2);
			//spaceAngle.set(THREE.Math.degToRad((dome.penta[pidx].xAngle * 2.4)),THREE.Math.degToRad(dome.penta[pidx].yAngle),THREE.Math.degToRad(dome.penta[pidx].zAngle), 'XYZ');
			//oFrame.setRotationFromEuler(spaceAngle);

		}
	}
	else {
		for (strutIndex = 5; strutIndex < 10; strutIndex++) {
			pentaHub = newPentaHub(typeIndex, strutIndex);
			//pentaHub.rotation.z = THREE.Math.degToRad(10.04);
			
			if (strutIndex == 8){
				pentaLongHub = newPentaHub(typeIndex, strutIndex+10);
				pentaHubRef9 = newPentaHub(typeIndex, strutIndex+1);
				pentaHubRef7 = newPentaHub(typeIndex, strutIndex-1);
				
				pentaHubRef6 = newPentaHub(typeIndex, strutIndex-2);
				pentaHubRef5 = newPentaHub(typeIndex, strutIndex-3);
				var tiltedHub8 = pentaHub.clone();
				var tiltedHub5 = pentaHub.clone();
				var tiltedHub6 = pentaHub.clone();
				var tiltedHub18 = pentaLongHub.clone();
				
				if (tidx == 1) {
					var tiltedHub9 = tiltedHub8.clone();				
					var tiltedHub7 = tiltedHub8.clone();
					tiltedHub9.position.x = pentaHubRef9.position.x;
					tiltedHub9.position.y = pentaHubRef9.position.y;
					tiltedHub9.position.z = pentaHubRef9.position.z;
					tiltedHub7.position.x = pentaHubRef7.position.x;
					tiltedHub7.position.y = pentaHubRef7.position.y;
					tiltedHub7.position.z = pentaHubRef7.position.z;
					tiltedHub6.position.x = pentaHubRef6.position.x;
					tiltedHub6.position.y = pentaHubRef6.position.y;
					tiltedHub6.position.z = pentaHubRef6.position.z;
					tiltedHub5.position.x = pentaHubRef5.position.x;
					tiltedHub5.position.y = pentaHubRef5.position.y;
					tiltedHub5.position.z = pentaHubRef5.position.z;
					tiltedHub8.rotation.z = THREE.Math.degToRad(20.08);
					tiltedHub8.rotation.y = THREE.Math.degToRad(45 - 144);
					tiltedHub9.rotation.z = THREE.Math.degToRad(20.08);
					tiltedHub9.rotation.y = THREE.Math.degToRad(45 - 72);
					tiltedHub5.rotation.z = THREE.Math.degToRad(20.08);
					tiltedHub5.rotation.y = THREE.Math.degToRad(45);
					tiltedHub6.rotation.z = THREE.Math.degToRad(20.08);
					tiltedHub6.rotation.y = THREE.Math.degToRad(45 + 72);
					tiltedHub7.rotation.z = THREE.Math.degToRad(20.08);
					tiltedHub7.rotation.y = THREE.Math.degToRad(45 + 144);
				}
				else if (tidx ==4) {
					var tiltedHub9 = tiltedHub8.clone();				
					var tiltedHub7 = tiltedHub8.clone();
					tiltedHub9.position.x = pentaHubRef9.position.x;
					tiltedHub9.position.y = pentaHubRef9.position.y;
					tiltedHub9.position.z = pentaHubRef9.position.z;
					tiltedHub7.position.x = pentaHubRef7.position.x;
					tiltedHub7.position.y = pentaHubRef7.position.y;
					tiltedHub7.position.z = pentaHubRef7.position.z;
					tiltedHub6.position.x = pentaHubRef6.position.x;
					tiltedHub6.position.y = pentaHubRef6.position.y;
					tiltedHub6.position.z = pentaHubRef6.position.z;
					tiltedHub5.position.x = pentaHubRef5.position.x;
					tiltedHub5.position.y = pentaHubRef5.position.y;
					tiltedHub5.position.z = pentaHubRef5.position.z;
					//tiltedHub8.rotation.z = THREE.Math.degToRad(20.08);
					tiltedHub8.rotation.x = THREE.Math.degToRad(-90 - (2 * 10.04));
					tiltedHub9.rotation.x = THREE.Math.degToRad(-90 - (1 * 5.04));
					tiltedHub7.rotation.x = THREE.Math.degToRad(-90 - (1 * 5.04));
					tiltedHub6.rotation.z = THREE.Math.degToRad(-20.08);
					tiltedHub5.rotation.z = THREE.Math.degToRad(20.08);
				}
				else {
					tiltedHub8.rotation.x = THREE.Math.degToRad(-90 - (2 * 10.04));
					var tiltedHub9 = pentaLongHub.clone();
					tiltedHub9.rotation.x = THREE.Math.degToRad(-90 - (1 * 5.04));
					var tiltedHub7 = pentaLongHub.clone();
					tiltedHub7.rotation.x = THREE.Math.degToRad(-90 - (1 * 5.04));
					
					tiltedHub9.position.x = pentaHubRef9.position.x + (((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08))) - 0.5 - (((((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08)))-(3*penta.hubWidth)) * Math.sin(2 * pi / (360 / 10.04)));
					tiltedHub9.position.y = pentaHubRef9.position.y - (((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08))) + (((((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08)))-penta.hubWidth) * Math.cos(2 * pi / (360 / 10.04)));
					tiltedHub9.position.z = pentaHubRef9.position.z - (((penta.hubLength/2) * penta.tiltFactor) * Math.cos(2 * pi / (360 / 20.08))) + 2.0;
					
					tiltedHub7.position.x = pentaHubRef7.position.x - (((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08))) + 0.5 - (((((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08)))-(3*penta.hubWidth)) * Math.sin(2 * pi / (360 / 10.04)));
					tiltedHub7.position.y = pentaHubRef7.position.y - (((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08))) + (((((penta.hubLength/2) * penta.tiltFactor) * Math.sin(2 * pi / (360 / 20.08)))-penta.hubWidth) * Math.cos(2 * pi / (360 / 10.04)));
					tiltedHub7.position.z = pentaHubRef7.position.z - (((penta.hubLength/2) * penta.tiltFactor) * Math.cos(2 * pi / (360 / 20.08))) + 2.0;

					tiltedHub9.rotation.z = THREE.Math.degToRad(-20.08);
					tiltedHub7.rotation.z = THREE.Math.degToRad(20.08);
					
					tiltedHub6.position.x = pentaHubRef6.position.x;
					tiltedHub6.position.y = pentaHubRef6.position.y;
					tiltedHub6.position.z = pentaHubRef6.position.z;
					tiltedHub6.rotation.z = THREE.Math.degToRad(-20.08);
					
					tiltedHub5.position.x = pentaHubRef5.position.x;
					tiltedHub5.position.y = pentaHubRef5.position.y;
					tiltedHub5.position.z = pentaHubRef5.position.z;
					tiltedHub5.rotation.z = THREE.Math.degToRad(20.08);
				}
				
				oFrame.add(tiltedHub9);
				oFrame.add(tiltedHub8);
				oFrame.add(tiltedHub7);
				oFrame.add(tiltedHub6);
				oFrame.add(tiltedHub5);
				
				if (tidx == 1) {
					var hubGeo = new THREE.CylinderGeometry( penta.hubWidth, penta.hubWidth, (penta.shortHubLength), 32, 1 );
					var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
					var innerHub = new THREE.Mesh( hubGeo, hubMat );
					innerHub.position.z = 2.5;
				}
				else if (tidx == 4) {
					var hubGeo = new THREE.CylinderGeometry( penta.hubWidth, penta.hubWidth, (penta.shortHubLength), 32, 1 );
					var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
					var innerHub = new THREE.Mesh( hubGeo, hubMat );
					innerHub.position.z = 2.5;
				}
				else {
					var hubGeo = new THREE.CylinderGeometry( penta.hubWidth, penta.hubWidth, (penta.hubLength), 32, 1 );
					var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
					var innerHub = new THREE.Mesh( hubGeo, hubMat );
					innerHub.position.z = -21;
				}
				
				innerHub.translateY(pentaHub.position.y / 2);
				innerHub.translateX(pentaHub.position.x);
				//innerHub.translateZ(3);
				
				innerHub.rotateX(2 * pi / (360 / 90));
				oFrame.add(innerHub);
				//var strutMat = new THREE.MeshPhongMaterial( {color: 'aqua'} );
			}
			
			oFrame.add(newPentaStrut(tidx,typeIndex,strutIndex,pentaHub));
			typeIndex = typeIndex - 1;
			strutIndex = strutIndex - 5;
			oFrame.add(newPentaStrut(tidx,typeIndex,strutIndex,pentaHub));
			typeIndex = typeIndex + 1;
			strutIndex = strutIndex + 5;
			
			//oFrame.rotateY(dome.penta[pidx].yAngle);
			//oFrame.rotation.x = THREE.Math.degToRad(dome.penta[pidx].xAngle);
			//oFrame.rotation.y = THREE.Math.degToRad(dome.penta[pidx].yAngle);
			
			
			
			if (tidx == 0) {
				oFrame.position.z = (dome.penta[pidx].zPentaDir * dome.pentaOffset * Math.cos(2 * pi / (360 / dome.penta[pidx].zPentaAngle))) + (dome.radius * Math.sin(2 * pi / (360 / dome.penta[pidx].zRadiusAngle)));
				oFrame.position.x = (dome.pentaOffset * Math.sin(2 * pi / (360 / dome.penta[pidx].xPentaAngle))) + (dome.radius * Math.cos(2 * pi / (360 / dome.penta[pidx].xRadiusAngle)));
				spaceAngle.set(THREE.Math.degToRad((dome.penta[pidx].xAngle * 2.4)),THREE.Math.degToRad(dome.penta[pidx].yAngle),THREE.Math.degToRad(dome.penta[pidx].zAngle), 'XYZ');
				oFrame.setRotationFromEuler(spaceAngle);
			}
			else if (tidx == 4) {
				oFrame.position.z = (dome.penta[pidx].zPentaDir * dome.pentaOffset * Math.cos(2 * pi / (360 / dome.penta[pidx].zPentaAngle))) + (dome.radius * Math.sin(2 * pi / (360 / dome.penta[pidx].zRadiusAngle)));
				oFrame.position.x = (dome.pentaOffset * Math.sin(2 * pi / (360 / dome.penta[pidx].xPentaAngle))) + (dome.radius * Math.cos(2 * pi / (360 / dome.penta[pidx].xRadiusAngle)));
				spaceAngle.set(THREE.Math.degToRad((dome.penta[pidx].xAngle * 2.4)),THREE.Math.degToRad(dome.penta[pidx].yAngle),THREE.Math.degToRad(dome.penta[pidx].zAngle), 'XYZ');
				oFrame.setRotationFromEuler(spaceAngle);
			}
			if (tidx == 1) {
				oFrame.rotation.x = THREE.Math.degToRad(-90);
				oFrame.rotation.z = THREE.Math.degToRad(34);
				oFrame.position.x -= 0.1;
				oFrame.position.y += 8.3;
				oFrame.position.z += 3.6;

			}
		}
	}

	return oFrame;
}

function newFrame(sidx, didx, isc, map){
	var spaceAngle = new THREE.Euler(0,0,0, 'XYZ');
	var strutGeo = new THREE.CylinderGeometry( 2, 2, 50, 32, 1 );
	var centerPenta = new THREE.Group();
	var pentaStrut0 = new THREE.Group();
	var domeFrame = new THREE.Group();
	
	if (didx != 2) {
		var hexaFrame0 = newOuterFrame(0,2);
		//hexaFrame0.position.x -= ((strutOffset) * Math.sin(2 * pi / (360 / 72))) - ((pentaOffset) * Math.sin(2 * pi / (360 / 72)));
		//hexaFrame0.position.z -= ((strutOffset) * Math.cos(2 * pi / (360 / 72))) - ((pentaOffset) * Math.cos(2 * pi / (360 / 72)));
		hexaFrame0.rotation.y = THREE.Math.degToRad(-36);
		var hexaFrame1 = hexaFrame0.clone();
		hexaFrame1.rotation.y = THREE.Math.degToRad(36);
		var hexaFrame2 = hexaFrame0.clone();
		hexaFrame2.rotation.y = THREE.Math.degToRad(36 + 72);
		var hexaFrame3 = hexaFrame0.clone();
		hexaFrame3.rotation.y = THREE.Math.degToRad(36 + 144);
		var hexaFrame4 = hexaFrame0.clone();
		hexaFrame4.rotation.y = THREE.Math.degToRad(-36 -72);
		
		domeFrame.add(hexaFrame1);
		domeFrame.add(hexaFrame2);
		domeFrame.add(hexaFrame3);
		domeFrame.add(hexaFrame4);
		
		var coneMat = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			color: new THREE.Color( susta.color ),
			side: THREE.DoubleSide,
			transparent: false
		} );
		var coneGeo = new THREE.ConeGeometry( 45, 22, 32, true, Math.PI * 2, Math.PI * 1 );
		var cone = new THREE.Mesh( coneGeo, coneMat );
		cone.position.y += 7;
		cone.rotation.x = THREE.Math.degToRad(180);
		//var tunnelFrame0 = newOuterFrame(0,5);
		
		if (isc == 1) {
			var foilMat = new THREE.MeshPhongMaterial( {
				vertexColors: THREE.FaceColors,
				color: new THREE.Color( susta.foilcolor ),
				shininess: 100,
				side: THREE.DoubleSide,
				transparent: true, 
				opacity: 0.8,
				envMap: map
			} );
			
			var tunnelFrame00 = newOuterFrame(0,5);
			tunnelFrame00.scale.set(0.4,0.4,0.4);
			var tunnelFrame01 = tunnelFrame00.clone();
			tunnelFrame01.position.z += 20;
			var tunnelFrame10 = newOuterFrame(0,5);
			tunnelFrame10.scale.set(0.4,0.4,0.4);
			
			domeFrame.add(tunnelFrame00);
			domeFrame.add(tunnelFrame01);
			
			var tunnelGeo = new THREE.CylinderGeometry( 7, 7, 65, 32, 1, true );
			var floorGeo = new THREE.CylinderGeometry( 9, 9, 65, 32, 1, true, Math.PI * -0.3, Math.PI * 0.5 );
			var tunnelMat = new THREE.MeshPhongMaterial( {color: susta.color, side: THREE.DoubleSide,} );
			var tunnel = new THREE.Mesh( tunnelGeo, foilMat);
			var floor = new THREE.Mesh( floorGeo, tunnelMat);
			tunnel.position.z += 50;
			tunnel.position.y += 24;
			tunnel.rotation.x = THREE.Math.degToRad(90);
			floor.position.z += 50;
			floor.position.y += 27;
			floor.rotation.x = THREE.Math.degToRad(90);
			domeFrame.add(tunnel);
			domeFrame.add(floor);
		}

		domeFrame.add(hexaFrame0);
	}
	
	var hexaFrame5 = newOuterFrame(0,3);
	hexaFrame5.rotation.y = THREE.Math.degToRad(-36);
	if (didx == 2) {
		var rock = new THREE.TextureLoader().load( "content/rock.jpg" );
		rock.wrapS = THREE.RepeatWrapping;
		rock.wrapT = THREE.RepeatWrapping;
		rock.repeat.set( 16, 4 );
		var rockMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, map: rock });
		var rockGeo = new THREE.ConeGeometry( 20.5, 4, 6, true, Math.PI * 2, Math.PI * 1 );
		var rock = new THREE.Mesh( rockGeo, rockMaterial );
		rock.position.y += 0.5;
		rock.position.x += 0;
		rock.position.z += 49;
		
		rock.rotation.x = THREE.Math.degToRad(90 - 8);
		rock.rotation.y = THREE.Math.degToRad(-30);
		
		hexaFrame5.add( rock );		
	}
	var hexaFrame6 = hexaFrame5.clone();
	hexaFrame6.rotation.y = THREE.Math.degToRad(36);
	var hexaFrame7 = hexaFrame5.clone();
	hexaFrame7.rotation.y = THREE.Math.degToRad(36 + 72);
	var hexaFrame8 = hexaFrame5.clone();
	hexaFrame8.rotation.y = THREE.Math.degToRad(36 + 144);
	var hexaFrame9 = hexaFrame5.clone();
	hexaFrame9.rotation.y = THREE.Math.degToRad(-36 -72);
	
	
	if (didx != 2) {
		var pentagon = newOuterFrame(0,0);
		var cpentagon = newOuterFrame(0,1);
		centerPenta.add(cpentagon);
		domeFrame.add(centerPenta);
		var strutMat = new THREE.MeshPhongMaterial( {color: susta.color}  );
	}
	
	if (didx == 2) {
		var wpentagon = newOuterFrame(0,4);
		var strutMat = new THREE.MeshPhongMaterial( {color: susta.color}  );
		
		var rock = new THREE.TextureLoader().load( "content/rock.jpg" );
		rock.wrapS = THREE.RepeatWrapping;
		rock.wrapT = THREE.RepeatWrapping;
		rock.repeat.set( 16, 4 );
		var rockMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, map: rock });
		var rockGeo = new THREE.ConeGeometry( 18.7, 4, 5, true, Math.PI * 2, Math.PI * 1 );
		var rock = new THREE.Mesh( rockGeo, rockMaterial );
		rock.position.y += 15.8;
		rock.position.x += 11.4;
		rock.position.z += 2;
		rock.rotation.x = THREE.Math.degToRad(90);
		
		wpentagon.add( rock );
	}
	
	var strut = new THREE.Mesh( strutGeo, strutMat );
	var strutOffset = 25;
	var pentaOffset = 20.18 + 2 + 2;
	//var centerStrut = strut.clone();
	
	//centerStrut.position.y = 23;
	
	strut.position.z = dome.strut[sidx].zDir * strutOffset * Math.cos(2 * pi / (360 / dome.strut[sidx].zOffset));
	strut.position.y = dome.strut[sidx].yDir * strutOffset * Math.sin(2 * pi / (360 / dome.strut[sidx].yOffset));
	//strut.rotateZ(2 * pi / (360 / dome.strut[sidx].zAngle));
	strut.rotateX(2 * pi / (360 / dome.strut[sidx].xAngle));
	//strut.rotation.y = THREE.Math.degToRad(-18);
	
	//centerPenta.add(centerStrut);
	
	domeFrame.add(pentaStrut0);
	
	if (didx == 2) {
		pentaStrut0.add(wpentagon);
		
	}
	else {
		pentaStrut0.add(pentagon);
		
	}
	var pentaStrut1 = pentaStrut0.clone();
	var pentaStrut2 = pentaStrut0.clone();
	var pentaStrut3 = pentaStrut0.clone();
	var pentaStrut4 = pentaStrut0.clone();
		
	pentaStrut3.position.x = ((strutOffset) * Math.sin(2 * pi / (360 / 72))) - ((pentaOffset) * Math.sin(2 * pi / (360 / 72)));
	pentaStrut3.position.z -= 2 * (((strutOffset) * Math.cos(2 * pi / (360 / 72))) - ((pentaOffset) * Math.cos(2 * pi / (360 / 72))));
	pentaStrut3.rotation.y = THREE.Math.degToRad(144);
		
	pentaStrut2.position.x = ((strutOffset) * Math.sin(2 * pi / (360 / 72))) - ((pentaOffset) * Math.sin(2 * pi / (360 / 72)));
	pentaStrut2.position.z -= ((strutOffset) * Math.cos(2 * pi / (360 / 72))) - ((pentaOffset) * Math.cos(2 * pi / (360 / 72)));
	pentaStrut2.rotation.y = THREE.Math.degToRad(72);
		
	pentaStrut1.position.x -= ((strutOffset) * Math.sin(2 * pi / (360 / 72))) - ((pentaOffset) * Math.sin(2 * pi / (360 / 72)));
	pentaStrut1.position.z -= ((strutOffset) * Math.cos(2 * pi / (360 / 72))) - ((pentaOffset) * Math.cos(2 * pi / (360 / 72)));
	pentaStrut1.rotation.y = THREE.Math.degToRad(-72);
		
	pentaStrut0.position.x -= ((strutOffset) * Math.sin(2 * pi / (360 / 72))) - ((pentaOffset) * Math.sin(2 * pi / (360 / 72)));
	pentaStrut0.position.z -= 2 * (((strutOffset) * Math.cos(2 * pi / (360 / 72))) - ((pentaOffset) * Math.cos(2 * pi / (360 / 72))));
	pentaStrut0.rotation.y = THREE.Math.degToRad(-144);
		
	domeFrame.add(pentaStrut1);
	domeFrame.add(pentaStrut2);
	domeFrame.add(pentaStrut3);
	domeFrame.add(pentaStrut4);
		
	domeFrame.add(hexaFrame5);
	domeFrame.add(hexaFrame6);
	domeFrame.add(hexaFrame7);
	domeFrame.add(hexaFrame8);
	domeFrame.add(hexaFrame9);

	return domeFrame;
}

function newDome(domeType, isCenter, world, skyMap) {
	var spaceAngle = new THREE.Euler(0,0,0, 'XYZ');
	var dome = new THREE.Group();
	var domeFrame = new THREE.Group();
	var domeIndex = 0;
	
	if (domeType != 2) {
		var hubGeo = new THREE.CylinderGeometry( 3, 3, 3, 32, 1 );
		var hubMat = new THREE.MeshPhongMaterial( {color: susta.color} );
		var domeHub = new THREE.Mesh( hubGeo, hubMat );
		domeHub.position.y = -0.5;
		domeFrame.add(domeHub);
	}
	domeFrame.add(newFrame(domeIndex, domeType, isCenter, skyMap));
	
	dome.add(domeFrame);
	
	if (domeType == 0) {
		var coneMat = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			color: new THREE.Color( susta.color ),
			shininess: 100,
			side: THREE.DoubleSide,
			transparent: false,
			envMap: skyMap,
			dithering: true
		} );
	
		var dirtMap = new THREE.TextureLoader().load( 'content/backgrounddetailed6.jpg' );
		dirtMap.wrapS = dirtMap.wrapT = THREE.RepeatWrapping;
		dirtMap.repeat.set( 32, 16 );
		var dirtFace = new THREE.TextureLoader().load( 'content/dirtSurface.jpg' );
		dirtFace.wrapS = dirtFace.wrapT = THREE.RepeatWrapping;
		dirtFace.repeat.set( 32, 16 );
		
		var foilMat = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			color: new THREE.Color( susta.foilcolor ),
			shininess: 100,
			side: THREE.DoubleSide,
			transparent: true, 
			opacity: 0.8,
			envMap: skyMap
		} );
		
		var dirtMat = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			color: new THREE.Color( susta.foilcolor ),
			shininess: 1,
			side: THREE.DoubleSide,
			map: dirtMap,
			envMap: skyMap,
			bumpMap: dirtFace,
			bumpScale: 12,
			dithering: true
		} )
		
		var earthShader = {
			uniforms: THREE.UniformsUtils.merge( [
				THREE.UniformsLib[ 'fog' ],
				{
					alpha: 1.0,
					time: 0.0,
					distortionScale: 10.0,
					noiseScale: 1.0,
					textureMatrix: new THREE.Matrix4(),
					sunColor: new THREE.Color( 0x7F7F7F ),
					sunDirection: new THREE.Vector3( 0, 69, 0 ),
					eye: new THREE.Vector3()
				}
			] ),
		}
		var earthSurface = THREE.UniformsUtils.clone( earthShader.uniforms );
		var earthMat = new THREE.ShaderMaterial( {
			uniforms: earthSurface,
			side: THREE.BackSide,
			dithering: true
		} );
	
		var foilGeo = new THREE.SphereGeometry(50, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.495 );
		var foilMesh = new THREE.Mesh( foilGeo, foilMat );
		foilMesh.position.y -= 7;
		
		var coneGeo = new THREE.ConeGeometry( 39, 22, 32, true, Math.PI * 2, Math.PI * 1 );
		var coneMesh = new THREE.Mesh( coneGeo, coneMat );
		coneMesh.position.y += 7;
		coneMesh.rotation.x = THREE.Math.degToRad(180);
	
		var dirtGeo = new THREE.ConeGeometry( 36, 8, 16, true, Math.PI * 1, Math.PI * 0.1 );
		var dirtMesh = new THREE.Mesh( dirtGeo, dirtMat );
		dirtMesh.position.y += 13;
		dirtMesh.rotation.x = THREE.Math.degToRad(180);
		
		var foilType = 0;
		var cutType = 0;
		if (isCenter == 0) {
			cutType = 1;
			foilMesh.name = "Center foil";
			
			//substraction - access to the dome - can be enabled but yields longer load time
			//var cuttedFoilMesh = modFoil(foilMesh, foilType, cutType, skyMap);
		}
		else {
			foilMesh.name = "Satelite foil";
			foilType = 1;
			//substraction - access to the dome - can be enabled but yields longer load time
			//var cuttedFoilMesh = modFoil(foilMesh, foilType, cutType, skyMap);
		}
		
		//substraction - access to the dome - can be enabled but yields longer load time
		//dome.add( cuttedFoilMesh );
		dome.add( foilMesh );
		
		var yuccas = new THREE.Group();
		var yuccaManager = new THREE.LoadingManager( function() {
			yucca.position.y += 13;
			yucca.position.x = 15;
			yucca.position.z = 15;
			yucca.scale.set(2,2,2);
			yuccas.add( yucca );
			var yucca2 = yucca.clone();
			yucca2.position.y += 0;
			yucca2.position.x = -15;
			yucca2.position.z = 15;
			yuccas.add(yucca2);
			var yucca3 = yucca.clone();
			yucca3.position.y += 1;
			yucca3.position.x = -15;
			yucca3.position.z = -30;
			yuccas.add(yucca3);
			var yucca4 = yucca.clone();
			yucca4.position.y -= 4;
			yucca4.position.x = 10;
			yucca4.position.z = 10;
			yuccas.add(yucca4);
		} );
		var plantManager = new THREE.LoadingManager( function() {
			plant.scale.set(7,7,7);
			plant.position.y += 9;
			plant.position.x = 0;
			dome.add( plant );
		} );
		
		var yuccaLoader = new THREE.ColladaLoader( yuccaManager );
		yuccaLoader.options.convertUpAxis = true;
		yuccaLoader.load( './content/yucca.dae', function ( collada ) { yucca = collada.scene; } );
		
		var plantLoader = new THREE.ColladaLoader( plantManager );
		plantLoader.options.convertUpAxis = true;
		plantLoader.load( './content/plant.dae', function ( collada ) {	plant = collada.scene; } );

		dome.add( coneMesh );
		dome.add( dirtMesh );
		dome.add( yuccas );
	}
	
	if (domeType == 1) {
		var coneMat = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			color: new THREE.Color( susta.color ),
			shininess: 100,
			side: THREE.DoubleSide,
			transparent: false,
			envMap: skyMap,
			dithering: true
		} );
		
		var rock = new THREE.TextureLoader().load( "content/rock.jpg" );
		rock.wrapS = THREE.RepeatWrapping;
		rock.wrapT = THREE.RepeatWrapping;
		rock.repeat.set( 32, 16 );
		var rockMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, map: rock });
		var rockGeo = new THREE.SphereGeometry(51.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.455 );
		var rock = new THREE.Mesh( rockGeo, rockMaterial );
		rock.position.y -= 7;
		dome.add( rock );
		
		var coneGeo = new THREE.ConeGeometry( 43, 22, 32, true, Math.PI * 2, Math.PI * 1 );
		var cone = new THREE.Mesh( coneGeo, coneMat );
		cone.position.y += 7;
		cone.rotation.x = THREE.Math.degToRad(180);
		dome.add( cone );
	}
	
	if (domeType == 2) {
		var rock = new THREE.TextureLoader().load( "content/rock.jpg" );
		rock.wrapS = THREE.RepeatWrapping;
		rock.wrapT = THREE.RepeatWrapping;
		rock.repeat.set( 32, 16 );
		var rockMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, map: rock });
		var rockGeo = new THREE.SphereGeometry(52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.495 );
		var rock = new THREE.Mesh( rockGeo, rockMaterial );
		rock.position.y -= 7;
	}
	
	dome.scale.set(0.7,0.7,0.7);
	return dome;
}