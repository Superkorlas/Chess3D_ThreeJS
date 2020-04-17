const whiteSectionColor = 0xF4F4F4;
const blackSectionColor = 0x804000;

class Tableboard extends THREE.Object3D {
    constructor() {
        super();
        this.rotateSpeed = 60;
        this.boardSize = 8;
        this.sections = [];
        this.whiteTeam = new Array(16);
        this.blackTeam = new Array(16);
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
        this.addTeam(this.whiteTeam, teams.WHITE);
        this.addTeam(this.blackTeam, teams.BLACK);
    }

    addTeam(team, teamColor) {
        var pos = 0;
        var pawnPos = 1;
        if (teamColor === teams.BLACK) {
            pos = 7;
            pawnPos = 6;
        }

        team.push(new Rook(teamColor, this.sections[0][pos]));
        team.push(new Knight(teamColor, this.sections[1][pos]));
        team.push(new Bishop(teamColor, this.sections[2][pos]));
        team.push(new King(teamColor, this.sections[3][pos]));
        team.push(new Queen(teamColor, this.sections[4][pos]));
        team.push(new Bishop(teamColor, this.sections[5][pos]));
        team.push(new Knight(teamColor, this.sections[6][pos]));
        team.push(new Rook(teamColor, this.sections[7][pos]));
        for (var i = 0; i < this.boardSize; i++) {
            team.push(new Pawn(teamColor, this.sections[i][pawnPos]));
        }
        for (var i = 0; i < team.length; i++) {
            this.board.add(team[i]);
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