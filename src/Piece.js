
const whiteColorTeam = 0xF4F4F4;
const blackColorTeam = 0x804000;

class Piece extends THREE.Object3D {
    constructor(name, team, initialSection, octree = null) {
        super();
        this.octree = octree;
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
        var colliderGeometry = new THREE.BoxGeometry(10,20, 10, 1);
        colliderGeometry.translate(0, 10, 0);
        var colliderMaterial = new THREE.MeshNormalMaterial({opacity:0, transparent: true});
        this.collider = new THREE.Mesh(colliderGeometry, colliderMaterial);
        this.collider.userData = this;
        this.add(this.collider);
        if (this.octree) {
            this.octree.add(this.collider, {useFaces: false});
        }

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
                        that.mesh.userData = that;
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
        console.log(this.finishedMoveEvent);
        var that = this;
        var currentPos = { posX : that.position.x, posZ : that.position.z };
        var target = { posX : section.section.position.x, posZ : section.section.position.z };
        var moveAnim = new TWEEN.Tween(currentPos).to(target, 1000);
        moveAnim.easing(TWEEN.Easing.Quadratic.InOut);
        moveAnim.onUpdate(function() { 
            that.position.x = currentPos.posX;
            that.position.z = currentPos.posZ;
            if (that.octree) {
                var octreeObjects = that.octree.search(that.collider.position, 1, false);
                if (octreeObjects.length > 0) {
                    that.onCollision(octreeObjects);
                }
            }
        });
        moveAnim.onComplete(function() { 
            document.dispatchEvent(that.finishedMoveEvent);
        });

        moveAnim.start();  

        this.updateSection(section);
    }

    updateSection(section) {
        this.currentSection.currentPiece = null;
        section.currentPiece = this;
        this.currentSection = section;
        this.isMoved = true;
    }

    onCollision(objects) {
        //console.log("Total objects: "  + objects.length);
        objects.forEach(object => {
            //console.log(object.userData);
            if (object.userData != this && object.userData)
                console.log("Dentro del if");
            if (object.userData instanceof Piece) {
                if (object.teams != this.team) {
                    console.log("collision");
                }
            }
        });
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
            shouldContinue = this.getTest(validMovements, nextSection);
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
            shouldContinue = this.getTest(validMovements, nextSection);
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
            shouldContinue = this.getTest(validMovements, nextSection);
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
            shouldContinue = this.getTest(validMovements, nextSection);
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
            shouldContinue = this.getTest(validMovements, nextSection);
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
            shouldContinue = this.getTest(validMovements, nextSection);
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
            shouldContinue = this.getTest(validMovements, nextSection);
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
            shouldContinue = this.getTest(validMovements, nextSection);
        }

        return validMovements;
    }

    getTest(validMovements, nextSection) {
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
            if (section.currentPiece != null) {
                if (section.currentPiece.team != this.team) {
                    object = section.currentPiece;
                }
            } else {
                object = section;
            }
        }

        return object;
    }

    destroy() {
        this.currentSection.currentPiece = null;
        this.parent.remove(this);
    }

    update() {
        console.log("jeje");
    
    }

}