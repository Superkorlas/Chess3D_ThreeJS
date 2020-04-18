class King extends Piece {
    constructor(team, initialSection) {
        super("King", team, initialSection);
    }
    
    getValidMovements(tableboard) {
        var validMovements = new Array();
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;

        return validMovements;
    }
}