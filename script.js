/* =====================================
   BLOCK BLAST NEON GLASS
   SCRIPT 1
   CORE SYSTEM
===================================== */

const BOARD_SIZE = 8;

/* =====================================
   COLORS
===================================== */

const COLORS = [
    "#00f5ff",
    "#9d4dff",
    "#ff4dd2",
    "#00ff9d",
    "#ffd54d"
];

/* =====================================
   GAME DATA
===================================== */

let board = [];

let score = 0;
let highScore =
    Number(localStorage.getItem("bb_highscore")) || 0;

let combo = 0;

/* =====================================
   DOM
===================================== */

const boardElement =
    document.getElementById("board");

const scoreElement =
    document.getElementById("score");

const highScoreElement =
    document.getElementById("highScore");

const comboText =
    document.getElementById("comboText");

/* =====================================
   CREATE EMPTY BOARD
===================================== */

function createEmptyBoard() {

    board = [];

    for (let row = 0; row < BOARD_SIZE; row++) {

        const newRow = [];

        for (let col = 0; col < BOARD_SIZE; col++) {

            newRow.push(null);

        }

        board.push(newRow);
    }
}

/* =====================================
   CREATE BOARD HTML
===================================== */

function createBoardUI() {

    boardElement.innerHTML = "";

    for (let row = 0; row < BOARD_SIZE; row++) {

        for (let col = 0; col < BOARD_SIZE; col++) {

            const cell =
                document.createElement("div");

            cell.className = "cell";

            cell.dataset.row = row;
            cell.dataset.col = col;

            boardElement.appendChild(cell);
        }
    }
}

/* =====================================
   UPDATE SCORE
===================================== */

function updateScore() {

    scoreElement.textContent = score;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "bb_highscore",
            highScore
        );
    }

    highScoreElement.textContent =
        highScore;
}

/* =====================================
   GET CELL ELEMENT
===================================== */

function getCell(row, col) {

    return document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );
}

/* =====================================
   RENDER BOARD
===================================== */

function renderBoard() {

    for (let row = 0; row < BOARD_SIZE; row++) {

        for (let col = 0; col < BOARD_SIZE; col++) {

            const cell =
                getCell(row, col);

            const value =
                board[row][col];

            cell.classList.remove(
                "filled",
                "preview-valid",
                "preview-invalid"
            );

            cell.style.color = "";

            if (value) {

                cell.classList.add(
                    "filled"
                );

                cell.style.background =
                    value;

                cell.style.color =
                    value;
            }
        }
    }
}

/* =====================================
   RANDOM COLOR
===================================== */

function getRandomColor() {

    return COLORS[
        Math.floor(
            Math.random() *
            COLORS.length
        )
    ];
}

/* =====================================
   ADD SCORE
===================================== */

function addScore(value) {

    score += value;

    updateScore();
}

/* =====================================
   COMBO EFFECT
===================================== */

function showCombo(text) {

    comboText.textContent = text;

    comboText.classList.remove(
        "combo-show"
    );

    void comboText.offsetWidth;

    comboText.classList.add(
        "combo-show"
    );
}

/* =====================================
   RESET GAME
===================================== */

function resetGame() {

    score = 0;

    combo = 0;

    createEmptyBoard();

    renderBoard();

    updateScore();
}

/* =====================================
   INIT
===================================== */

function init() {

    createEmptyBoard();

    createBoardUI();

    updateScore();

    renderBoard();
}

init();


}/* =====================================
   BLOCK BLAST NEON GLASS
   SCRIPT 2
   PIECES + DRAG SYSTEM
===================================== */

/* =====================================
   SHAPES
===================================== */

const SHAPES = [

    [[0,0]],

    [[0,0],[1,0]],

    [[0,0],[0,1]],

    [[0,0],[1,0],[2,0]],

    [[0,0],[0,1],[0,2]],

    [[0,0],[1,0],[0,1]],

    [[0,0],[1,0],[2,0],[3,0]],

    [[0,0],[0,1],[0,2],[0,3]],

    [[0,0],[1,0],[0,1],[1,1]],

    [[0,0],[1,0],[2,0],[2,1]],

    [[0,0],[0,1],[1,1],[2,1]],

    [[0,0],[0,1],[1,0],[1,1],[2,0]]

];

/* =====================================
   PIECE DATA
===================================== */

let pieces = [];

/* =====================================
   DRAG DATA
===================================== */

let activePiece = null;

let dragElement = null;

/* =====================================
   CREATE PIECE
===================================== */

function createRandomPiece() {

    const shape =
        SHAPES[
            Math.floor(
                Math.random() *
                SHAPES.length
            )
        ];

    return {

        shape,

        color:getRandomColor()

    };
}

/* =====================================
   RENDER ONE PIECE
===================================== */

