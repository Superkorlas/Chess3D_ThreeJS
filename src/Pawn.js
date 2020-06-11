class Pawn extends Piece {
    constructor(team, initialSection) {
        super("Pawn", team, initialSection);

        this.transformationLocation;
        if (this.team == teams.WHITE) {
            this.transformationLocation = 7;
        } else {
            this.transformationLocation = 0;
        }
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

        var sectionPiece;
        nextSection = tableboard.getSection(x + 1 * direction, z + 1 * direction);
        if (this.canAttackSection(nextSection)) {
            validMovements.push(nextSection.getCurrentPiece());
        }

        nextSection = tableboard.getSection(x - 1 * direction, z + 1 * direction);
        if (this.canAttackSection(nextSection)) {
            validMovements.push(nextSection.getCurrentPiece());
        }

        return validMovements;
    }

    checkSection(section) {
        var object = null;
        if (section) {
            if (section.getCurrentPiece() == null) {
                object = section;
            }
        }
        return object;
    }

    canAttackSection(section) {
        if (section) {
            var sectionPiece = section.getCurrentPiece();
            if (sectionPiece != null) {
                if (this.team != sectionPiece.team) {
                    return true;
                }
            }
        }
        return false;
    }

    onMovementComplete() {
        if (this.currentSection.posZ == this.transformationLocation) {
			document.dispatchEvent(new Event("TransformPawn"));
        } else {
			super.onMovementComplete();
		}
    }
}