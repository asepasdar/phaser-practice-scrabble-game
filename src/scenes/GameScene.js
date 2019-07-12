import 'phaser';
import logoImg from "../assets/logo.png";
import tilesImg from "../assets/sprites/tile.png";
import letterImg from "../assets/sprites/letter.png";
import widgetImg from "../assets/sprites/widget.png";
import timerImg from "../assets/sprites/slot.png";
import timeImg from "../assets/sprites/time.png";
import arrowImg from "../assets/sprites/arrows.png";
import rollImg from "../assets/sprites/roll.png";
import playImg from "../assets/sprites/play.png";
import config from "../config/config.js";

var grid, playerControl, searchWords, timerContainer, playerTurn, playerPoint;
var timer, inputText, hasilPencarianText;
var dict;
var gridCols, wordCols;

var sfx, sfxPoint;

var gameControl;
var scene;

var myPointsText = "";
var myPoints = 0;
var setWord = [];
var isAlreadyInPoints = [];
var tileLetters = [
'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
'w', 'x', 'y', 'z' ];

var pointLetters = 
{
	'a': 1, 'b': 2, 'c': 3, 'd': 2, 'e': 1, 'f': 7, 
	'g': 2, 'h': 3, 'i': 1, 'j': 4, 'k': 6, 'l': 4,
	'm': 2, 'n': 1, 'o': 1, 'p': 4, 'q': 10, 'r': 2,
	's': 2, 't': 8, 'u': 2, 'v': 15, 'w': 12, 'x': 25,
	'y': 30, 'z': 40
};

var gameOptions = {
	gemSize: 100,
	boardOffset: {
		x: 50,
		y: 20
	},
	destroySpeed: 200,
	fallSpeed: 100,
	scaleSize: 75,
	wordSize: 70
}
export default class GameScene extends Phaser.Scene{

