// JavaScript Document
$(document).ready(function () {
	const player = ['o','x'],
		  score = [0,0];
	
	let boardSize = 0, // Game Size (3 * 3)
		maxBoardSize = 10, // Max Board Size (10 * 10)
		minBoardSize = 3, // Min Board Size (10 * 10)
		currentPlayer = 0, // Current Player Playing
		moveCount = 0,
		formBoard = $('#formBoard'), // Form for updating Board size
		gameNotice = $('.game-notice'), // Notice Game
		game = $('#game'),
		stateOfTheGame = new Array(); // Default State of the Game
		
	
	
	//init StateOfTheGame
	function initStateOfTheGame(){
		stateOfTheGame = new Array(boardSize * 2 + 2);
		stateOfTheGame.fill(0)
	}

	//check Html is Empty
	function isEmpty(el){
		return !$.trim(el.html())
	}

	//check Max Square Size
	function getMaxSquareSize(){
		let	maxSize = 500,
			squareSize = 100; // Default squareSize
		
		if(boardSize * 100 > maxSize){
			squareSize = Math.floor(maxSize / boardSize);
		}

		return squareSize;
	}

	// Update Board Size
	function updateBoardSize(size){
		boardSize = size > maxBoardSize ? maxBoardSize : size < minBoardSize ? minBoardSize : size; // min-max game size
		initStateOfTheGame();
		makeBoard();
	}

	// Displaying the Board
	function makeBoard(){
		let squareSize = getMaxSquareSize(); // Square Size

		game.width(boardSize * squareSize);

		for(i = 0; i < boardSize; i++){
			for(j = 0; j < boardSize; j++){
				game.append('<li data-row='+ i +' data-col='+ j +'></li>');
			}
		}

		game.find('li')
			.width(squareSize)
			.height(squareSize);

		formBoard.fadeOut();
	}

	//check Game Win Condition
	function isTicTacToeWon (row, column, player) {
		// We will use -1 for 'O' and +1 for player 'X' 
		let point = (player == 0) ? -1 : 1
		
		// update row
		stateOfTheGame[row] += point

		// update column
		stateOfTheGame[boardSize + column] += point

		
		// update diagonal1
		if (row == column) {
			stateOfTheGame[2*boardSize] += point

		
			// case (2, 2) in 3 * 3 Board
			let shouldUpdateDia2 = (boardSize + 1) / 2 == column ? true : false;
		
			if ( shouldUpdateDia2 ) {
				stateOfTheGame[2*boardSize + 1] += point
			}
		}
		
		// update diagonal2
		if (row + column == boardSize + 1)
			stateOfTheGame[2*boardSize + 1] += point

		
		let i = stateOfTheGame.indexOf(boardSize)
		let j = stateOfTheGame.indexOf(-boardSize)
		let k = stateOfTheGame.indexOf(0);
		// console.log(stateOfTheGame, k);
		// check for the winner in all rows, columns, diagonals
		return (i >= 0 || j >= 0) ? true : false; 
		// check for the winner in all rows, columns, diagonals
		// return (i >= 0 || j >= 0) ? true : false 
	}

	// Show Winner Notice
	function showWinner(player){
		if(player !== 'Draw'){
			$('.notice').text('Player ' + player + ' win');
		}else{
			$('.notice').text('Draw');
		}
		$('.game-notice').fadeIn();
	}

	function showDraw(){
		$('.notice').text('Draw');
		$('.game-notice').fadeIn();
	}
	
	// Update the Score Board
	function updateScoreBoard(player){
		if(player === 0){
			score[0]++;
		}else{
			score[1]++;
		}

		$('#score-x').text(score[1]);
		$('#score-o').text(score[0])
	}

	//game play
	function move(e){
		const el = $(this),
			  row = el.data('row'),
			  col = el.data('col');
		
		moveCount++;
		console.log(moveCount, (boardSize * boardSize));
		
		if(isTicTacToeWon(row, col, currentPlayer)){
			showWinner(player[currentPlayer]);
			updateScoreBoard(currentPlayer);
		}else if(moveCount === (boardSize * boardSize)){
			showWinner('Draw');
		}

		if(isEmpty(el)){
			if(currentPlayer === 0){
				el.html(player[0]);
				currentPlayer++;
			}else{
				el.html(player[1]);
				currentPlayer--;
			}
		}

		
	}

	//Restarting Game
	function restartGame(){
		boardSize = 0;
		currentPlayer = currentPlayer ? 1 : 0; //switch player first turn
		stateOfTheGame = new Array();
		moveCount = 0;
		game.html(''); // reset game board;
		formBoard.fadeIn();
		gameNotice.fadeOut();
	}
	
	//Event Listener
	$('#play').on('click',function(){
		let size = parseInt($('#boardSize').val());
		updateBoardSize(size);
	});

	$('#game').on('click', 'li', move);
	$('#reset').on('click', restartGame);
});