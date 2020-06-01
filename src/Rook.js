class Rook extends Piece {
    constructor(team, initialSection, octree = null) {
        super("Rook", team, initialSection, octree);
    }

    getValidMovements(tableboard) {
        var validMovements = new Array();
        validMovements = validMovements.concat(this.getNorthMovement(tableboard,8));
        validMovements = validMovements.concat(this.getSouthMovement(tableboard,8));
        validMovements = validMovements.concat(this.getWestMovement(tableboard,8));
        validMovements = validMovements.concat(this.getEastMovement(tableboard,8));
        return validMovements;
    }
}