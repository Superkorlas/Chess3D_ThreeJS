class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();    
    this.renderer = this.createRenderer(myCanvas);   
    this.gui = this.createGUI ();        
    this.createLights ();
    this.createCamera ();
    this.lastTime = Date.now();
    this.tableboard = new Tableboard();
    this.add(this.tableboard);
    this.gameMode = new GameMode(this.tableboard, this.camera);
  }

  static pieceLoaded() {
    if (typeof MyScene.totalPieces == 'undefined') {
      MyScene.totalPieces = 32;
      MyScene.ready = false;
    }

    MyScene.totalPieces--;
    if (MyScene.totalPieces <= 0 && !MyScene.ready) {
      window.alert("Todo cargado. Puede empezar a jugar");
      MyScene.ready = true;
      this.lastTime = Date.now();
    }
  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	//this.camera = new THREE.OrthographicCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (0, 200, 200);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new dat.GUI();
    return gui;
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
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update() {
    var currentTime = Date.now();
    var deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    requestAnimationFrame(() => this.update())

    if(MyScene.ready) {
      this.tableboard.update(deltaTime);
      TWEEN.update();
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
