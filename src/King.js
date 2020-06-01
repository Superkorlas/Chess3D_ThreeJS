class King extends Piece {
    constructor(team, initialSection, octree = null) {
        super("King", team, initialSection, octree);
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
}