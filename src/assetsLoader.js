var pawnModel;
var kingModel;
var queenModel;
var bishopModel;
var knightModel;
var rookModel;

function getModel(name) {
	switch(name) {
		case "Pawn":
			return pawnModel;
			break;
		case "King":
			return kingModel;
			break;
		case "Queen":
			return queenModel;
			break;
		case "Bishop":
			return bishopModel;
			break;
		case "Knight":
			return knightModel;
			break;
		case "Rook":
			return rookModel;
			break;
	}
}

function loadPiece(name) {
	var modelPath = "../assets/model/" + name + ".obj";
	var loader = new THREE.OBJLoader();
	loader.load(modelPath,
		function (obj) {
			switch(name) {
				case "Pawn":
					pawnModel = obj;
					break;
				case "King":
					kingModel = obj;
					break;
				case "Queen":
					queenModel = obj;
					break;
				case "Bishop":
					bishopModel = obj;
					break;
				case "Knight":
					knightModel = obj;
					break;
				case "Rook":
					rookModel = obj;
					break;
							
			}
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

loadPiece("Pawn");
loadPiece("King");
loadPiece("Queen");
loadPiece("Bishop");
loadPiece("Knight");
loadPiece("Rook");