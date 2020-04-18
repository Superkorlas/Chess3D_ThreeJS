class Queen extends Piece {
    constructor(team, initialSection) {
        super("Queen", team, initialSection);
    }

    getValidMovements(tableboard) {
        var validMovements = new Array();
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;

        return validMovements;
    }
}