function renderPiece(holder,piece) {

    holder.innerHTML = "";

    const rows =
        Math.max(
            ...piece.shape.map(
                c => c[0]
            )
        ) + 1;

    const cols =
        Math.max(
            ...piece.shape.map(
                c => c[1]
            )
        ) + 1;

    holder.style.gridTemplateRows =
        `repeat(${rows},28px)`;

    holder.style.gridTemplateColumns =
        `repeat(${cols},28px)`;

    for(let row=0;row<rows;row++){

        for(let col=0;col<cols;col++){

            const cell =
                document.createElement("div");

            let filled =
                piece.shape.some(
                    p =>
                    p[0]===row &&
                    p[1]===col
                );

            if(filled){

                cell.className =
                    "piece-cell";

                cell.style.background =
                    piece.color;

                cell.style.color =
                    piece.color;

            }else{

                cell.style.visibility =
                    "hidden";
            }

            holder.appendChild(cell);
        }
    }
}

/* =====================================
   RENDER ALL PIECES
===================================== */

function renderPieces() {

    pieces.forEach((piece,index)=>{

        const holder =
            document.getElementById(
                `piece${index}`
            );

        renderPiece(
            holder,
            piece
        );

        holder.dataset.index =
            index;
    });

    initPieceEvents();
}

/* =====================================
   GENERATE SET
===================================== */

function generatePieces() {

    pieces = [

        createRandomPiece(),
        createRandomPiece(),
        createRandomPiece()

    ];

    renderPieces();
}

/* =====================================
   CREATE DRAG COPY
===================================== */

function createDragPiece(piece) {

    const drag =
        document.createElement("div");

    drag.className =
        "drag-piece";

    const rows =
        Math.max(
            ...piece.shape.map(
                p => p[0]
            )
        ) + 1;

    const cols =
        Math.max(
            ...piece.shape.map(
                p => p[1]
            )
        ) + 1;

    drag.style.gridTemplateRows =
        `repeat(${rows},28px)`;

    drag.style.gridTemplateColumns =
        `repeat(${cols},28px)`;

    for(let row=0;row<rows;row++){

        for(let col=0;col<cols;col++){

            const cell =
                document.createElement("div");

            const filled =
                piece.shape.some(
                    p =>
                    p[0]===row &&
                    p[1]===col
                );

            if(filled){

                cell.className =
                    "piece-cell";

                cell.style.background =
                    piece.color;

                cell.style.color =
                    piece.color;

            }else{

                cell.style.visibility =
                    "hidden";
            }

            drag.appendChild(cell);
        }
    }

    return drag;
}

/* =====================================
   START DRAG
===================================== */

function startDrag(index,x,y){

    activePiece = {

        index,

        ...pieces[index]

    };

    dragElement =
        createDragPiece(
            activePiece
        );

    document
        .getElementById("dragLayer")
        .appendChild(
            dragElement
        );

    moveDrag(x,y);
}

/* =====================================
   MOVE DRAG
===================================== */

function moveDrag(x,y){

    if(!dragElement) return;

    dragElement.style.left =
        x + "px";

    dragElement.style.top =
        y + "px";
}

/* =====================================
   END DRAG
===================================== */

function endDrag(){

    if(dragElement){

        dragElement.remove();

        dragElement = null;
    }

    activePiece = null;
}

/* =====================================
   EVENTS
===================================== */

function initPieceEvents(){

    document
    .querySelectorAll(
        ".piece-holder"
    )
    .forEach(holder=>{

        holder.onpointerdown =
        e=>{

            const index =
                Number(
                    holder.dataset.index
                );

            startDrag(
                index,
                e.clientX,
                e.clientY
            );
        };
    });
}

/* =====================================
   GLOBAL POINTER
===================================== */

window.addEventListener(
    "pointermove",
    e=>{

        if(!activePiece)
        return;

        moveDrag(
            e.clientX,
            e.clientY
        );
    }
);

window.addEventListener(
    "pointerup",
    handlePointerUp
);

/* =====================================
   START
===================================== */

generatePieces();

/* =====================================
   BLOCK BLAST NEON GLASS
   SCRIPT 3
   GAMEPLAY SYSTEM
===================================== */

const CELL_SIZE =
    parseInt(
        getComputedStyle(
            document.documentElement
        ).getPropertyValue(
            "--cell-size"
        )
    );

const CELL_GAP =
    parseInt(
        getComputedStyle(
            document.documentElement
        ).getPropertyValue(
            "--cell-gap"
        )
    );

/* =====================================
   PREVIEW DATA
===================================== */

let previewCells = [];
let previewRow = null;
let previewCol = null;

/* =====================================
   CLEAR PREVIEW
===================================== */

function clearPreview(){

    previewCells.forEach(cell=>{

        cell.classList.remove(
            "preview-valid",
            "preview-invalid"
        );

    });

    previewCells = [];
}

/* =====================================
   GET BOARD POSITION
===================================== */

function getBoardPosition(x,y){

    const rect =
        boardElement
        .getBoundingClientRect();

    if(
        x < rect.left ||
        x > rect.right ||
        y < rect.top ||
        y > rect.bottom
    ){
        return null;
    }

    const size =
        CELL_SIZE + CELL_GAP;

    const col =
        Math.floor(
            (x - rect.left) / size
        );

    const row =
        Math.floor(
            (y - rect.top) / size
        );

    return {row,col};
}

