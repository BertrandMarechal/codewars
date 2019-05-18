function threatFilter(king, otherPlayerPieces, playerPieces) {
    // Top (meaning y equals 0 or 1) is black's home and the bottom (y equals 6 or 7) is white's home
    // 0 for white or 1 for black
    const direction = king.owner === 1 ? 1 : -1;

    return otherPlayerPieces.filter((piece, i) => {
        switch (piece.piece) {
            case 'pawn':
                if (king.piece) {
                    return Math.abs(piece.x - king.x) === 1 &&
                        (
                            king.y === piece.y - direction || (
                                // en passant =>
                                //   est pion
                                king.piece === 'pawn' &&
                                //   just moved of 2 cells
                                Math.abs(king.prevY - king.y) === 2 &&
                                //   same line
                                piece.y === king.y &&
                                //   there is a free space in the direction
                                otherPlayerPieces
                                    .concat(playerPieces)
                                    .filter(p => p.x === king.x && p.y === king.y - direction)
                                    .length === 0
                            )
                        );
                } else {
                    return piece.x === king.x && (king.y === piece.y - direction || king.y === piece.y - 2 * direction);
                }
            case 'rook':
                return (
                    ((piece.x === king.x) &&
                        otherPlayerPieces
                            .filter((x, j) => i !== j)
                            .concat(playerPieces)
                            .filter(p => p.x === piece.x && p.y < Math.max(piece.y, king.y) && p.y > Math.min(piece.y, king.y))
                            .length === 0) ||
                    ((piece.y === king.y) &&
                        otherPlayerPieces
                            .filter((x, j) => i !== j)
                            .concat(playerPieces)
                            .filter(p => p.y === piece.y && p.x < Math.max(piece.x, king.x) && p.x > Math.min(piece.x, king.x))
                            .length === 0)
                );
            case 'knight':
                const kdy = Math.abs(king.y - piece.y);
                const kdx = Math.abs(king.x - piece.x);
                return kdy + kdx === 3 && (kdy === 1 || kdx === 1);
            case 'bishop':
                const bdy = king.y - piece.y;
                const bdx = king.x - piece.x;
                return Math.abs(bdy) === Math.abs(bdx) &&
                    otherPlayerPieces
                        .filter((x, j) => i !== j)
                        .concat(playerPieces)
                        .filter(p => {
                            const sdy = p.y - piece.y;
                            const sdx = p.x - piece.x;
                            return bdx * sdx > 0 &&
                                bdy * sdy > 0 &&
                                Math.abs(sdy) === Math.abs(sdx) &&
                                Math.abs(sdy) < Math.abs(bdy);
                        })
                        .length === 0;
            case 'queen':
                const qdy = king.y - piece.y;
                const qdx = king.x - piece.x;
                return (
                    Math.abs(qdy) === Math.abs(qdx) &&
                    otherPlayerPieces
                        .filter((x, j) => i !== j)
                        .concat(playerPieces)
                        .filter(p => {
                            const sdy = p.y - piece.y;
                            const sdx = p.x - piece.x;
                            return qdx * sdx > 0 &&
                                qdy * sdy > 0 &&
                                Math.abs(sdy) === Math.abs(sdx) &&
                                Math.abs(sdy) < Math.abs(qdy);
                        })
                        .length === 0
                ) || (
                        piece.x === king.x &&
                        otherPlayerPieces
                            .filter((x, j) => i !== j)
                            .concat(playerPieces)
                            .filter(p => p.x === piece.x && p.y < Math.max(piece.y, king.y) && p.y > Math.min(piece.y, king.y))
                            .length === 0
                    ) || (
                        piece.y === king.y &&
                        otherPlayerPieces
                            .filter((x, j) => i !== j)
                            .concat(playerPieces)
                            .filter(p => p.y === piece.y && p.x < Math.max(piece.x, king.x) && p.x > Math.min(piece.x, king.x))
                            .length === 0
                    );
            case 'king':
                break;
        }

    });
}

