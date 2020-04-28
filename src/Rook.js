class Rook extends Piece {
    constructor(team, initialSection) {
        super("Rook", team, initialSection);
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