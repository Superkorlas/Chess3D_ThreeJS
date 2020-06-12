class Section extends THREE.Object3D {
    constructor(color, posX, posZ) {
        super();
        this.color = color;
        this.size = 25;
        this.isSelected = false;
        this.currentPiece = null;
        this.posX = posX;
        this.posZ = posZ;
        this.isInSimulation = false;
        this.simulationPiece = null;

		this.texture;
		if (color == blackSectionColor) {
			this.texture =  whiteSectionTexture;
		} else {
			this.texture = blackSectionTexture;
		}

		this.material = new THREE.MeshPhongMaterial({ color: this.color, map : this.texture });
		this.selectedMaterial = new THREE.MeshLambertMaterial({ color: this.color, emissive:0x00893F, map: this.texture });
        this.geometry = new THREE.BoxGeometry(this.size,1,this.size);
        this.geometry.translate(0, -0.5, 0);
        this.section = new THREE.Mesh(this.geometry, this.material);
        this.section.position.x = posX * this.size;
        this.section.position.z = - (posZ * this.size);

        this.section.userData = this;

        this.add(this.section);
    }

    onClick() {
        if (this.isSelected) {
            this.unselect();
        } else {
            this.select();
        }
    }

    select() {
        this.section.material = this.selectedMaterial;
        this.isSelected = true;
    }

    unselect() {
        this.section.material = this.material;
        this.isSelected = false;
    }

    onSimulate(piece = null) {
        this.simulationPiece = piece;
        this.isInSimulation = !this.isInSimulation;
    }

    getCurrentPiece() {
        if (this.isInSimulation) {
            return this.simulationPiece;
        } else {
            return this.currentPiece;
        }
	}
	
	reset() {
		this.unselect();
        this.currentPiece = null;
        this.isInSimulation = false;
		this.simulationPiece = null;
	}

}