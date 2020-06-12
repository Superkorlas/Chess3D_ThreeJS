class MyScene extends THREE.Scene {
	constructor (myCanvas) {
		super();   
		MyScene.setMessage("Loading: 0%"); 
		this.renderer = this.createRenderer(myCanvas);   
		this.createLights ();
		this.createCamera ();
		this.tableboard = new Tableboard();
		this.add(this.tableboard);
		this.gameMode = new GameMode(this.tableboard, this.camera);
		this.started = false;
		loadModels();
	}

	static pieceLoaded() {
		if (typeof MyScene.totalPieces == 'undefined') {
			MyScene.totalPieces = 6;
			MyScene.piecesLoaded = 0;
			MyScene.ready = false;
		}

		MyScene.piecesLoaded++;
		
		var loadedPercent = (MyScene.piecesLoaded / MyScene.totalPieces) * 100;
		MyScene.setMessage("Loading: " + loadedPercent + "%");

		if (MyScene.piecesLoaded >= MyScene.totalPieces && !MyScene.ready) {
			MyScene.ready = true;
			
		}
	}

	static setMessage(text) {
		document.getElementById("messages").innerHTML = text;
	}

	static addToMessage(text) {
		var messageContainer = document.getElementById("messages");
		var paragraph = document.createElement("p");
		paragraph.innerHTML = text;
		messageContainer.append(paragraph);
	}
  
  createCamera () {
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (0, 200, 200);
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
  }

  createLights () {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (ambientLight);
    
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
    this.spotLight.position.set( 0, 100, 130 );
	this.add (this.spotLight);
	
	this.spotLight2 = new THREE.SpotLight( 0xffffff, 0.5 );
	this.spotLight2.position.set( 0, 100, -130 );
	this.add(this.spotLight2);
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight); 
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update() {
    requestAnimationFrame(() => this.update())

    if(MyScene.ready) {
		TWEEN.update();
		if (!this.started) {
			document.dispatchEvent(new Event("Play"));
			this.started = true;
			this.gameMode.setGameState(GameState.SELECT_PIECE);
		}
    }
    
    this.renderer.render (this, this.getCamera());
  }

}

/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
