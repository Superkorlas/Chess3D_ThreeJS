
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
        that.move(that.currentSection);
        that.isMoved = false;
        MyScene.pieceLoaded();
      },
      function (xhr) {
        //console.log((xhr.loaded / xhr.total * 100) + "% loaded")
      },
      function (err) {
        console.error("Error loading model")
      }
    );
  }

  move(section) {
    this.currentSection.currentPiece = null;
    this.position.x = section.section.position.x;
    this.position.z = section.section.position.z;
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

  update() { }
}