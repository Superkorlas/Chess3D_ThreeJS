class GameMode {
  constructor(tableboard, camera) {
      this.tableboard = tableboard;
      this.camera = camera;
      this.currentSelected = null;
      this.pickableObjects = new Array();
      this.currentTurn = teams.WHITE;
      this.gameState = GameState.SELECT_PIECE;
      this.isHelpActive = true;
      this.currentValidMovements = new Array();

      document.addEventListener("pieceMovementFinished",  (event) => this.rotateTableboard());
      document.addEventListener("tableboardRotationFinished", (event) => this.nextTurn());
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
      this.pickableObjects = this.pickableObjects.concat(this.currentValidMovements);
      if (this.currentTurn == teams.WHITE) {
        this.pickableObjects = this.pickableObjects.concat(this.tableboard.whiteTeam);
      } else {
        this.pickableObjects = this.pickableObjects.concat(this.tableboard.blackTeam);
      }
    }
  }

  executeTurnAction(selectedObject) {
    this.unmarkSections();
    this.currentValidMovements = new Array();

    if (this.currentSelected)
      this.currentSelected.unselect();

    if (this.gameState == GameState.SELECT_PIECE) {
      this.selectPiece(selectedObject);
      
    } else if (this.gameState == GameState.SELECT_MOVEMENT) {
      if (selectedObject instanceof Piece) {
        if (selectedObject.team == this.currentTurn) {
          this.selectPiece(selectedObject);
        } else {
          this.movePiece(selectedObject.currentSection); 
          this.destroyPiece(selectedObject);
        }

      } else if (selectedObject instanceof Section) {
        this.movePiece(selectedObject);
      }
    }
  }
  
  selectPiece(selectedObject) {
    this.currentSelected = selectedObject;
    selectedObject.onClick();
    this.currentValidMovements = this.currentSelected.getValidMovements(this.tableboard);
    this.deleteCheckMovements();
    this.markSections();
    this.gameState = GameState.SELECT_MOVEMENT;
  }

  deleteCheckMovements() {
      //TODO: Delete check movements from this.currentValidMovements
      //simulate a tableboard??
  }

  movePiece(selectedObject) {
    this.currentSelected.move(selectedObject);
    this.currentSelected.unselect();
    this.gameState = GameState.ANIMATION_RUNNING;
  }

  rotateTableboard() {
    this.tableboard.changePlayer();
  }

  destroyPiece(piece) {
    this.tableboard.destroyPiece(piece);
  }

  markSections() {
    if (this.isHelpActive) {
      for(var i = 0; i < this.currentValidMovements.length; i++) {
        if (this.currentValidMovements[i] instanceof Piece) {
          this.currentValidMovements[i].select(true);
        } else {
          this.currentValidMovements[i].select();
        }
      }
    }
  }

  unmarkSections() {
    if (this.isHelpActive) {
      for(var i = 0; i < this.currentValidMovements.length; i++) {
        if (this.currentValidMovements[i].currentPiece != null) {
          this.currentValidMovements[i].currentPiece.unselect(true);
        } else {
          this.currentValidMovements[i].unselect();
        }
      }
    }
  }

  nextTurn() {
    if (this.currentTurn == teams.WHITE) {
      this.currentTurn = teams.BLACK;
    } else {
      this.currentTurn = teams.WHITE;
    }
    this.gameState = GameState.SELECT_PIECE;

    if (this.isInCheck(this.tableboard)) {
        if (!this.isCheckMate()) {
            alert("Check!");
        } else {
            alert("Checkmate!!");
            //TODO: End game.
        }
    }
  }

  isInCheck(tableboard) {
    var pieces = new Array();
    var king = null;
    if (this.currentTurn == teams.WHITE) {
        pieces = tableboard.blackTeam;
        king = tableboard.whiteKing;
    } else {
        pieces = tableboard.whiteTeam;
        king = tableboard.blackKing;
    }

    for (var i = 0; i < pieces.length; i++) {
        var threatened = pieces[i].getValidMovements(tableboard);
        for (var j = 0; j < threatened.length; j++) {
            if (threatened[j] == king) {
                console.log("check");
                return true;
            } 
        }
    }

    return false;
  }

  isCheckMate() {
      //TODO: implementation
      return false;
  }
}