	constructor(){
		super('Game');
		scene = this;
	}
	preload() {
		this.load.audio('sfxOnDrop', ["src/assets/audio/chipsHandle4.ogg"]);
		this.load.audio('sfxPoint', ["src/assets/audio/gotPoints.wav"]);

		this.load.text('dictionary', 'src/resources/ospd.txt');
		this.load.image("logo", logoImg);
		this.load.spritesheet("tiles", tilesImg, {
			frameWidth: gameOptions.gemSize,
			frameHeight: gameOptions.gemSize
		});
		this.load.spritesheet("letter", letterImg, {
			frameHeight: gameOptions.gemSize,
			frameWidth: gameOptions.gemSize
		});
		this.load.image("widget", widgetImg);
		this.load.image("timer", timerImg);
		this.load.image("time", timeImg);
		this.load.image("arrow", arrowImg);
		this.load.image("roll", rollImg);
		this.load.image("play", playImg);
	}
	fileLoaded(progress){

	}
	create() {
		var html = this.cache.text.get('dictionary');
		dict = html.split('\n');
		sfx = this.sound.add('sfxOnDrop');
		sfxPoint = this.sound.add('sfxPoint');

		grid = this.add.container(400, 60);
		grid.setSize(1125, 1125);
		grid.setInteractive();
		playerControl = this.add.container(750, 1400);
		searchWords = this.add.container(1800, 300);
		timerContainer = this.add.container(200, 120);
		playerTurn = this.add.container(200, 250);
		playerPoint = this.add.container(200, 380);

		gameControl = new SameGame({
			rows: 15,
			columns: 15,
			items: 1
		});
		gameControl.generateBoard();
		this.drawField();

		this.drawSearchDic();
		this.drawTimer();
		this.drawTurn();
		this.drawPoint();
		this.drawDefaultLetter();
		this.canPick = true;

	}
	drawPoint(){
		var bg = this.add.sprite(0, 0, "timer");
		bg.displayWidth = 250;
		bg.displayHeight = 100;

		var style = { font: "bold 30px Arial", fill: "#58ecff", wordWrap: true, wordWrapWidth: bg.width, align: "center" };
		myPointsText = this.add.text(-90, -19, "Points : 0", style);

		playerPoint.add(bg);
		playerPoint.add(myPointsText);
	}
	drawTurn(){
		var bg = this.add.sprite(0, 0, "timer");
		bg.displayWidth = 250;
		bg.displayHeight = 100;

		var style = { font: "30px Arial", fill: "#fff", wordWrap: true, wordWrapWidth: bg.width, align: "center" };
		var text = this.add.text(-90, -19, "Player's Turn", style);

		playerTurn.add(bg);
		playerTurn.add(text);
	}
	drawTimer(){
		var bg = this.add.sprite(0, 0, "timer");
		bg.displayWidth = 250;
		bg.displayHeight = 100;

		var time = this.add.sprite(-60, 0, "time");
		time.scaleX = .8;
		time.scaleY = .8;

		var style = { font: "60px Arial", fill: "#fff", wordWrap: true, wordWrapWidth: bg.width, align: "center" };
		timer = this.add.text(10, -35, "99", style);

		timerContainer.add(bg);
		timerContainer.add(time);
		timerContainer.add(timer);
	}
	drawSearchDic(){
		var bg = this.add.image(0, 0, "widget");
		bg.displayWidth = 400;
		bg.displayHeight = 500;

		var arrow = this.add.sprite(150, -160, "arrow");
		arrow.displayWidth = 80;
		arrow.scaleY = arrow.scaleX;
		arrow.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
			if(dict.indexOf(inputText.text.toUpperCase()) > -1){
				hasilPencarianText.text = inputText.text + " is valid word";
				hasilPencarianText.setColor("#fff");
			}else{
				hasilPencarianText.text = inputText.text + " is not valid word";
				hasilPencarianText.setColor("#d62222");
			}
		});

		inputText = this.add.rexInputText(-1070, -245, 120, 30, config);
		inputText.placeholder = "Enter word here...";
		inputText.setStyle("color", "#000000");
		inputText.setStyle("backgroundColor", "#fff");
		inputText.setStyle("borderColor", "#9a9a9a");

		var style = { font: "30px Arial", fill: "#fff", wordWrap: true, wordWrap: { width: 300 }, align: "left" };
		hasilPencarianText = this.add.text(-180, -100, "", style);

		searchWords.add(bg);
		searchWords.add(arrow);
		searchWords.add(hasilPencarianText);
		searchWords.add(inputText);
	}
	drawDefaultLetter(){
		for(let i = 0; i < 6; i++){
			let gemX = gameOptions.wordSize * i + gameOptions.wordSize / 2;
			let gem = this.add.sprite(0, 0, "letter");
			gem.displayWidth = gameOptions.wordSize;
			gem.scaleY = gem.scaleX;
			var wordChar = tileLetters[Phaser.Math.Between(0, 25)];

			var style = { font: "bold 20px Arial", fill: "#f44336", wordWrap: true, wordWrap: { width: 100 }, align: "center" };
			var style2 = { font: "bold 40px Arial", fill: "#f44336", wordWrap: true, wordWrap: { width: 100 }, align: "center" };
			var score = this.add.text(10, -35, pointLetters[wordChar], style);
			var word = this.add.text(-18, -20, wordChar.toUpperCase(), style2);

			var wordContainer = this.add.container(gemX, 0);

			playerControl.add(wordContainer); //Masukan kedalam container playerControl
			setWord.push(wordContainer); //Masukan daftar word ini dalam 1 set

			wordContainer.add(gem);
			wordContainer.add(score);
			wordContainer.add(word);
			wordContainer.setSize(gameOptions.wordSize, gameOptions.wordSize);


			wordContainer.customDefaultx = wordContainer.x;
			wordContainer.customDefaulty = wordContainer.y;
			wordContainer.customWord = wordChar.toUpperCase(); //custom attribute huruf apa ini
			wordContainer.customPoint = pointLetters[wordChar];//custom attribute brp point huruf
			wordContainer.customParent = null; //Untuk menunjukan sedang berada di parent mana
			wordContainer.customSafeDrop = false; //untuk keberluan drag and drop
			wordContainer.customCanDrag = true; //sama dengan yang atas

			wordContainer.setInteractive({
				draggable: true
            }).on('drag', function(pointer, dragX, dragY){ //saat sedang di drag
            	if(this.customCanDrag){
            		this.x = dragX;
            		this.y = dragY;
            	}
            }).on('dragstart', function(pointer, dragX, dragY){
            	if(this.customParent != null){
            		var oldParent = this.customParent;
            		oldParent.customMyChild = null;
            		gameControl.setWord(oldParent.customRow, oldParent.customCol, "");
            		gameControl.setPoint(oldParent.customRow, oldParent.customCol, 0);
            	}
            }).on('dragend', function(pointer, dragX, dragY){
            	if(!this.customSafeDrop){
            		grid.remove(this);
            		playerControl.add(this);
            		if(this.customParent != null){
            			var oldParent = this.customParent;
            			oldParent.customMyChild = null;
            		}

            		this.customParent = null;
            		this.x = this.customDefaultx;
            		this.y = this.customDefaulty;
            	}
            }).on('drop', function(pointer, gameObject, target){
            	if(this.customCanDrag){
            		if(gameObject.customMyChild != null && gameObject.customMyChild.customCanDrag == false){
            			this.x = this.customDefaultx;
            			this.y = this.customDefaulty;
            		}else{
            			sfx.play();
            			grid.add(this);
	            		this.x = gameObject.x;
	            		this.y = gameObject.y;
	            		this.customParent = gameObject;
            			if(gameObject.customMyChild != null){
            				var oldChild = gameObject.customMyChild;
	            			grid.remove(oldChild); //Keluarkan dari container grid
	            			playerControl.add(oldChild); //Tambahkan ke playercontrol

	            			oldChild.x = oldChild.customDefaultx;
	            			oldChild.y = oldChild.customDefaulty;
            			}
            			gameObject.customMyChild = this;
	            		this.customParent = gameObject;
	            		gameControl.setWord(gameObject.customRow, gameObject.customCol, this.customWord);
	            		gameControl.setPoint(gameObject.customRow, gameObject.customCol, this.customPoint);
            		}
            		
            	}
            }).on('dragenter', function(pointer, target){
            	this.customSafeDrop = true;
            }).on('dragleave', function(pointer, target){
            	this.customSafeDrop = false;
            });
        }
        this.drawReRoll();
    }
    drawReRoll(){
    	//Membuat button reroll
    	var reroll = this.add.sprite(gameOptions.wordSize * 7, 0, "roll");
    	reroll.displayWidth = 80;
    	reroll.scaleY = reroll.scaleX;

    	var play = this.add.sprite(gameOptions.wordSize * 8.3, 0, "play");
    	play.displayWidth = 80;
    	play.scaleY = play.scaleX;


		//Aksi saat tombol re roll di tekan
		reroll.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
			scene.clearWord();
			scene.drawDefaultLetter();
		});

		//Aksi saat tombol submit ditekan
		play.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
			scene.submitWords();
		});

		playerControl.add(play);
		playerControl.add(reroll);
	}
	drawField(){
		var bg = this.add.image(560, 560, "widget");
		bg.displayWidth = 1200;
		bg.displayHeight = 1400;
		grid.add(bg);
		for(let i = 0; i < gameControl.getRows(); i ++){
			for(let j = 0; j < gameControl.getColumns(); j ++){
				let gemX = gameOptions.scaleSize * j + gameOptions.scaleSize / 2;
				let gemY = gameOptions.scaleSize * i + gameOptions.scaleSize / 2;
				let gem = this.add.sprite(gemX, gemY, "tiles", 0);
				gem.displayWidth = gameOptions.scaleSize;
				gem.scaleY = gem.scaleX;

    			gem.customRow = i; //Attribute untuk mengetahui baris dan kolom ke brp
    			gem.customCol = j; //Attribute untuk mengetahui baris dan kolom ke brp
    			gem.customMyChild = null; //Attribute untuk mengetahui jika dalam grid ada huruf
    			gem.setInteractive({ 
    				dropZone: true 
    			});
    			grid.add(gem);

    			gameControl.setWord(i, j, ""); //Set Data huruf di multidimens array
    			gameControl.setPoint(i, j, 0); //Set Data point di multidimens array
    		}
    	}
    }
    submitWords(){
    	var localPoint = 0;
    	setWord.forEach((item, index) =>{
    		if(item.customParent != null){
    			item.customCanDrag = false;
    			var parent = item.customParent;
    			localPoint += scene.checkForPoints(gameControl.polaKanan(parent.customRow, parent.customCol));
    			localPoint += scene.checkForPoints(gameControl.polaKiri(parent.customRow, parent.customCol));
    			localPoint += scene.checkForPoints(gameControl.polaBawah(parent.customRow, parent.customCol));
    			localPoint += scene.checkForPoints(gameControl.polaAtas(parent.customRow, parent.customCol));
    			localPoint += scene.checkForPoints(gameControl.polaKananBawah(parent.customRow, parent.customCol));
    			localPoint += scene.checkForPoints(gameControl.polaKiriAtas(parent.customRow, parent.customCol));
    		}
    	});
    	if(localPoint > 0)
    		sfxPoint.play();

    	myPoints = localPoint;
    	myPointsText.text = "Points : "+myPoints;
    	scene.clearWord();
    	scene.drawDefaultLetter();
    }

    checkForPoints(arrayParam){
    	if(isAlreadyInPoints.indexOf(arrayParam["words"]) == -1 && dict.indexOf(arrayParam["words"]) > -1){
    		isAlreadyInPoints.push(arrayParam["words"]);
    		return arrayParam["points"];
    	}
    	else
    		return 0;
    }
    update(){
    	//timer.text = 99 - Math.floor(this.time.now/1000);
    }
    clearWord(){
    	setWord.forEach((item, index) => {
    		if(item.customParent == null || item.customCanDrag == true)
    			item.destroy();
    	});
    	setWord = [];
    }
}
class SameGame{

