class Rook extends Piece {
    constructor(team, initialSection) {
        super("Rook", team, initialSection);
    }

    getValidMovements(tableboard) {
        var validMovements = new Array();
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;

        return validMovements;
    }
}