function checkEmptyCaseFillers(params, emptyCaseThreat, caseX, caseY) {
    // we move the piece
    const previousPositions = {
        x: emptyCaseThreat.x,
        y: emptyCaseThreat.y
    };
    const playerPiece = params.playerPieces.find(p => p.x === previousPositions.x && p.y === previousPositions.y);
    playerPiece.x = caseX;
    playerPiece.y = caseY;

    const newBoardIsCheck = isCheck([
        params.king,
        ...params.playerPieces,
        ...params.otherPlayerPieces
    ], emptyCaseThreat.owner);

    if (!newBoardIsCheck) {
        // no threats on the king, we intercepted !
        return true;
    }
    playerPiece.x = previousPositions.x;
    playerPiece.y = previousPositions.y;
}
// king
// threat
// diagonale
// xDir
// yDir
function intercept(params) {
    if (!params.diagonale) {
        const loopFrom = Math.min(
            params.yDir === 0 ? params.threat.y : params.threat.x,
            params.yDir === 0 ? params.king.y : params.king.x
        ) + 1;
        const loopTo = Math.max(
            params.yDir === 0 ? params.threat.y : params.threat.x,
            params.yDir === 0 ? params.king.y : params.king.x
        );
        for (let i = loopFrom; i < loopTo; i++) {
            const emptyCaseThreats = threatFilter(
                {
                    x: params.xDir === 0 ? i : params.threat.x,
                    y: params.yDir === 0 ? i : params.threat.y,
                    owner: params.threat.owner
                },
                params.playerPieces,
                params.otherPlayerPieces
            );
            if (emptyCaseThreats.length > 0) {
                for (let j = 0; j < emptyCaseThreats.length; j++) {
                    if (checkEmptyCaseFillers(
                        params,
                        emptyCaseThreats[j],
                        params.xDir === 0 ? i : params.threat.x,
                        params.yDir === 0 ? i : params.threat.y
                    )) {
                        console.log(`Intercepted by ${emptyCaseThreats[j].piece} ${emptyCaseThreats[j].x} ${emptyCaseThreats[j].y}`);

                        return true;
                    }
                }
            }
        }
    } else {
        const dx = params.king.x - params.threat.x;
        const directionX = dx / Math.abs(dx);
        const dy = params.king.y - params.threat.y;
        const directionY = dy / Math.abs(dy);
        const endLoop = Math.abs(Math.max(dx, dy));

        for (let i = 1; i < endLoop; i++) {
            const emptyCaseThreats = threatFilter(
                {
                    x: params.threat.x + directionX * i,
                    y: params.threat.y + directionY * i,
                    owner: params.threat.owner
                },
                params.playerPieces,
                params.otherPlayerPieces
            );
            if (emptyCaseThreats.length > 0) {
                for (let j = 0; j < emptyCaseThreats.length; j++) {
                    if (checkEmptyCaseFillers(
                        params,
                        emptyCaseThreats[j],
                        params.threat.x + directionX * i,
                        params.threat.y + directionY * i
                    )) {
                        console.log(`Intercepted by ${emptyCaseThreats[j].piece} ${emptyCaseThreats[j].x} ${emptyCaseThreats[j].y}`);

                        return true;
                    }
                }
            }
        }
    }
}

// Returns an array of threats if the arrangement of 
// the pieces is a check, otherwise false
function isCheck(pieces, player) {
    const potentiallyThreatenedKing = pieces.find(p => p.piece === 'king' && p.owner === player);
    const otherPlayerPieces = pieces.filter(p => p.owner !== player);
    const playerPieces = pieces.filter(p => p.piece !== 'king' && p.owner === player);
    const threats = threatFilter(potentiallyThreatenedKing, otherPlayerPieces, playerPieces);
    return threats.length > 0 ? threats : false;
}

