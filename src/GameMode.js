class GameMode {
    constructor(tableboard, camera) {
        this.tableboard = tableboard;
        this.camera = camera;
        this.currentSelected = null;
        this.pickableObject = new Array();
        window.addEventListener("mousedown", (event) => this.onMouseDown(event));
    }
    

  onMouseDown(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    
    this.updatePickableObject();
    var pickedObjects = raycaster.intersectObjects (this.pickableObject, true);
    
    if (pickedObjects.length > 0) {
      var selectedObject = pickedObjects[0].object;
      if (this.currentSelected)
        this.currentSelected.unselect();
      this.currentSelected = selectedObject.userData;
      selectedObject.userData.onClick();
    }
  }

  updatePickableObject() {
    this.pickableObject = this.pickableObject.concat(this.tableboard.whiteTeam);
    this.pickableObject = this.pickableObject.concat(this.tableboard.blackTeam);
    for(var i = 0; i < this.tableboard.boardSize; i++) {
      this.pickableObject = this.pickableObject.concat(this.tableboard.sections[i]);
    }
  }
}