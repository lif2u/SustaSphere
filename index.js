
$(document).ready(function()	{
	
	var sustaBuilder, sustaWorld;
	var sustaView, sustaLight, sustaLightRay, skyMap, skyShader, innerWater, weedWater;
	var water, sustaWater, oceanMesh, skyLoader, skyBoxMaterial;
	
	var ifrm = document.createElement('iframe');
	ifrm.setAttribute('id', 'ifrm');
	ifrm.setAttribute('src', 'about: blank');
	ifrm.setAttribute('width', '100%');
	ifrm.setAttribute('height', '0');
	ifrm.setAttribute('scrolling', 'no');
	ifrm.setAttribute('frameborder', 'no');
	ifrm.setAttribute('style.backgroundColor', 'transparent');
	ifrm.setAttribute('allowtransparency', 'true');
	document.body.appendChild(ifrm);
	ifrm.setAttribute('src', 'http://d19bhbirxx14bg.cloudfront.net/debussy-laplusquelente-breemer.mp3');
	//http://d19bhbirxx14bg.cloudfront.net/debussy-la-plus-pascale.mp3
	//https://soundcloud.com/contrillion
	//ifrm.setAttribute('src', 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/15351281&amp;color=%23ff5500&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true');
	
	sustaBuilder = new THREE.WebGLRenderer();
	sustaBuilder.setSize( viewWidth, viewHeigth );
	document.body.appendChild( sustaBuilder.domElement );
	
	sustaWorld = new THREE.Scene();
	sustaLight = newLight('world', 0);
	sustaLightRay = sustaLight.position.clone().normalize();
	var bowlLight = newLight('bowl', 1);
	var domeLight = newLight('dome', 2);
	var bowlLightRay = bowlLight.position.clone().normalize();
	sustaWorld.add(sustaLight);
	sustaWorld.add(bowlLight);
	sustaWorld.add(domeLight);
	sustaWorld.fog = new THREE.FogExp2( 0xaabbbb, 0.0001 );
	sustaView = newView(new THREE.PerspectiveCamera( viewAngle, viewAspect, viewNose, viewHorizon ));
	
	sustaWater = new THREE.TextureLoader().load( 'content/waternormals.jpg' );
	sustaWater.wrapS = sustaWater.wrapT = THREE.RepeatWrapping;

	sustaWorld.add( new THREE.AmbientLight( 0x444444 ) );
		
	water = new THREE.Water( sustaBuilder, sustaView, sustaWorld, {
		textureWidth: 512,
		textureHeight: 512,
		//normalSampler: sustaWater,
		waterNormals: sustaWater,
		alpha: 	1.0,
		sunDirection: sustaLightRay,
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 40.0,
		noiseScale: 1.80,
		fog: sustaWorld.fog != undefined
	} );
		
	oceanMesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( parameters.width * 50, parameters.height * 50 ),
		water.material
	);
	
	oceanMesh.add( water );
	oceanMesh.rotation.x = - Math.PI * 0.5;
	sustaWorld.add( oceanMesh );
	
	skyMap = new THREE.CubeTexture( [] );
	skyMap.format = THREE.RGBFormat;

	skyLoader = new THREE.ImageLoader();
	skyLoader.load( 'content/skyboxsun25degtest.png', function ( image ) {
		var getSide = function ( x, y ) {
			var size = 1024;
			var canvas = document.createElement( 'canvas' );
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext( '2d' );
			context.drawImage( image, - x * size, - y * size );
			return canvas;
		};
		skyMap.images[ 0 ] = getSide( 2, 1 ); // px
		skyMap.images[ 1 ] = getSide( 0, 1 ); // nx
		skyMap.images[ 2 ] = getSide( 1, 0 ); // py
		skyMap.images[ 3 ] = getSide( 1, 2 ); // ny
		skyMap.images[ 4 ] = getSide( 1, 1 ); // pz
		skyMap.images[ 5 ] = getSide( 3, 1 ); // nz
		skyMap.needsUpdate = true;
	} );
		
	skyShader = THREE.ShaderLib[ 'cube' ];
	skyShader.uniforms[ 'tCube' ].value = skyMap;

	skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: skyShader.fragmentShader,
		vertexShader: skyShader.vertexShader,
		uniforms: skyShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );

	var skyMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 100000, 100000, 100000 ),
		skyBoxMaterial
	);
	sustaWorld.add( skyMesh );
		
	controls = new THREE.OrbitControls( sustaView, sustaBuilder.domElement );
	controls.enablePan = false;
	controls.minDistance = -1500.0;
	controls.maxDistance = 500.0;
	controls.maxPolarAngle = Math.PI * 0.495;
	controls.target.set( horiLookAtPos, vertiLookAtPos, destiLookAtPos );
	controls.update();
		
	//sustaBuilder.context.getExtension('EXT_shader_texture_lod');
	//document.body.appendChild( sustaBuilder.domElement );
	
	
	
	//domeLight.target = cuttedFoilMesh;
	//sustaWorld.add( domeLight.target );
	//sustaWorld.add( cuttedFoilMesh );
	
	var centerDome = newDome(0, 0, sustaWorld, skyMap);
	var sustaBowl = newDome(1, 0, sustaWorld, skyMap);
	var bowlWall = newDome(2, 0, sustaWorld, skyMap);
	var leftDome = newDome(0, 1, sustaWorld, skyMap);
	var rightDome = newDome(0, 1, sustaWorld, skyMap);
	var rearDome = newDome(0, 1, sustaWorld, skyMap);
		
	innerWater = new THREE.Water( sustaBuilder, sustaView, sustaWorld, {
		textureWidth: 64,
		textureHeight: 64,
		waterNormals: sustaWater,
		alpha: 	0.99,
		sunDirection: bowlLightRay,
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 20.0,
		noiseScale: 1.0,
		fog: sustaWorld.fog != undefined
	} );
		
	weedWater = new THREE.Water( sustaBuilder, sustaView, sustaWorld, {
		textureWidth: 64,
		textureHeight: 64,
		waterNormals: sustaWater,
		alpha: 	0.99,
		sunDirection: bowlLightRay,
		sunColor: 0xffffff,
		waterColor: 0x006600,//001e0f,
		distortionScale: 40.0,
		noiseScale: 1.0,
		fog: sustaWorld.fog != undefined
	} );
		
	bowlWall.scale.set(3,3,3);
	bowlWall.position.y = 0;
		
	var weedBowl = new THREE.Mesh(
		new THREE.ConeGeometry( 250, 4, 64, true, Math.PI * 2, Math.PI * 1 ),
		weedWater.material
	);
	weedBowl.add( weedWater );
		
	sustaBowl.scale.set(5,5,5);
	sustaBowl.rotation.x = THREE.Math.degToRad(180);
	sustaBowl.position.y += 25;
	
	sustaWorld.add(sustaBowl);
		
	var waterBowl = new THREE.Mesh(	new THREE.ConeGeometry( 136, 4, 64, true, Math.PI * 2, Math.PI * 1 ), innerWater.material );
	waterBowl.add( innerWater );
	waterBowl.position.y = 50;

	centerDome.position.y += 49;
	leftDome.position.y += 49;
	rightDome.position.y += 49;
	rearDome.position.y += 49;
		
	leftDome.position.x = ((hexa.domeRadius * 1.6) * Math.sin(2 * pi / (360 / 120)));
	leftDome.position.z = ((hexa.domeRadius * -1.6) * Math.cos(2 * pi / (360 / 120)));
	leftDome.rotation.y = THREE.Math.degToRad(-120);
	rightDome.position.x = ((hexa.domeRadius * -1.6) * Math.sin(2 * pi / (360 / 120)));
	rightDome.position.z = ((hexa.domeRadius * -1.6) * Math.cos(2 * pi / (360 / 120)));
	rightDome.rotation.y = THREE.Math.degToRad(120);
	rearDome.position.x = centerDome.position.x;
	rearDome.position.z = (hexa.domeRadius * -1.6);
		
	sustaWorld.add(waterBowl);
	sustaWorld.add(weedBowl);
	sustaWorld.add(bowlWall);
		
	sustaWorld.add(centerDome);
	sustaWorld.add(leftDome);
	sustaWorld.add(rightDome);
	sustaWorld.add(rearDome);
		
	var textLines = [
		"when you need shelter",
		"to express yourself",
		"courageous in a fair sustainable sphere",
		"Venus' supporting little sista",
		"seeking truth based on moral conducts",
		"in dreams begins responsibility",
		"supported by skilled co-operative members",
		"expose wasteful virtues and barren passions",
		"together with fellow travelers",
		"taking it slow, letting it flow",
		"SustaSphere might be your place", 
		"sustain a sphere of dignity", 
		"sustasphere.org",
		""
	];

	
	var maxTextLineItems = textLines.length;
	var nextLineAngle = 360 / (maxTextLineItems - 1);
	var quarterBowlAngle = 90;
	
	/*var textMeshGroup = new THREE.Group();
	var textMat = new THREE.MeshPhongMaterial( { color: susta.textcolor, flatShading: true } );
	var fntLoader = new THREE.FontLoader();
	fntLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( textFont ) {
		for (lineIdx = 1; lineIdx < (maxTextLineItems); lineIdx++) {
			destiTextAngle = (textAngle * 2) - (textAngle * lineIdx);
			textMeshList.unshift(spawnTextLine( {
				name: 'promo-line-' + lineIdx, 
				index: lineIdx,
				font: textFont,
				phrases: textLines,
				horiPos: maxTextHoriLeft + (lineIdx * (textHoriShiftRight)), 
				vertiPos: maxTextVeriTop * Math.sin(2 * pi / (360 / destiTextAngle)),
				destiPost: maxTextDestiPosition * Math.cos(2 * pi / (360 / destiTextAngle)),
				horiAngle: textAngle,
				vertiAngle: 0,
				material: textMat,
				group: textMeshGroup
			}));
		};
		sustaWorld.add(textMeshGroup);
		
		var textLight = new THREE.PointLight( susta.textlight, 1.5 );
		textLight.position.set( -1500, 15, 0 );
		sustaWorld.add( textLight );
	} );
	*/
	sustaView.lookAt(horiLookAtPos, vertiLookAtPos, destiLookAtPos);
	sustaView.position.set(horiLookFromPos, vertiLookFromPos, destiLookFromPos);
	
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	
	function render() {
		var time = performance.now() * 0.001;
		/*if (flightAngle < 270) {
			flightAngle += 0.35;
			horiLookFromPos -= 0.5;
		}
		if (takeoffState) {
			deltaTextAngle += 0.55;
			vertiLookFromPos =  65 + ((newsWeight / 1) * ((Math.sin(2 * pi / (360 / flightAngle))) + 1));
			destiLookFromPos =  (newsWeight * 2.5) * ((Math.sin(2 * pi / (360 / flightAngle))) + 1);
			vertiLookAtPos += 0.3;
			destiLookAtPos -= 0.5;

			if (vertiLookFromPos > 250) {
				moveState = true;
			}
		}
		if (moveState) {
			takeoffState = false;
			//horiLookFromPos -= 0.3;
			deltaTextAngle += 0.55;

		}
		
		if (destiLookFromPos > 850) {
			moveState = false;
			deltaTextAngle += 0.55;
		}
		
		/*if (vertiLookAtPos > 65) {
			
		}
		//if ( vertiLookFromPos > 90) {
			horiTurner += 0.001 * (flightAccelerator );
			horiLookAtPos = ((maxTextHoriLeft + 1250) * horiTurner) ;
			if (horiLookFromPos < 550) {
				horiLookFromPos += (250 * horiTurner);
				//horiLookAtPos = (maxTextHoriLeft * horiTurner) ;
				if ( vertiLookAtPos < 250) {
					vertiLookAtPos += 1;
				}
				
			}
		//}
		if (takeoffState) {
			//if ( flightAngle < 270 ) {
			//	flightAngle += flightAccelerator * 1.1;
			//}
			takeOffThrust -= 0.01;
			if (destiLookFromPos < -100 ) {
				destiLookFromPos -= takeOffThrust * newsWeight;
			}
			else {
				deltaTextAngle += 0.15;
				sustaWorld.rotation.y = THREE.Math.degToRad(sustaWorldVertiAngle);
				console.log('Keep turning');
				if (sustaWorldVertiAngle > -18) {
					sustaWorldVertiAngle -= 0.5;
				}
			}
			//destiLookFromPos -=  (takeOffThrust * newsWeight) * ((Math.sin(2 * pi / (360 / flightAngle))) + 1);
			vertiLookFromPos = flightAltitudeObjective + (65 + (flightAltitudeObjective * Math.sin(2 * pi / (360 / flightAngle)))) ;
			if ( flightAngle > 60 ) {
				if ( horiLookFromPos > -100 ) {
					destiLookFromPos += 2;
					horiLookFromPos -= 3;
					horiLookAtPos += 1;
				}
			}
		}
		/* if ( vertiLookFromPos > flightAltitudeObjective) {
				takeoffState = false;
				if (moveState) {
					destiLookFromPos -= takeOffThrust * newsWeight;
					//takeOffThrust -= 0.001;
					//horiTurner += 0.01;
					//if (horiTurner < 1) {
					//	
					//}
				}
		}*/
		/*if (destiLookFromPos < -250 ) {
			//moveState = false;
			if (takeOffThrust < 1) {
				if (horiTurner < 1) {
					
				}
			}
		}*/
		//sustaView.lookAt(new THREE.Vector3(horiLookAtPos, vertiLookAtPos, destiLookAtPos));
		//sustaView.position.set(horiLookFromPos, vertiLookFromPos, destiLookFromPos);
			
		
		
		/*if (deltaTextAngle > 170) {
			if ( horiLookAtPos < 0) {
				horiLookAtPos += 1;
				controls.target.set( horiLookAtPos, vertiLookAtPos, destiLookAtPos );
			}
		}
		if (deltaTextAngle < 210) {
			
			for (textMeshIdx = 1; textMeshIdx < textMeshList.length; textMeshIdx++) {
				destiTextAngle = textAngle - (textAngle * textMeshIdx) + deltaTextAngle;
				textMeshGroup.getObjectByName('promo-line-' + textMeshIdx).position.z = maxTextDestiPosition * Math.cos(2 * pi / (360 / destiTextAngle));
				textMeshGroup.getObjectByName('promo-line-' + textMeshIdx).position.y = maxTextVeriTop * Math.sin(2 * pi / (360 / destiTextAngle));
			}
		}
		else {
			if (promoView) {
				console.log('Switching off text');
				for (textMeshIdx = 1; textMeshIdx < textMeshList.length; textMeshIdx++) {
					textMeshGroup.getObjectByName('promo-line-' + textMeshIdx).visible = false;
				}
				promoView = false;
			}
		}
			/*if (deltaTextAngle > 160) {
			if ( destiLookFromPos < 550) {
				destiLookAtPos += 1;
				destiLookFromPos += 1;
			}
			if ( horiLookAtPos < 0) {
				horiLookAtPos += 1;
			}
			if ( vertiLookAtPos > 65) {
				vertiLookAtPos -= 1;
			}
			controls.target.set( horiLookAtPos, vertiLookAtPos, destiLookAtPos );
			sustaView.position.set(horiLookFromPos, vertiLookFromPos, destiLookFromPos);
			
			if (destiLookFromPos > 444) {
				sustaWorld.rotation.y = THREE.Math.degToRad(sustaWorldVertiAngle);
				console.log('Keep turning');
				sustaWorldVertiAngle -= 0.2;
			}
				/*else {
					console.log('Getting closer');
					viewDistance = viewDistance - 50;
					//vertiLookAtPos = vertiLookAtPos - 5;
					sustaView.position.set(0, 350, viewDistance);
				}*/
			//}
			
			//sustaView.lookAt(new THREE.Vector3(horiLookAtPos, vertiLookAtPos, 0));
		//}
		/*else {
			console.log('Further zoom in');
			if (vertiLookAtPos > 65) {
				sustaView.position.set(0, 250, viewDistance);
			}
			sustaView.lookAt(new THREE.Vector3(horiLookAtPos, vertiLookAtPos, 0));
		}*/
		controls.update();
		//controls.target.set( horiLookAtPos, vertiLookAtPos, destiLookAtPos );
		//sustaView.position.set(horiLookFromPos, vertiLookFromPos, destiLookFromPos);
		
		//sustaView = setView(sustaView);
		
		oceanMesh.position.y = Math.sin( time * 0.5 ) * 10.0;
		weedBowl.position.y = 20 + Math.cos( (time * 0.5) -0.3 ) * 2.5;
		bowlWall.position.y = 19 + Math.sin( (time * 0.5) -0.3 ) * 1.3;
		sustaBowl.position.y = 23 + Math.cos( (time * 0.5) -0.5 ) * 2.5;
		water.material.uniforms.time.value += 1.0 / 60.0;
		weedWater.material.uniforms.time.value += 1.0 / 60.0;
		innerWater.material.uniforms.time.value += 1.0 / 60.0;

		water.render();
		weedWater.render();
		innerWater.render();
		sustaBuilder.render( sustaWorld, sustaView );

	}
	
	animate();
} );
