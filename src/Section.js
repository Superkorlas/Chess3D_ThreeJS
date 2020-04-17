
class Section extends THREE.Object3D {
    constructor(color, posX, posZ) {
        super();
        this.color = color;
        this.size = 25;
        this.selectedMaterial = new THREE.MeshPhongMaterial({ color: 0x00893F });
        this.isSelected = false;
        this.currentPiece = null;

        this.material = new THREE.MeshPhongMaterial({ color: this.color });
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
}