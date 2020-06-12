
const pieceColor = 0xFDFBFB;
//const blackColorTeam = 0x804000;

class Piece extends THREE.Object3D {
    constructor(name, team, initialSection) {
        super();
        this.name = name;
        this.team = team;
        this.material;
        this.currentSection = initialSection;
        this.isSelected = false;
        this.finishedMoveEvent = new Event("pieceMovementFinished");
		this.texture;
        switch (team) {
            case teams.WHITE:
                this.texture = whitePieceTexture;
                break;
            case teams.BLACK:
				this.texture = blackPieceTexture;
				break;
            default:
                window.alert("Not valid team for " + this.name);
                break;
		}
		
		this.material = new THREE.MeshPhongMaterial({ color: pieceColor, map: this.texture });
		this.selectedMaterial = new THREE.MeshLambertMaterial({ color: pieceColor, emissive: 0x00893F, map: this.texture });
		this.threatenMaterial = new THREE.MeshPhongMaterial({ color: pieceColor, emissive: 0xCB3234  , map: this.texture });
		
        this.piece = new THREE.Object3D();
		this.mesh;
		var that = this;
		this.piece = getModel(this.name).clone();
		this.piece.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.material = that.material;
				child.userData = that;
				that.mesh = child;
			}
		});
		this.piece.userData = this;
		this.add(this.piece);
		this.position.x = this.currentSection.section.position.x;
		this.position.z = this.currentSection.section.position.z;
		this.updateSection(this.currentSection);
		this.isMoved = false;
    }

    move(section) {
        var that = this;
        var currentPos = { posX : that.position.x, posZ : that.position.z };
        var target = { posX : section.section.position.x, posZ : section.section.position.z };
        var moveAnim = new TWEEN.Tween(currentPos).to(target, 1000);
        moveAnim.easing(TWEEN.Easing.Quadratic.InOut);
        moveAnim.onUpdate(function() { 
            that.position.x = currentPos.posX;
            that.position.z = currentPos.posZ;
        });
        moveAnim.onComplete(function() { 
            that.onMovementComplete();
        });

        moveAnim.start();  

        this.updateSection(section);
    }

    onMovementComplete() {
        document.dispatchEvent(this.finishedMoveEvent);
    }

    updateSection(section) {
        this.currentSection.currentPiece = null;
        section.currentPiece = this;
        this.currentSection = section;
        this.isMoved = true;
    }

    onClick() {
        if (this.isSelected) {
            this.unselect();
        } else {
            this.select(false);
        }
    }

    select(isThreatened = false) {
        if (isThreatened) {
			this.mesh.material = this.threatenMaterial;
        } else {
			this.mesh.material = this.selectedMaterial;
        }
        this.isSelected = true;
    }

    unselect() {
        this.mesh.material = this.material;
        this.isSelected = false;
    }

    getValidMovements(tableboard) {
        window.alert("Valid movements not define: " + this.name);
        return new Array();
    }

    getNorthMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexZ = 0;

        while (shouldContinue && scope > indexZ) {
            indexZ++;
            var nextSection = tableboard.getSection(x, z + indexZ);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    getSouthMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexZ = 0;

        while (shouldContinue && scope > indexZ) {
            indexZ++;
            var nextSection = tableboard.getSection(x, z - indexZ);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    getWestMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexX = 0;

        while (shouldContinue && scope > indexX) {
            indexX++;
            var nextSection = tableboard.getSection(x - indexX, z);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    getEastMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexX = 0;

        while (shouldContinue && scope > indexX) {
            indexX++;
            var nextSection = tableboard.getSection(x + indexX, z);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    getNorthWestMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexX = 0;
        var indexZ = 0;

        while (shouldContinue && scope > indexX && scope > indexZ) {
            indexX++;
            indexZ++;
            var nextSection = tableboard.getSection(x - indexX, z + indexZ);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    getNorthEastMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexX = 0;
        var indexZ = 0;

        while (shouldContinue && scope > indexX && scope > indexZ) {
            indexX++;
            indexZ++;
            var nextSection = tableboard.getSection(x + indexX, z + indexZ);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    getSouthWestMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexX = 0;
        var indexZ = 0;

        while (shouldContinue && scope > indexX && scope > indexZ) {
            indexX++;
            indexZ++;
            var nextSection = tableboard.getSection(x - indexX, z - indexZ);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    getSouthEastMovement(tableboard, scope) {
        var validMovements = new Array();
        var shouldContinue = true;
        var x = this.currentSection.posX;
        var z = this.currentSection.posZ;
        var indexX = 0;
        var indexZ = 0;

        while (shouldContinue && scope > indexX && scope > indexZ) {
            indexX++;
            indexZ++;
            var nextSection = tableboard.getSection(x + indexX, z - indexZ);
            shouldContinue = this.shouldContinueExploring(validMovements, nextSection);
        }

        return validMovements;
    }

    shouldContinueExploring(validMovements, nextSection) {
        var shouldContinue = true;
        var movementObject = this.checkSection(nextSection);
        if (movementObject) {
            validMovements.push(movementObject);
            if (movementObject instanceof Piece) {
                shouldContinue = false;
            }
        } else {
            shouldContinue = false;
        }
        return shouldContinue;
    }

    checkSection(section) {
        var object = null;

        if (section) {
            var currentPiece = section.getCurrentPiece();
            if (currentPiece != null) {
                if (currentPiece.team != this.team) {
                    object = currentPiece;
                }
            } else {
                object = section;
            }
        }

        return object;
    }

    destroy() {
        this.parent.remove(this);
    }

}