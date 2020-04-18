class Knight extends Piece {
    constructor(team, initialSection) {
        super("Knight", team, initialSection);
    }

    getValidMovements(tableboard) {
        var validMovements = new Array();
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var posibleMovements = new Array();
        posibleMovements.push(new THREE.Vector2(x+1,z+2));
        posibleMovements.push(new THREE.Vector2(x+1,z-2));
        posibleMovements.push(new THREE.Vector2(x-1,z+2));
        posibleMovements.push(new THREE.Vector2(x-1,z-2));
        posibleMovements.push(new THREE.Vector2(x+2,z+1));
        posibleMovements.push(new THREE.Vector2(x+2,z-1));
        posibleMovements.push(new THREE.Vector2(x-2,z+1));
        posibleMovements.push(new THREE.Vector2(x-2,z-1));

        for (var i = 0; i < posibleMovements.length; i++) {
            var nextSection = tableboard.getSection(posibleMovements[i].x,posibleMovements[i].y);
            var movementObject = this.checkSection(nextSection);
            if (movementObject) {
                validMovements.push(movementObject);
            }
        }
        return validMovements;
    }
}