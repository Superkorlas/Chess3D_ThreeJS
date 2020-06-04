
const whiteColorTeam = 0xF4F4F4;
const blackColorTeam = 0x804000;

class Piece extends THREE.Object3D {
    constructor(name, team, initialSection) {
        super();
        this.name = name;
        this.team = team;
        this.material;
        this.currentSection = initialSection;
        this.selectedMaterial = new THREE.MeshPhongMaterial({ color: 0x00893F });
        this.threatenMaterial = new THREE.MeshPhongMaterial({ color: 0xCB3234 });
        this.isSelected = false;
        this.isMoved = false;
        this.finishedMoveEvent = new Event("pieceMovementFinished");

        switch (team) {
            case teams.WHITE:
                this.material = new THREE.MeshPhongMaterial({ color: whiteColorTeam });
                break;
            case teams.BLACK:
                this.material = new THREE.MeshPhongMaterial({ color: blackColorTeam });
                break;
            default:
                window.alert("Not valid team for " + this.name);
                break;
        }

        this.loader = new THREE.OBJLoader();
        this.piece = new THREE.Object3D();
        this.mesh;
        this.loadPiece(name, this.material);
    }

    loadPiece(name, material) {
        var modelPath = "../assets/" + name + ".obj";
        var that = this;
        this.loader.load(modelPath,
            function (obj) {
                obj.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                        child.userData = that;
                        that.mesh = child;
                    }
                });
                that.piece = obj;
                that.add(that.piece);
                that.position.x = that.currentSection.section.position.x;
                that.position.z = that.currentSection.section.position.z;
                that.updateSection(that.currentSection);
                that.isMoved = false;
                MyScene.pieceLoaded();
            },
            function (xhr) {
                //console.log((xhr.loaded / xhr.total * 100) + "% loaded")
            },
            function (err) {
                //console.error("Error loading model")
            }
        );
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

    select(isThreatened) {
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

    update() {    
    }

}