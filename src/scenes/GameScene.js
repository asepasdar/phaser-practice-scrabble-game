import 'phaser';
import logoImg from "../assets/logo.png";
import tilesImg from "../assets/sprites/tile.png";
import letterImg from "../assets/sprites/letter.png";
import widgetImg from "../assets/sprites/widget.png";
import timerImg from "../assets/sprites/slot.png";
import timeImg from "../assets/sprites/time.png";
import arrowImg from "../assets/sprites/arrows.png";
import config from "../config/config.js";

var grid, playerControl, searchWords, timerContainer, playerTurn;
var timer, inputText, hasilPencarianText;
var dict;

var tileLetters = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
            'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z' ];

var pointLetters = {'a': 1, 'b': 20};

var gameOptions = {
    gemSize: 100,
    boardOffset: {
        x: 50,
        y: 20
    },
    destroySpeed: 200,
    fallSpeed: 100,
    scaleSize: 75
}
export default class GameScene extends Phaser.Scene{

	constructor(){
		super('Game');
	}
	preload() {
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
	}
	fileLoaded(progress){

	}
	create() {
		this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
	        gameObject.x = dragX;
	        gameObject.y = dragY;
    	});
		var html = this.cache.text.get('dictionary');
    	dict = html.split('\n');
	  	
	  	grid = this.add.container(400, 60);
        playerControl = this.add.container(750, 1400);
        searchWords = this.add.container(1800, 300);
        timerContainer = this.add.container(200, 120);
        playerTurn = this.add.container(200, 250);
        
        this.sameGame = new SameGame({
            rows: 15,
            columns: 15,
            items: 1
        });
        this.sameGame.generateBoard();
        this.drawField();
        this.drawDefaultLetter();
        this.drawSearchDic();
        this.drawTimer();
        this.drawTurn();
        this.canPick = true;
        this.input.on("pointerdown", this.tileSelect, this);
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
        arrow.name = "searchBtn";
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

        inputText = this.add.rexInputText(-720, -240, 120, 30, config);
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
    test(){
    	console.log("click me bro");
    }
    drawDefaultLetter(){
        for(let i = 0; i < 6; i++){
        	let gemX = gameOptions.scaleSize * i + gameOptions.scaleSize / 2;
        	let gem = this.add.sprite(0, 0, "letter");
        	gem.displayWidth = gameOptions.scaleSize;
            gem.scaleY = gem.scaleX;

            var style = { font: "bold 20px Arial", fill: "#f44336", wordWrap: true, wordWrap: { width: 100 }, align: "center" };
        	var score = this.add.text(10, -35, "12", style);

        	var style2 = { font: "bold 40px Arial", fill: "#f44336", wordWrap: true, wordWrap: { width: 100 }, align: "center" };
        	var word = this.add.text(-15, -20, tileLetters[Phaser.Math.Between(0, 25)].toUpperCase(), style2);

        	var wordContainer = this.add.container(gemX, 0);

        	playerControl.add(wordContainer);
            wordContainer.add(gem);
            wordContainer.add(score);
            wordContainer.add(word);
            wordContainer.setSize(75, 75);
            wordContainer.setInteractive({
            	draggable: true
            }).on('drag', function (pointer, wordContainer, dragX, dragY){
            	console.log(wordContainer.x);
            });
        }
    }
    drawField(){
    	var bg = this.add.image(560, 560, "widget");
    	bg.displayWidth = 1200;
    	bg.displayHeight = 1400;
    	grid.add(bg);
        for(let i = 0; i < this.sameGame.getRows(); i ++){
            for(let j = 0; j < this.sameGame.getColumns(); j ++){
                let gemX = gameOptions.scaleSize * j + gameOptions.scaleSize / 2;
                let gemY = gameOptions.scaleSize * i + gameOptions.scaleSize / 2;
                let gem = this.add.sprite(gemX, gemY, "tiles", this.sameGame.getValueAt(i, j));
                gem.displayWidth = gameOptions.scaleSize;
                gem.scaleY = gem.scaleX;
                grid.add(gem);
                this.sameGame.setCustomData(i, j, gem);
            }
        }
    }
    tileSelect(pointer){
        console.log("tile di sentuh");
    }
    onSearchBtn(){

    }
}
class SameGame{

    // constructor, simply turns obj information into class properties
    constructor(obj){
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
    }

    // generates the game board
    generateBoard(){
        this.gameArray = [];
        for(let i = 0; i < this.rows; i ++){
            this.gameArray[i] = [];
            for(let j = 0; j < this.columns; j ++){
                let randomValue = Math.floor(Math.random() * this.items);
                this.gameArray[i][j] = {
                    value: randomValue,
                    isEmpty: false,
                    row: i,
                    column: j
                }
            }
        }
    }

    // returns the number of board rows
    getRows(){
        return this.rows;
    }

    // returns the number of board columns
    getColumns(){
        return this.columns;
    }

    // returns true if the item at (row, column) is empty
    isEmpty(row, column){
        return this.gameArray[row][column].isEmpty;
    }

    // returns the value of the item at (row, column), or false if it's not a valid pick
    getValueAt(row, column){
        if(!this.validPick(row, column)){
            return false;
        }
        return this.gameArray[row][column].value;
    }

    // returns the custom data of the item at (row, column)
    getCustomDataAt(row, column){
        return this.gameArray[row][column].customData;
    }

    // returns true if the item at (row, column) is a valid pick
    validPick(row, column){
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    // sets a custom data on the item at (row, column)
    setCustomData(row, column, customData){
        this.gameArray[row][column].customData = customData;
    }

    // returns an object with all connected items starting at (row, column)
    listConnectedItems(row, column){
        if(!this.validPick(row, column) || this.gameArray[row][column].isEmpty){
            return;
        }
        this.colorToLookFor = this.gameArray[row][column].value;
        this.floodFillArray = [];
        this.floodFillArray.length = 0;
        this.floodFill(row, column);
        return this.floodFillArray;
    }

    // returns the number of connected items starting at (row, column)
    countConnectedItems(row, column){
        return this.listConnectedItems(row, column).length;
    }

    // removes all connected items starting at (row, column)
    removeConnectedItems(row, column){
        let items = this.listConnectedItems(row, column);
        items.forEach(function(item){
            this.gameArray[item.row][item.column].isEmpty = true;
        }.bind(this))
    }

    // swap the items at (row, column) and (row2, column2)
    swapItems(row, column, row2, column2){
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
    }
}




