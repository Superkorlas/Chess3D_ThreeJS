class Pawn extends Piece {
    constructor(team, initialSection, octree = null) {
        super("Pawn", team, initialSection, octree);
    }

    getValidMovements(tableboard) {
        var validMovements = new Array();
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var direction = 1;
        if (this.team == teams.BLACK)
            direction = -1;

        var nextSection = tableboard.getSection(x, z + 1 * direction);
        var movementObject = this.checkSection(nextSection);
        if (movementObject) {
            validMovements.push(movementObject);
            if (!this.isMoved) {
                nextSection = tableboard.getSection(x, z + 2 * direction);
                movementObject = this.checkSection(nextSection);
                if (movementObject) {
                    validMovements.push(movementObject);
                }
            }
        }

        nextSection = tableboard.getSection(x + 1 * direction, z + 1 * direction);
        if (nextSection) {
            if (nextSection.currentPiece != null) {
                if (this.team != nextSection.currentPiece.team) {
                    validMovements.push(nextSection.currentPiece);
                }
            }
        }

        nextSection = tableboard.getSection(x - 1 * direction, z + 1 * direction);
        if (nextSection) {
            if (nextSection.currentPiece != null) {
                if (this.team != nextSection.currentPiece.team) {
                    validMovements.push(nextSection.currentPiece);
                }
            }
        }

        return validMovements;
    }

    checkSection(section) {
        var object = null;
        if (section) {
            if (section.currentPiece == null) {
                object = section;
            }
        }
        return object;
    }
}