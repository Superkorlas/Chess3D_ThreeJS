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
        var horizontalAnim = this.horizontalMovementAnim(section, false);
        var that = this;
        var height  = { posY : 0 };
        var target = { posY : 20 };

        var verticalUpAnim = new TWEEN.Tween(height).to(target, 500);
        verticalUpAnim.easing(TWEEN.Easing.Quadratic.InOut);
        verticalUpAnim.onUpdate(function() { 
            that.position.y = height.posY;
        });

        var height2  = { posY : 20 };
        var target2 = { posY : 0 };
        var verticalDownAnim = new TWEEN.Tween(height2).to(target2, 500);
        verticalDownAnim.easing(TWEEN.Easing.Quadratic.InOut);
        verticalDownAnim.onUpdate(function() { 
            that.position.y = height2.posY;
        });

        verticalUpAnim.chain(horizontalAnim);
        horizontalAnim.chain(verticalDownAnim);
        verticalUpAnim.start();

        this.updateSection(section);
    }
}