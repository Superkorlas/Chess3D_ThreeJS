class Bishop extends Piece {
    constructor(team, initialSection) {
        super("Bishop", team, initialSection);
    }

    getValidMovements(tableboard) {
        var validMovements = new Array();
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexX = 0;
        var indexZ = 0;
        var checkNorthwest = true;
        var checkNortheast = true;
        var checkSouthwest = true;
        var checkSoutheast = true;

        while (checkNorthwest || checkNortheast || checkSouthwest || checkSoutheast) {
            indexX++;
            indexZ++;
            if (checkNorthwest) {
                var nextSection = tableboard.getSection(x-indexX, z+indexZ);
                var movementObject = this.checkSection(nextSection);
                if (movementObject) {
                    validMovements.push(movementObject);
                    if (movementObject instanceof Piece){
                        checkNorthwest = false;
                    }
                } else {
                    checkNorthwest = false;
                }
            }

            if (checkNortheast) {
                var nextSection = tableboard.getSection(x+indexX, z+indexZ);
                var movementObject = this.checkSection(nextSection);
                if (movementObject) {
                    validMovements.push(movementObject);
                    if (movementObject instanceof Piece){
                        checkNortheast = false;
                    }
                } else {
                    checkNortheast = false;
                }
            }

            if (checkSouthwest) {
                var nextSection = tableboard.getSection(x-indexX, z-indexZ);
                var movementObject = this.checkSection(nextSection);
                if (movementObject) {
                    validMovements.push(movementObject);
                    if (movementObject instanceof Piece){
                        checkSouthwest = false;
                    }
                } else {
                    checkSouthwest = false;
                }
            }

            if (checkSoutheast) {
                var nextSection = tableboard.getSection(x+indexX, z-indexZ);
                var movementObject = this.checkSection(nextSection);
                if (movementObject) {
                    validMovements.push(movementObject);
                    if (movementObject instanceof Piece){
                        checkSoutheast = false;
                    }
                } else {
                    checkSoutheast = false;
                }
            }
        }

        return validMovements;
    }

}