/* =====================================
   CAN PLACE
===================================== */

function canPlacePiece(
    piece,
    startRow,
    startCol
){

    for(const block of piece.shape){

        const row =
            startRow + block[0];

        const col =
            startCol + block[1];

        if(
            row < 0 ||
            row >= BOARD_SIZE ||
            col < 0 ||
            col >= BOARD_SIZE
        ){
            return false;
        }

        if(board[row][col]){
            return false;
        }
    }

    return true;
}

/* =====================================
   SHOW PREVIEW
===================================== */

function showPreview(x,y){

    clearPreview();

    if(!activePiece)
    return;

    const pos =
        getBoardPosition(x,y);

    if(!pos)
    return;

    previewRow = pos.row;
    previewCol = pos.col;

    const valid =
        canPlacePiece(
            activePiece,
            pos.row,
            pos.col
        );

    activePiece.shape.forEach(block=>{

        const row =
            pos.row + block[0];

        const col =
            pos.col + block[1];

        if(
            row < 0 ||
            row >= BOARD_SIZE ||
            col < 0 ||
            col >= BOARD_SIZE
        ){
            return;
        }

        const cell =
            getCell(row,col);

        cell.classList.add(
            valid
            ? "preview-valid"
            : "preview-invalid"
        );

        previewCells.push(cell);
    });
}

/* =====================================
   PLACE PIECE
===================================== */

function placePiece(){

    if(
        previewRow === null ||
        previewCol === null
    ){
        return false;
    }

    if(
        !canPlacePiece(
            activePiece,
            previewRow,
            previewCol
        )
    ){
        return false;
    }

    activePiece.shape.forEach(block=>{

        const row =
            previewRow + block[0];

        const col =
            previewCol + block[1];

        board[row][col] =
            activePiece.color;
    });

    addScore(
        activePiece.shape.length
    );

    pieces[
        activePiece.index
    ] = null;

    document.getElementById(
        `piece${activePiece.index}`
    ).innerHTML = "";

    renderBoard();

    checkLines();

    checkPieceRegeneration();

    return true;
}

/* =====================================
   CLEAR LINES
===================================== */

function checkLines(){

    let rows = [];
    let cols = [];

    for(let row=0;row<8;row++){

        let full = true;

        for(let col=0;col<8;col++){

            if(!board[row][col]){

                full = false;
                break;
            }
        }

        if(full)
            rows.push(row);
    }

    for(let col=0;col<8;col++){

        let full = true;

        for(let row=0;row<8;row++){

            if(!board[row][col]){

                full = false;
                break;
            }
        }

        if(full)
            cols.push(col);
    }

    if(
        rows.length === 0 &&
        cols.length === 0
    ){
        combo = 0;
        return;
    }

    rows.forEach(row=>{

        for(let col=0;col<8;col++){

            board[row][col] = null;
        }
    });

    cols.forEach(col=>{

        for(let row=0;row<8;row++){

            board[row][col] = null;
        }
    });

    combo++;

    const cleared =
        rows.length +
        cols.length;

    addScore(
        cleared * 25 * combo
    );

    showCombo(
        `COMBO x${combo}`
    );

    renderBoard();
}

/* =====================================
   REGENERATE PIECES
===================================== */

function checkPieceRegeneration(){

    const empty =
        pieces.every(
            p => p === null
        );

    if(empty){

        generatePieces();
    }

    checkGameOver();
}

/* =====================================
   GAME OVER
===================================== */

function checkGameOver(){

    for(const piece of pieces){

        if(!piece) continue;

        for(
            let row=0;
            row<BOARD_SIZE;
            row++
        ){

            for(
                let col=0;
                col<BOARD_SIZE;
                col++
            ){

                if(
                    canPlacePiece(
                        piece,
                        row,
                        col
                    )
                ){
                    return;
                }
            }
        }
    }

    showGameOver();
}

/* =====================================
   SHOW GAME OVER
===================================== */

function showGameOver(){

    document
        .getElementById(
            "finalScore"
        )
        .textContent =
        "Score : " + score;

    document
        .getElementById(
            "recordText"
        )
        .textContent =
        score >= highScore
        ? "NEW RECORD!"
        : "";

    document
        .getElementById(
            "gameOverModal"
        )
        .classList.add(
            "show"
        );
}

/* =====================================
   RESTART
===================================== */

document
.getElementById(
    "restartBtn"
)
.addEventListener(
    "click",
    ()=>{

        document
        .getElementById(
            "gameOverModal"
        )
        .classList.remove(
            "show"
        );

        resetGame();

        generatePieces();
    }
);

/* =====================================
   POINTER MOVE
===================================== */

window.addEventListener(
    "pointermove",
    e=>{

        if(!activePiece)
        return;

        showPreview(
            e.clientX,
            e.clientY
        );
    }
);

/* =====================================
   POINTER UP
===================================== */

function handlePointerUp(){

    if(!activePiece)
    return;

    placePiece();

    clearPreview();

    endDrag();
}