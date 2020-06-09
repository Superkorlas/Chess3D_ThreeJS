class King extends Piece {
    constructor(team, initialSection) {
		super("King", team, initialSection);
		this.isThreatened = false;
		this.isCastlingRight = false;
		this.isCastlingLeft = false;
		this.castlingLargeRookPosition = {posX: 7, posZ: initialSection.posZ};
		this.castlingShortRookPosition = {posX: 0, posZ: initialSection.posZ};
		this.rookLarge;
		this.rookShort;
    }
    
    getValidMovements(tableboard) {
        var validMovements = new Array();
        validMovements = validMovements.concat(this.getNorthMovement(tableboard,1));
        validMovements = validMovements.concat(this.getSouthMovement(tableboard,1));
        validMovements = validMovements.concat(this.getWestMovement(tableboard,1));
        validMovements = validMovements.concat(this.getEastMovement(tableboard,1));
        validMovements = validMovements.concat(this.getNorthWestMovement(tableboard,1));
        validMovements = validMovements.concat(this.getNorthEastMovement(tableboard,1));
        validMovements = validMovements.concat(this.getSouthWestMovement(tableboard,1));
		validMovements = validMovements.concat(this.getSouthEastMovement(tableboard,1));
		return validMovements;
	}

	canCastlingLarge(tableboard) {
		if (this.canCastling()) {
			var rookSection = tableboard.getSection(this.castlingLargeRookPosition.posX,this.castlingLargeRookPosition.posZ);
			if(rookSection.currentPiece instanceof Rook) {
				var rook = rookSection.currentPiece;
				this.rookLarge = rook;
				if (!rook.isMoved) {
					for (var i = this.currentSection.posX+1; i < rook.currentSection.posX; i++) {
						var section = tableboard.getSection(i, this.currentSection.posZ);
						if (section.currentPiece == null) {
							if(section.posX <= this.currentSection.posX+2) {
								section.onSimulate(this);
								this.currentSection.onSimulate();
								if (tableboard.isInCheck(this.team)) {
									section.onSimulate();
									this.currentSection.onSimulate();
									return false;
								}
								section.onSimulate();
								this.currentSection.onSimulate();
							}
						} else {
							return false;
						}
					}
					return true;
				}
			}
		}
		return false;
	}

	canCastlingShort(tableboard) {
		if (this.canCastling()) {
			var rookSection = tableboard.getSection(this.castlingShortRookPosition.posX,this.castlingShortRookPosition.posZ);
			if(rookSection.currentPiece instanceof Rook) {
				var rook = rookSection.currentPiece;
				this.rookShort = rook;
				if (!rook.isMoved) {
					for (var i = this.currentSection.posX-1; i > rook.currentSection.posX; i--) {
						var section = tableboard.getSection(i, this.currentSection.posZ);
						if (section.currentPiece == null) {
							if(section.posX >= this.currentSection.posX-2) {
								section.onSimulate(this);
								this.currentSection.onSimulate();
								if (tableboard.isInCheck(this.team)) {
									section.onSimulate();
									this.currentSection.onSimulate();
									return false;
								}
								section.onSimulate();
								this.currentSection.onSimulate();
							}
						} else {
							return false;
						}
					}
					return true;
				}
			}
		}
		return false;
	}

	canCastling() {
		return(!this.isThreatened && !this.isMoved);
	}

	move(section) {
		if(!this.isMoved) {
			if (section.posX == this.currentSection.posX+2){
				this.isCastlingRight = true;
			} else if (section.posX == this.currentSection.posX-2) {
				this.isCastlingLeft = true;
			}
		} 
		super.move(section);
	}

	onMovementComplete() {
		if (this.isCastlingRight) {
			this.isCastlingRight = false;
			this.rookLarge.move(this.parent.parent.getSection(this.currentSection.posX-1, this.currentSection.posZ))
		} else if ( this.isCastlingLeft) {
			this.isCastlingRight = false;
			this.rookShort.move(this.parent.parent.getSection(this.currentSection.posX+1, this.currentSection.posZ));
		} else {
			super.onMovementComplete();
		}
	}

	unselect() {
		if (this.isThreatened)
			this.mesh.material = this.threatenMaterial;
		else 
			this.mesh.material = this.material;

        this.isSelected = false;
	}
	
	check() {
		this.isThreatened = true;
		this.select(true);
	}

	uncheck() {
		this.isThreatened = false;
		this.unselect();
	}
}