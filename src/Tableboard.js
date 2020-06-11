const whiteSectionColor = 0xF4F4F4;
const blackSectionColor = 0x804000;

class Tableboard extends THREE.Object3D {
    constructor() {
        super();
        this.rotateSpeed = 60;
        this.boardSize = 8;
        this.sections = [];
        this.whiteTeam = new Array();
        this.blackTeam = new Array();
        this.board = new THREE.Object3D();
        this.event = new Event("tableboardRotationFinished");
        this.whiteKing;
        this.blackKing;

        this.createBoard();
        document.addEventListener("Play", (event) => this.addPieces());
        this.board.position.x = -(this.boardSize / 2 * this.sections[0][0].size - this.sections[0][0].size / 2);
        this.board.position.z = this.boardSize / 2 * this.sections[0][0].size - this.sections[0][0].size / 2;
        
		this.add(this.board);
		
		var geometry = new THREE.TorusGeometry( 151, 10, 4, 4 );
		geometry.rotateX(90*Math.PI / 180);
		geometry.rotateY(45*Math.PI / 180);
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: new THREE.TextureLoader().load("../assets/textures/white_section.jpg") } );
		var border = new THREE.Mesh( geometry, material );
		this.add( border );
    }

    createBoard() {
        var color = blackSectionColor;
        for (var i = 0; i < this.boardSize; i++) {
            if (color === whiteSectionColor) {
                color = blackSectionColor;
            } else {
                color = whiteSectionColor;
            }
            this.sections[i] = new Array(this.boardSize);
            for (var j = 0; j < this.boardSize; j++) {
                this.sections[i][j] = new Section(color, i, j);
                this.board.add(this.sections[i][j]);
                if (color === whiteSectionColor) {
                    color = blackSectionColor;
                } else {
                    color = whiteSectionColor;
                }
            }
        }
    }

    addPieces() {
		this.whiteTeam = new Array();
		this.blackTeam = new Array();

        this.whiteKing = new King(teams.WHITE, this.sections[3][0]);
		this.blackKing = new King(teams.BLACK, this.sections[3][7]);
		this.whiteTeam.push(this.whiteKing);  
		this.blackTeam.push(this.blackKing);
		
        this.whiteTeam.push(new Rook(teams.WHITE, this.sections[0][0]));  
        this.blackTeam.push(new Rook(teams.BLACK, this.sections[0][7]));  
        this.whiteTeam.push(new Knight(teams.WHITE, this.sections[1][0]));
        this.blackTeam.push(new Knight(teams.BLACK, this.sections[1][7]));
        this.whiteTeam.push(new Bishop(teams.WHITE, this.sections[2][0]));
        this.blackTeam.push(new Bishop(teams.BLACK, this.sections[2][7])); 
        this.whiteTeam.push(new Queen(teams.WHITE, this.sections[4][0])); 
        this.blackTeam.push(new Queen(teams.BLACK, this.sections[4][7]));
        this.whiteTeam.push(new Bishop(teams.WHITE, this.sections[5][0]));
        this.blackTeam.push(new Bishop(teams.BLACK, this.sections[5][7]));
        this.whiteTeam.push(new Knight(teams.WHITE, this.sections[6][0]));
        this.blackTeam.push(new Knight(teams.BLACK, this.sections[6][7]));
        this.whiteTeam.push(new Rook(teams.WHITE, this.sections[7][0]));  
		this.blackTeam.push(new Rook(teams.BLACK, this.sections[7][7]));  

        for (var i = 0; i < this.boardSize; i++) {
            this.whiteTeam.push(new Pawn(teams.WHITE, this.sections[i][1], this.octree));
            this.blackTeam.push(new Pawn(teams.BLACK, this.sections[i][6], this.octree));
        }

        for (var i = 0; i < this.whiteTeam.length; i++) {
            this.board.add(this.whiteTeam[i]);
            this.board.add(this.blackTeam[i]);
        }
    }
    
    getSection(posX, posZ) {
        if (posX < this.boardSize && posZ < this.boardSize
            && posX >= 0 && posZ >= 0) {
            return this.sections[posX][posZ];
        }
        return null;
    }

    selectSection(posX, posZ) {
        if (posX < this.boardSize && posZ < this.boardSize
            && posX >= 0 && posZ >= 0) {
            this.sections[posX][posZ].onClick();
        }
    }

    transformPawn(pawn, newType = "Queen") {
        var section = pawn.currentSection;
        var team = pawn.team;
        var newPiece;

		if (pawn instanceof Pawn) {
			this.destroyPiece(pawn);
			
			if (newType == "Queen") {
				newPiece = new Queen(team, section);
			} else if (newType == "Rook") {
				newPiece = new Rook(team, section);
			} else if (newType == "Knight") {
				newPiece = new Knight(team, section);
			} else if (newType == "Bishop") {
				newPiece = new Bishop(team, section);
			}

			if (team == teams.WHITE) {
				this.whiteTeam.push(newPiece);
			} else {
				this.blackTeam.push(newPiece);
			}
			this.board.add(newPiece);
		}
    }

    destroyPiece(piece) {
        if (piece) {
			piece.destroy();
            if (piece.team == teams.WHITE) {
                for (var i = 0; i < this.whiteTeam.length; i++) {
                    if (this.whiteTeam[i] == piece) {
                        this.whiteTeam.splice(i,1);
                    }
                }
            } else {
                for (var i = 0; i < this.blackTeam.length; i++) {
                    if (this.blackTeam[i] == piece) {
                        this.blackTeam.splice(i,1);
                    }
                }
            }
        }
    }

    changePlayer() {
		var that = this;
		var current;
		var newRot;
		if(this.rotation.y == 0) {
			current = 0;
			newRot = Math.PI;
		} else {
			current = Math.PI;
			newRot = 0;
		}
        var currentRot = { rotY : current };
        var target = { rotY : newRot };
        var moveAnim = new TWEEN.Tween(currentRot).to(target, 1000);
        moveAnim.easing(TWEEN.Easing.Quadratic.InOut);
        moveAnim.onUpdate(function() { 
            that.rotation.y = currentRot.rotY;
        });
        moveAnim.onComplete(function() { 
            document.dispatchEvent(that.event);
        });

        moveAnim.start();
    }
	
	newMatch() {
		this.whiteTeam.forEach(piece => {
			piece.destroy();
		});
		this.whiteTeam = new Array();

		this.blackTeam.forEach(piece => {
			piece.destroy();
		});
		this.blackTeam = new Array();

		for(var i = 0; i < this.sections.length; i++) {
			for(var j = 0; j < this.sections[i].length; j++) {
				this.sections[i][j].reset();
			}
		}

		this.addPieces();
	}

	isInCheck(teamTurn) {
		var pieces = new Array();
		var king = null;
		if (teamTurn == teams.WHITE) {
			pieces = this.blackTeam;
			king = this.whiteKing;
		} else {
			pieces = this.whiteTeam;
			king = this.blackKing;
		}

		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i].currentSection.getCurrentPiece();
			if (piece) {
				var threatened = piece.getValidMovements(this);
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
}