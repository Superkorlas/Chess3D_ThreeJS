class Queen extends Piece {
    constructor(team, initialSection, octree = null) {
        super("Queen", team, initialSection, octree);
    }

    getValidMovements(tableboard) {
        var validMovements = new Array();
        validMovements = validMovements.concat(this.getNorthMovement(tableboard,8));
        validMovements = validMovements.concat(this.getSouthMovement(tableboard,8));
        validMovements = validMovements.concat(this.getWestMovement(tableboard,8));
        validMovements = validMovements.concat(this.getEastMovement(tableboard,8));
        validMovements = validMovements.concat(this.getNorthWestMovement(tableboard,8));
        validMovements = validMovements.concat(this.getNorthEastMovement(tableboard,8));
        validMovements = validMovements.concat(this.getSouthWestMovement(tableboard,8));
        validMovements = validMovements.concat(this.getSouthEastMovement(tableboard,8));
        return validMovements;
    }
}