    // constructor, simply turns obj information into class properties
    constructor(obj){
    	this.rows = obj.rows;
    	this.columns = obj.columns;
    	this.items = obj.items;
    }
    polaKananBawah(row, col){
    	var words = "";
    	var points = 0;
    	var endloop = col > row ? this.columns - col : this.rows - row;
    	var returnArray = {words: "", points: 0}

    	if(row == this.rows-1 || col == this.columns-1)
    		return returnArray;
    	else if(this.gameArray[row + 1][col + 1].word == "" || this.gameArray[row][col].word == "")
    		return returnArray;
    	else{
    		for(let i =0; i < endloop; i++){
    			if(this.gameArray[row][col].word != ""){
    				words += this.gameArray[row][col].word;
	    			points += this.gameArray[row][col].point;
	    			row++;
	    			col++;
    			}else{
    				break;
    			}
    		}
    	}
    	returnArray["words"] = words;
	    returnArray["points"] = points;

	    return returnArray;
    }
    polaKiriAtas(row, col){
    	var words = "";
    	var points = 0;
    	var endloop = col > row ? row : col;
    	var returnArray = {words: "", points: 0}

    	if(row == 0 || col == 0)
    		return returnArray;
    	else if(this.gameArray[row - 1][col - 1].word == "" || this.gameArray[row][col].word == "")
    		return returnArray;
    	else{
    		for(let i =0; i < endloop; i++){
    			if(this.gameArray[row][col].word != ""){
    				words = this.gameArray[row][col].word + words;
	    			points += this.gameArray[row][col].point;
	    			row--;
	    			col--;
    			}else{
    				break;
    			}
    		}
    	}
    	returnArray["words"] = words;
	    returnArray["points"] = points;

	    return returnArray;
    }
    polaKanan(row, col){
    	var words = "";
    	var points = 0;
    	var returnArray = {words: "", points: 0}
    	if(col == this.columns-1)
    		return returnArray;
    	else if(this.gameArray[row][col + 1].word == "" || this.gameArray[row][col].word == "")
    		return returnArray;

    	else{
	    	for(let i = col; i < this.columns; i++){
	    		if(this.gameArray[row][i].word != ""){
	    			words += this.gameArray[row][i].word;
	    			points += this.gameArray[row][i].point;
	    		}else{
	    			break;
	    		}
	    	}
	    }
	    returnArray["words"] = words;
	    returnArray["points"] = points;

	    return returnArray;
    }
    polaKiri(row, col){
    	var words = "";
    	var points = 0;
    	var returnArray = {words: "", points: 0}
    	if(col == 0)
    		return returnArray;
    	else if(this.gameArray[row][col - 1].word == "" || this.gameArray[row][col].word == "")
    		return returnArray;

    	else{
	    	for(let i = col; i >= 0; i--){
	    		if(this.gameArray[row][i].word != ""){
	    			words = this.gameArray[row][i].word + words;
	    			points += this.gameArray[row][i].point;
	    		}else{
	    			break;
	    		}
	    	}
	    }
	    returnArray["words"] = words;
	    returnArray["points"] = points;

	    return returnArray;
    }
    polaBawah(row, col){
    	var words = "";
    	var points = 0;
    	var returnArray = {words: "", points: 0}
    	if(row == this.rows - 1)
    		return returnArray;
    	else if(this.gameArray[row + 1][col].word == "" || this.gameArray[row][col].word == "")
    		return returnArray;

    	else{
	    	for(let i = row; i < this.rows; i++){
	    		if(this.gameArray[i][col].word != ""){
	    			words += this.gameArray[i][col].word;
	    			points += this.gameArray[i][col].point;
	    		}else{
	    			break;
	    		}
	    	}
	    }
	    returnArray["words"] = words;
	    returnArray["points"] = points;

	    return returnArray;
    }
    polaAtas(row, col){
    	var words = "";
    	var points = 0;
    	var returnArray = {words: "", points: 0}
    	if(row == 0)
    		return returnArray;
    	else if(this.gameArray[row - 1][col].word == "" || this.gameArray[row][col].word == "")
    		return returnArray;

    	else{
	    	for(let i = row; i >= 0; i--){
	    		if(this.gameArray[i][col].word != ""){
	    			words = this.gameArray[i][col].word + words;
	    			points += this.gameArray[i][col].point;
	    		}else{
	    			break;
	    		}
	    	}
	    }
	    returnArray["words"] = words;
	    returnArray["points"] = points;

	    return returnArray;
    }

    // generates the game board
    generateBoard(){
    	this.gameArray = [];
    	for(let i = 0; i < this.rows; i ++){
    		this.gameArray[i] = [];
    		for(let j = 0; j < this.columns; j ++){
    			this.gameArray[i][j] = {
    				word: "",
    				point: 0,
    				row: i,
    				column: j
    			}
    		}
    	}
    }

    getAll(){
    	return this.gameArray;
    }
    // returns the number of board rows
    getRows(){
    	return this.rows;
    }

    // returns the number of board columns
    getColumns(){
    	return this.columns;
    }
    validPick(row, column){
    	return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    getPoint(row, column){
    	if(!this.validPick(row, column)){
    		return false;
    	}
    	return this.gameArray[row][column].point;
    }
    // sets a custom data on the item at (row, column)
    setPoint(row, column, customData){
    	this.gameArray[row][column].point = customData;
    }

    getWord(row, column){
    	if(!this.validPick(row, column)){
    		return false;
    	}
    	return this.gameArray[row][column].word;
    }
    // sets a custom data on the item at (row, column)
    setWord(row, column, customData){
    	this.gameArray[row][column].word = customData;
    }
}




