THREE.UCSCharacter = function() {

	var scope = this;
	
	var mesh;
	var bodyd = [];
	bodyd[0] =  '';
	bodyd [1]  =  'The muscular system is the organ system consisting of skeletal, smooth and cardiac muscles. It allows body movement, maintains posture, and circulates blood throughout the body. The muscular system in vertebrates is controlled via the nervous system, although some muscles (such as cardiac muscle) can be completely autonomous. Together with the skeletal system it forms the musculoskeletal system, which is responsible for the movement of the human body.' ;
	bodyd [2]  =  'The human skeleton is the internal skeleton of the body. It consists of 270 bones at birth - this number reduces to 206 bones in adulthood once some of the bones fuse together. [1] Bone mass in the skeleton reaches its maximum density around the age of 30. The human skeleton can be divided into the axial skeleton and the appendicular skeleton. The axial skeleton is formed by the vertebral column, ribs and skull. The appendicular skeleton, which is attached to the axial skeleton, is formed by the thoracic girdle, pelvic girdle and bones of the upper and lower limbs. ' ;
	bodyd[3] = "The nervous system is the part of the animal's body that coordinates voluntary and involuntary actions and transmits signals between different parts of its body. Neural networks first appeared in worm-like organisms around 550 to 600 million years ago. In most animal species it consists of two main parts, the central nervous system (CNS) and the peripheral nervous system (PNS). The SNS contains the brain and spinal cord. The NSP consists mainly of nerves, which are bound by long bundles of fibers or axons, which connect the CNS to every other part of the body. The PNS includes motor neurons, mediating voluntary movements, the autonomic nervous system, which consists of the sympathetic nervous system and the parasympathetic nervous system, which regulate voluntary functions, and the enteric nervous system. nervous system, which controls the digestive system.";
	

	this.scale = 1;
	this.infodis = 0;
	this.root = new THREE.Object3D();
	
	this.numSkins;
	this.numMorphs;
	
	this.skins = [];
	this.materials = [];
	this.morphs = [];

	this.onLoadComplete = function () {};
	
	this.loadCounter = 0;

	this.loadParts = function ( config ) {
		
		this.numSkins = config.skins.length;
		
		// Character geometry + number of skins
		this.loadCounter = 1 + config.skins.length;
		
		// SKINS
		//alert('Welcome to Human Body Anatomy');
		console.log('UCSCharacter loadParts');
		
		//Method tampilan Skin yang disimpan di fileJSON
		this.skins = loadTextures( config.baseUrl + "skins/", config.skins );
		this.materials = createMaterials( this.skins );
		
		
		// CHARACTER
		var loader = new THREE.JSONLoader();
		console.log( config.baseUrl + config.character );
		loader.load( config.baseUrl + config.character, function( geometry ) {
			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			// THREE.AnimationHandler.add( geometry.animation );

			mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial() );
			scope.root.add( mesh );
			
			var bb = geometry.boundingBox;
			scope.root.scale.set( config.s, config.s, config.s );
			scope.root.position.set( config.x, config.y - bb.min.y * config.s, config.z );

			mesh.castShadow = true;
			mesh.receiveShadow = true;

			animation = new THREE.Animation( mesh, geometry.animation );
			animation.play();
			
			scope.setSkin(0);
			
			scope.checkLoadComplete();
		} );

	};
	
	//Kondisi untuk menampilkan Info Skin
	this.setSkin = function( index ) {
		if(!this.infodis){
			this.infodis = 1;
		}else{
			$("#info").html(bodyd[index]);
		}
		console.log('UCSCharacter setSkin' + index );
		
		if ( mesh && scope.materials ) {
			mesh.material = scope.materials[ index ];
		}
	};
	
	//Tampilan Skin yang disimpan di fileJSON
	function loadTextures( baseUrl, textureUrls ) {
		console.log('loadTextures UCSCharacter');
		var mapping = THREE.UVMapping;
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {
			textures[ i ] = THREE.ImageUtils.loadTexture( baseUrl + textureUrls[ i ], mapping, scope.checkLoadComplete );

			//Set nama di gui folder Skin
			var name = textureUrls[ i ];
			name = name.replace(/\.jpg/g, "");
			textures[ i ].name = name;
			console.log(textures[ i ].name );
		}
		return textures;
	};

	function createMaterials( skins ) {
		var materials = [];
		console.log('createMaterials UCSCharacter');
		for ( var i = 0; i < skins.length; i ++ ) {
			materials[ i ] = new THREE.MeshLambertMaterial( {
				color: 0xeeeeee,
				specular: 10.0,
				map: skins[ i ],
				skinning: true,
				morphTargets: true,
				wrapAround: true
			} );
		}
		return materials;
	}

	this.checkLoadComplete = function () {
		console.log('checkLoadComplete');
		scope.loadCounter -= 1;
		if ( scope.loadCounter === 0 ) {
			scope.onLoadComplete();
		}
	}
}