// Returns true if the arrangement of the
// pieces is a check mate, otherwise false
function isMate(pieces, player) {
    // check if isCheck
    console.log(player, JSON.stringify(pieces));
    const threats = isCheck(pieces, player);
    if (threats && threats.length) {
        // if yes, check if we can move the king somewhere else
        const potentiallyThreatenedKing = pieces.find(p => p.piece === 'king' && p.owner === player);
        const otherPlayerPieces = pieces.filter(p => p.owner !== player);
        const playerPieces = pieces.filter(p => p.piece !== 'king' && p.owner === player);

        for (let i = Math.max(potentiallyThreatenedKing.y - 1, 0); i < Math.min(potentiallyThreatenedKing.y + 2, 8); i++) {
            for (let j = Math.max(potentiallyThreatenedKing.x - 1, 0); j < Math.min(potentiallyThreatenedKing.x + 2, 8); j++) {
                if (!(i === potentiallyThreatenedKing.y && j === potentiallyThreatenedKing.x)) {
                    const existingPiece = playerPieces.find(p => p.x === j && p.y === i);

                    if (!existingPiece) {
                        // console.log(potentiallyThreatenedKing.y, potentiallyThreatenedKing.x, i, j);
                        const subThreats = isCheck([
                            {
                                ...potentiallyThreatenedKing,
                                x: j,
                                y: i
                            },
                            ...otherPlayerPieces.filter(p => p.x !== j || p.y !== i),
                            ...playerPieces
                        ], player);

                        // console.log(potentiallyThreatenedKing.y, potentiallyThreatenedKing.x, i, j, subThreats);
                        if (!subThreats) {
                            return false;
                        }
                    }
                }
            }
        }
        // we could not move from the threats
        // if there is only one we will try to remove it
        console.log(threats);

        if (threats.length === 1) {

            const threat = threats[0];
            // we already checked that if the king could stop the threat, it would.
            // we have to see if another of the player's pieces can
            const threatenerThreats = threatFilter(
                threat,
                [potentiallyThreatenedKing, ...playerPieces],
                otherPlayerPieces.filter(p => p.x !== threat.x || p.y !== threat.y)
            );
            console.log(threatenerThreats);

            for (let i = 0; i < threatenerThreats.length; i++) {
                // we have someone that can block, let's try if another enemy can be threatening if we do so
                const threatenerThreat = threatenerThreats[i];
                if (checkEmptyCaseFillers({
                    king: potentiallyThreatenedKing,
                    playerPieces: playerPieces,
                    otherPlayerPieces: otherPlayerPieces.filter(p => p.x !== threat.x || p.y !== threat.y)
                }, threatenerThreat, threat.x, threat.y)) {
                    console.log(`Stopped by ${threatenerThreat.piece} `);
                    return false;
                }
            }
            // we couldn't stop the threat.
            // will now try to intercept
            // this would only work if threat is queen, rook, or bishop
            // we will have to see if any position between the piece and the king is threatened
            // if it is, we will move the piece, and try to see if the king is threatened
            switch (threat.piece) {
                case 'rook':
                    if (intercept({
                        king: potentiallyThreatenedKing,
                        threat: threat,
                        xDir: threat.x - potentiallyThreatenedKing.x,
                        yDir: threat.y - potentiallyThreatenedKing.y,
                        diagonale: false,
                        otherPlayerPieces,
                        playerPieces
                    })) {
                        return false;
                    }
                    break;
                case 'bishop':
                    if (intercept({
                        king: potentiallyThreatenedKing,
                        threat: threat,
                        diagonale: true,
                        otherPlayerPieces,
                        playerPieces
                    })) {
                        return false;
                    }
                    break;
                case 'queen':
                    if (intercept({
                        king: potentiallyThreatenedKing,
                        threat: threat,
                        xDir: threat.x - potentiallyThreatenedKing.x,
                        yDir: threat.y - potentiallyThreatenedKing.y,
                        diagonale: false,
                        otherPlayerPieces,
                        playerPieces
                    })) {
                        return false;
                    }
                    if (intercept({
                        king: potentiallyThreatenedKing,
                        threat: threat,
                        diagonale: true,
                        otherPlayerPieces,
                        playerPieces
                    })) {
                        return false;
                    }
                    break;

                default:
                    break;
            }
        }

        return true;
    }
    return false;
}

