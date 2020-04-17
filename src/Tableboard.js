const whiteSectionColor = 0xF4F4F4;
const blackSectionColor = 0x804000;

class Tableboard extends THREE.Object3D {
    constructor() {
        super();
        this.rotateSpeed = 60;
        this.boardSize = 8;
        this.sections = [];
        this.whiteTeam = new Array();
        this.blackTeam = new Array();
        this.board = new THREE.Object3D();

        this.createBoard();
        this.addPieces();
        this.board.position.x = -(this.boardSize / 2 * this.sections[0][0].size - this.sections[0][0].size / 2);
        this.board.position.z = this.boardSize / 2 * this.sections[0][0].size - this.sections[0][0].size / 2;
        
        this.add(this.board);
    }

    createBoard() {
        var color = blackSectionColor;
        for (var i = 0; i < this.boardSize; i++) {
            if (color === whiteSectionColor) {
                color = blackSectionColor;
            } else {
                color = whiteSectionColor;
            }
            this.sections[i] = new Array(this.boardSize);
            for (var j = 0; j < this.boardSize; j++) {
                this.sections[i][j] = new Section(color, i, j);
                this.board.add(this.sections[i][j]);
                if (color === whiteSectionColor) {
                    color = blackSectionColor;
                } else {
                    color = whiteSectionColor;
                }
            }
        }
    }

    addPieces() {
        this.whiteTeam.push(new Rook(teams.WHITE, this.sections[0][0]));  
        this.blackTeam.push(new Rook(teams.BLACK, this.sections[0][7]));  
        this.whiteTeam.push(new Knight(teams.WHITE, this.sections[1][0]));
        this.blackTeam.push(new Knight(teams.BLACK, this.sections[1][7]));
        this.whiteTeam.push(new Bishop(teams.WHITE, this.sections[2][0]));
        this.blackTeam.push(new Bishop(teams.BLACK, this.sections[2][7]));
        this.whiteTeam.push(new King(teams.WHITE, this.sections[3][0]));  
        this.blackTeam.push(new King(teams.BLACK, this.sections[3][7]));  
        this.whiteTeam.push(new Queen(teams.WHITE, this.sections[4][0])); 
        this.blackTeam.push(new Queen(teams.BLACK, this.sections[4][7])); 
        this.whiteTeam.push(new Bishop(teams.WHITE, this.sections[5][0]));
        this.blackTeam.push(new Bishop(teams.BLACK, this.sections[5][7]));
        this.whiteTeam.push(new Knight(teams.WHITE, this.sections[6][0]));
        this.blackTeam.push(new Knight(teams.BLACK, this.sections[6][7]));
        this.whiteTeam.push(new Rook(teams.WHITE, this.sections[7][0]));  
        this.blackTeam.push(new Rook(teams.BLACK, this.sections[7][7]));  

        for (var i = 0; i < this.boardSize; i++) {
            this.whiteTeam.push(new Pawn(teams.WHITE, this.sections[i][1]));
            this.blackTeam.push(new Pawn(teams.BLACK, this.sections[i][6]));
        }

        for (var i = 0; i < this.whiteTeam.length; i++) {
            this.board.add(this.whiteTeam[i]);
            this.board.add(this.blackTeam[i]);
        }
    }

    

    selectSection(posX, posZ) {
        if (posX < this.boardSize && posZ < this.boardSize
            && posX >= 0 && posZ >= 0) {
            this.sections[posX][posZ].onClick();
        }
    }

    update(deltaTime) {
        //this.rotation.y += (this.rotateSpeed * deltaTime) * 3.141592 / 180;
    }
}