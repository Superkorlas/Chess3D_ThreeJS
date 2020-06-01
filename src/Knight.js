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

    move(section) {
        var that = this;
        var spline = new THREE.CatmullRomCurve3 ( [
            new THREE.Vector3(this.position.x, 0, this.position.z),
            new THREE.Vector3((section.section.position.x + this.position.x)/2, 30, (section.section.position.z + this.position.z)/2),
            new THREE.Vector3(section.section.position.x, 0, section.section.position.z),
        ] );
        var percentage = { percent : 0 };
        var totalPercentage = { percent : 1 };
        var moveAnim = new TWEEN.Tween(percentage).to(totalPercentage, 1000);
        moveAnim.easing(TWEEN.Easing.Cubic.InOut);
        moveAnim.onUpdate(function() {
            that.position.copy(spline.getPointAt(percentage.percent));
        });
        moveAnim.onComplete(function() { 
            that.onMovementComplete();
        });
        moveAnim.start();

        this.updateSection(section);
    }
}