function logBoard(pieces) {
    let board = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = pieces.find(p => p.x === j && p.y === i);
            if (piece) {
                board += ` ${piece.owner}${piece.piece === 'king' ? 'K' : piece.piece.substr(0, 1)}:`;
            } else {
                board += '   :';
            }
        }
        board += '|\r\n';
    }
    console.log(board);
}

// var pieces = [
//     { piece: "king", owner: 1, x: 4, y: 0 },
//     { piece: "king", owner: 0, x: 4, y: 7 },
//     { piece: "pawn", owner: 1, x: 5, y: 6 }
// ];
// console.log(isCheck(pieces, 0)) //, [pieces[2]], "Pawn threatens king");

// pieces = [
//     { piece: "king", owner: 1, x: 4, y: 0 },
//     { piece: "king", owner: 0, x: 4, y: 7 },
//     { piece: "rook", owner: 1, x: 4, y: 1 }
// ];
// console.log(isCheck(pieces, 0)) //, [pieces[2]], "Rook threatens king");

// pieces = [
//     { piece: "king", owner: 1, x: 4, y: 0 },
//     { piece: "king", owner: 0, x: 4, y: 7 },
//     { piece: "knight", owner: 1, x: 2, y: 6 }
// ];
// console.log(isCheck(pieces, 0)) //, [pieces[2]], "Knight threatens king");

// pieces = [
//     { piece: "king", owner: 1, x: 4, y: 0 },
//     { piece: "king", owner: 0, x: 4, y: 7 },
//     { piece: "bishop", owner: 1, x: 0, y: 3 }
// ];
// console.log(isCheck(pieces, 0)) //, [pieces[2]], "Bishop threatens king");

// pieces = [
//     { piece: "king", owner: 1, x: 4, y: 0 },
//     { piece: "king", owner: 0, x: 4, y: 7 },
//     { piece: "queen", owner: 1, x: 4, y: 1 }
// ];
// console.log(isCheck(pieces, 0)) //, [pieces[2]], "Queen threatens king");

// pieces = [
//     { piece: "king", owner: 1, x: 4, y: 0 },
//     { piece: "king", owner: 0, x: 4, y: 7 },
//     { piece: "queen", owner: 1, x: 7, y: 4 }
// ];
// console.log(isCheck(pieces, 0)) //, [pieces[2]], "Queen threatens king");

// pieces = [
//     { piece: "king", owner: 1, x: 4, y: 0 },
//     { piece: "pawn", owner: 0, x: 4, y: 6 },
//     { piece: "pawn", owner: 0, x: 5, y: 6 },
//     { piece: "king", owner: 0, x: 4, y: 7 },
//     { piece: "bishop", owner: 0, x: 5, y: 7 },
//     { piece: "bishop", owner: 1, x: 1, y: 4 },
//     { piece: "rook", owner: 1, x: 2, y: 7, prevX: 2, prevY: 5 }
// ];
// sortFunc = function (a, b) {
//     if (a.y == b.y) return a.x - b.x;
//     return a.y - b.y;
// };
// console.log(isCheck(pieces, 0)) //, [pieces[2]], "Double threat");
//   Test.assertSimilar(isCheck(pieces, 0).sort(sortFunc), [pieces[5], pieces[6]], "Double threat");

// var pieces = [{ "piece": "pawn", "owner": 0, "x": 6, "y": 4 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 5 }, { "piece": "pawn", "owner": 0, "x": 3, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 7, "y": 6 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "bishop", "owner": 0, "x": 5, "y": 7 }, { "piece": "knight", "owner": 0, "x": 6, "y": 7 }, { "piece": "rook", "owner": 0, "x": 7, "y": 7 }, { "piece": "queen", "owner": 1, "x": 7, "y": 4, "prevX": 3, "prevY": 0 }, { "piece": "king", "owner": 1, "x": 4, "y": 0 }];
// console.log(isCheck(pieces, 0), isMate(pieces, 0)); //, [pieces[2]], "Should move");

