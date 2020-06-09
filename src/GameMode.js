class GameMode {
	constructor(tableboard, camera) {
		this.tableboard = tableboard;
		this.camera = camera;
		this.currentSelected = null;
		this.pickableObjects = new Array();
		this.currentTurn = teams.WHITE;
		this.gameState = GameState.SELECT_PIECE;
		this.currentValidMovements = new Array();
		var that = this;

		document.addEventListener("pieceMovementFinished",  (event) => this.rotateTableboard());
		document.addEventListener("tableboardRotationFinished", (event) => this.nextTurn());
		document.addEventListener("TransformPawn", (event) => this.onTransformPawn());
		window.addEventListener("mousedown", (event) => this.onMouseDown(event));
		document.getElementById("newMatchButton").onclick = function() { that.newMatch()};
		document.getElementById("queenOption").onclick = function() {that.onTransformOptionSelected("Queen");};
		document.getElementById("rookOption").onclick = function() {that.onTransformOptionSelected("Rook");};
		document.getElementById("knightOption").onclick = function() {that.onTransformOptionSelected("Knight");};
		document.getElementById("bishopOption").onclick = function() {that.onTransformOptionSelected("Bishop");};
	}
	
	newMatch() {
		if (this.gameState != GameState.ANIMATION_RUNNING) {
			this.tableboard.newMatch();
			if (this.currentTurn == teams.BLACK) {
				this.rotateTableboard();
			}
		}
	}

	onMouseDown(event) {
		if (MyScene.ready) {
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
		this.deleteInvalidForCheckMovements(this.currentSelected);
		this.markSections();
		this.setGameState(GameState.SELECT_MOVEMENT);
	}

	deleteInvalidForCheckMovements(piece) {
		//TODO: Delete check movements from this.currentValidMovements
		var validMovements = new Array();
		for (var i = 0; i < this.currentValidMovements.length; i++) {
			var section = this.currentValidMovements[i];
			if (section instanceof Piece) {
				section = section.currentSection;
			}
			section.onSimulate(piece);
			piece.currentSection.onSimulate();
			if (!this.isInCheck()) {
				validMovements.push(this.currentValidMovements[i]);
			}
			section.onSimulate();
			piece.currentSection.onSimulate();
		}
		this.currentValidMovements = validMovements;
	}

	movePiece(selectedObject) {
		this.currentSelected.move(selectedObject);
		this.currentSelected.unselect();
		this.setGameState(GameState.ANIMATION_RUNNING);
	}

	rotateTableboard() {
		this.setGameState(GameState.ANIMATION_RUNNING);
		this.tableboard.changePlayer();
	}

	destroyPiece(piece) {
		this.tableboard.destroyPiece(piece);
	}

	markSections() {
		for(var i = 0; i < this.currentValidMovements.length; i++) {
			if (this.currentValidMovements[i] instanceof Piece) {
				this.currentValidMovements[i].select(true);
			} else {
				this.currentValidMovements[i].select();
			}
		}
	}

	unmarkSections() {
		for(var i = 0; i < this.currentValidMovements.length; i++) {
			if (this.currentValidMovements[i].currentPiece != null) {
				this.currentValidMovements[i].currentPiece.unselect(true);
			} else {
				this.currentValidMovements[i].unselect();
			}
		}
	}

	nextTurn() {
		var currentKing;
		if (this.currentTurn == teams.WHITE) {
			this.currentTurn = teams.BLACK;
			currentKing = this.tableboard.blackKing;
			this.tableboard.whiteKing.uncheck();
		} else {
			this.currentTurn = teams.WHITE;
			currentKing = this.tableboard.whiteKing;
			this.tableboard.blackKing.uncheck();
		}
		this.setGameState(GameState.SELECT_PIECE);

		if (this.isInCheck()) {
			if (!this.isCheckMate()) {
				alert("Check!");
				MyScene.addToMessage("Be careful! Your king is threatened!");
			} else {
				this.setGameState(GameState.CHECK_MATE);
				alert("Checkmate!! You loose");
			}
			currentKing.check();
		}
	}

	isInCheck() {
		var pieces = new Array();
		var king = null;
		if (this.currentTurn == teams.WHITE) {
			pieces = this.tableboard.blackTeam;
			king = this.tableboard.whiteKing;
		} else {
			pieces = this.tableboard.whiteTeam;
			king = this.tableboard.blackKing;
		}

		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i].currentSection.getCurrentPiece(); //To control when simulating
			if (piece) {
				var threatened = piece.getValidMovements(this.tableboard);
				for (var j = 0; j < threatened.length; j++) {
					if (threatened[j] == king) {
						console.log("check");
						return true;
					} 
				}
			}
		}
		return false;
	}

  	isCheckMate() {
		var team;
		if (this.currentTurn == teams.WHITE) {
			team = this.tableboard.whiteTeam;
		} else {
			team = this.tableboard.blackTeam;
		}

		for (var i = 0; i < team.length; i++) {
			this.currentValidMovements = new Array();
			this.currentValidMovements = team[i].getValidMovements(this.tableboard);
			this.deleteInvalidForCheckMovements(team[i]);
			if (this.currentValidMovements.length > 0) {
				return false;
			}
		}

		return true;
	}

	setGameState(newState) {
		this.gameState = newState;

		switch(this.gameState) {
			case GameState.SELECT_PIECE: 
				this.sendMessage("select a piece to move");
				break;
			case GameState.SELECT_MOVEMENT: 
				this.sendMessage("select the movement");
				break;
			case GameState.ANIMATION_RUNNING: 
				this.sendMessage("");
				break;
			case GameState.CHECK_MATE:
				this.sendMessage("You loose!");
				//TODO: button to other match??
				break;
			case GameState.TRANSFORMING_PAWN:
				break;
		}
	}

	onTransformPawn() {
		this.setGameState(GameState.TRANSFORMING_PAWN);
		document.getElementById("transformPawn").style.display = "block";
	}

	onTransformOptionSelected(name) {
		document.getElementById("transformPawn").style.display = "none";
		this.tableboard.transformPawn(this.currentSelected, name);
		this.rotateTableboard();
	}

	sendMessage(text) {
		var introMessage = "";
		if(this.currentTurn == teams.WHITE) {
			introMessage = "White team";
		} else {
			introMessage = "Black team";
		}
		MyScene.setMessage(introMessage + " " + text);
	}
}