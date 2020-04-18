class GameMode {
    constructor(tableboard, camera) {
        this.tableboard = tableboard;
        this.camera = camera;
        this.currentSelected = null;
        this.pickableObjects = new Array();
        this.currentTurn = teams.WHITE;
        this.gameState = GameState.SELECT_PIECE;
        window.addEventListener("mousedown", (event) => this.onMouseDown(event));
    }
    

  onMouseDown(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    
    this.updatePickableObject();
    var pickedObjects = raycaster.intersectObjects (this.pickableObjects, true);
    
    if (pickedObjects.length > 0) {
      var selectedObject = pickedObjects[0].object;
      this.executeTurnAction(selectedObject.userData);
    }
  }

  updatePickableObject() {
    this.pickableObjects = [];
    if (this.gameState == GameState.SELECT_PIECE) {
      if (this.currentTurn == teams.WHITE) {
        this.pickableObjects = this.pickableObjects.concat(this.tableboard.whiteTeam);
      } else {
        this.pickableObjects = this.pickableObjects.concat(this.tableboard.blackTeam);
      }
    } else if (this.gameState == GameState.SELECT_MOVEMENT) {
      if (this.currentTurn == teams.WHITE) {
        this.pickableObjects = this.pickableObjects.concat(this.tableboard.blackTeam);
      } else {
        this.pickableObjects = this.pickableObjects.concat(this.tableboard.whiteTeam);
      }
      for(var i = 0; i < this.tableboard.boardSize; i++) {
        this.pickableObjects = this.pickableObjects.concat(this.tableboard.sections[i]);
      }
    }
  }

  executeTurnAction(selectedObject) {
    if (this.gameState == GameState.SELECT_PIECE) {
      this.currentSelected = selectedObject;
      selectedObject.onClick();
      //@TODO: Mark valid sections to move
      this.gameState = GameState.SELECT_MOVEMENT;
    } else if (this.gameState == GameState.SELECT_MOVEMENT) {
      if (selectedObject instanceof Piece) {


        //@TODO: remove sections marked
        this.currentSelected.unselect();
        this.nextTurn();
      } else if (selectedObject instanceof Section) {
        //@TODO: Check if valid movement
        this.currentSelected.move(selectedObject);

        //@TODO: remove sections marked
        this.currentSelected.unselect();
        this.nextTurn();
      }
    }
  }

  nextTurn() {
    if (this.currentTurn == teams.WHITE) {
      this.currentTurn = teams.BLACK;
    } else {
      this.currentTurn = teams.WHITE;
    }

    //@TODO: tableboard animation

    this.gameState = GameState.SELECT_PIECE;
  }
}