// var pieces = [{ "piece": "queen", "owner": 1, "x": 3, "y": 0 }, { "piece": "bishop", "owner": 1, "x": 5, "y": 0 }, { "piece": "king", "owner": 1, "x": 4, "y": 1 }, { "piece": "pawn", "owner": 1, "x": 3, "y": 2 }, { "piece": "bishop", "owner": 0, "x": 5, "y": 1 }, { "piece": "knight", "owner": 0, "x": 3, "y": 3, "prevX": 2, "prevY": 5 }, { "piece": "knight", "owner": 0, "x": 4, "y": 3 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }];
// console.log(isMate(pieces, 1)); //, [pieces[2]], "Should be mate");

// var pieces = [{ "piece": "king", "owner": 1, "x": 4, "y": 0 }, { "piece": "bishop", "owner": 1, "x": 1, "y": 4, "prevX": 3, "prevY": 2 }, { "piece": "queen", "owner": 1, "x": 0, "y": 7 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "rook", "owner": 0, "x": 1, "y": 7 }, { "piece": "bishop", "owner": 0, "x": 3, "y": 7 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "rook", "owner": 0, "x": 5, "y": 7 }];
// console.log(isMate(pieces, 0)); //, [pieces[2]], "Should not be mate");
// logBoard(pieces);

// var pieces = [{ "piece": "king", "owner": 1, "x": 4, "y": 0 }, { "piece": "bishop", "owner": 1, "x": 1, "y": 4, "prevX": 3, "prevY": 2 }, { "piece": "queen", "owner": 1, "x": 0, "y": 7 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "rook", "owner": 0, "x": 1, "y": 7 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "rook", "owner": 0, "x": 5, "y": 7 }, { "piece": "rook", "owner": 1, "x": 3, "y": 4 }];
// console.log(isMate(pieces, 0)); //, [pieces[2]], "Should be mate");
// logBoard(pieces);

// var pieces = [{ "piece": "pawn", "owner": 0, "x": 6, "y": 4 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 5 }, { "piece": "pawn", "owner": 0, "x": 3, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 7, "y": 6 }, { "piece": "queen", "owner": 0, "x": 3, "y": 7 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "bishop", "owner": 0, "x": 5, "y": 7 }, { "piece": "knight", "owner": 0, "x": 6, "y": 7 }, { "piece": "rook", "owner": 0, "x": 7, "y": 7 }, { "piece": "queen", "owner": 1, "x": 7, "y": 4, "prevX": 3, "prevY": 0 }, { "piece": "king", "owner": 1, "x": 4, "y": 0 }];
// console.log(isMate(pieces, 0)); //, [pieces[2]], "Should not be mate");
// logBoard(pieces);

// var pieces = [{ "piece": "pawn", "owner": 0, "x": 4, "y": 4 }, { "piece": "knight", "owner": 0, "x": 2, "y": 5 }, { "piece": "pawn", "owner": 0, "x": 6, "y": 5 }, { "piece": "knight", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "queen", "owner": 0, "x": 3, "y": 7 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "bishop", "owner": 0, "x": 5, "y": 7 }, { "piece": "knight", "owner": 1, "x": 5, "y": 5, "prevX": 3, "prevY": 4 }, { "piece": "king", "owner": 1, "x": 4, "y": 0 }, { "piece": "pawn", "owner": 1, "x": 4, "y": 3 }];
// logBoard(pieces);
// console.log(isMate(pieces, 0)); //, [pieces[2]], "Should be mate");


// var pieces = [{ "piece": "knight", "owner": 0, "x": 3, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "queen", "owner": 0, "x": 3, "y": 7 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "bishop", "owner": 0, "x": 5, "y": 7 }, { "piece": "king", "owner": 1, "x": 4, "y": 0 }, { "piece": "queen", "owner": 1, "x": 4, "y": 1 }, { "piece": "knight", "owner": 1, "x": 3, "y": 5, "prevX": 2, "prevY": 3 }];
// logBoard(pieces);
// console.log(isMate(pieces, 0)); //, [pieces[2]], "Should be mate");

