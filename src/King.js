class King extends Piece {
    constructor(team, initialSection) {
		super("King", team, initialSection);
		this.isThreatened = false;
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