// var pieces = [{ "piece": "king", "owner": 1, "x": 4, "y": 0 }, { "piece": "bishop", "owner": 1, "x": 1, "y": 4, "prevX": 3, "prevY": 2 }, { "piece": "queen", "owner": 1, "x": 0, "y": 7 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "rook", "owner": 0, "x": 1, "y": 7 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "rook", "owner": 0, "x": 5, "y": 7 }, { "piece": "rook", "owner": 1, "x": 3, "y": 4 }];
// logBoard(pieces);
// console.log(isMate(pieces, 0)); //, [pieces[2]], "Should be mate");

// var pieces = [{ "piece": "king", "owner": 1, "x": 4, "y": 0 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "rook", "owner": 0, "x": 5, "y": 7 }, { "piece": "queen", "owner": 1, "x": 3, "y": 7, "prevX": 2, "prevY": 6 }, { "piece": "rook", "owner": 1, "x": 3, "y": 6 }];
// logBoard(pieces);
// console.log(isMate(pieces, 0)); //, [pieces[2]], "Should be checked");

// var pieces = [{ "piece": "king", "owner": 1, "x": 5, "y": 3 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 4, "prevX": 4, "prevY": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "knight", "owner": 0, "x": 2, "y": 5 }, { "piece": "pawn", "owner": 1, "x": 3, "y": 4 }, { "piece": "knight", "owner": 1, "x": 3, "y": 3 }, { "piece": "pawn", "owner": 1, "x": 4, "y": 3 }, { "piece": "bishop", "owner": 1, "x": 4, "y": 2 }, { "piece": "rook", "owner": 1, "x": 5, "y": 2 }, { "piece": "queen", "owner": 0, "x": 6, "y": 5 }];
// logBoard(pieces);
// console.log(isMate(pieces, 1)); //, [pieces[2]], "Should be checked");

var pieces = [{ "piece": "king", "owner": 1, "x": 5, "y": 3 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 4, "prevX": 4, "prevY": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "knight", "owner": 0, "x": 2, "y": 5 }, { "piece": "pawn", "owner": 1, "x": 3, "y": 4 }, { "piece": "knight", "owner": 1, "x": 3, "y": 3 }, { "piece": "pawn", "owner": 1, "x": 4, "y": 3 }, { "piece": "bishop", "owner": 1, "x": 4, "y": 2 }, { "piece": "rook", "owner": 1, "x": 5, "y": 2 }, { "piece": "queen", "owner": 0, "x": 6, "y": 5 }];
logBoard(pieces);
console.log(isMate(pieces, 1)); //, [pieces[2]], "En passant");

var pieces = [{ "piece": "king", "owner": 1, "x": 4, "y": 0 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 6 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "rook", "owner": 0, "x": 5, "y": 7 }, { "piece": "rook", "owner": 1, "x": 3, "y": 7, "prevX": 3, "prevY": 0 }];
logBoard(pieces);
console.log(isMate(pieces, 0)); //, [pieces[2]], "King should capture");

var pieces = [{ "piece": "pawn", "owner": 0, "x": 6, "y": 4 }, { "piece": "pawn", "owner": 0, "x": 5, "y": 5 }, { "piece": "pawn", "owner": 0, "x": 3, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 4, "y": 6 }, { "piece": "pawn", "owner": 0, "x": 7, "y": 6 }, { "piece": "queen", "owner": 0, "x": 3, "y": 7 }, { "piece": "king", "owner": 0, "x": 4, "y": 7 }, { "piece": "bishop", "owner": 0, "x": 5, "y": 7 }, { "piece": "knight", "owner": 0, "x": 6, "y": 7 }, { "piece": "rook", "owner": 0, "x": 7, "y": 7 }, { "piece": "queen", "owner": 1, "x": 7, "y": 4, "prevX": 3, "prevY": 0 }, { "piece": "king", "owner": 1, "x": 4, "y": 0 }];
logBoard(pieces);
console.log(isMate(pieces, 0)); //, [pieces[2]], "Should be mate");
