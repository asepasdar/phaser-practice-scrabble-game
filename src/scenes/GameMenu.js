import 'phaser';
import bgImg from "../assets/sprites/background.png";
import lobbyImg from "../assets/sprites/slot.png";
import refreshImg from "../assets/sprites/roll.png";
import lobbyData from "../assets/sprites/widget.png";
import cancelBtn from "../assets/sprites/cancelBtn.png";
import coverImg from "../assets/sprites/bg.png";
import guestImg from "../assets/sprites/person.png";
import noAvaImg from "../assets/sprites/noAva.png";
import profileName from "../assets/sprites/red.png";
import createLobby from "../assets/sprites/orange.png";
import config from "../config/config.js";

var background, coverBg, containerLobby, allLobbyList, waitLobby, containerLogin; //Container
var scene;
var rmName, guestName;
var soundLobby; // Keperluan suara
var apiControl; // Class ApiControl
var ipaddr = 'https://172.16.8.162:45456/';
var userId = 0, userNameText, token = "", fb_id = "";
export default class GameScene extends Phaser.Scene{

	constructor(){
		super('GameMenu');
		scene = this;
	}
	preload() {
		this.load.audio('sfxLobby', ["src/assets/audio/refreshLobby.wav"]);

		this.load.image("cancelBtn", cancelBtn);
		this.load.image("lobbyData", lobbyData);
		this.load.image("bg", bgImg);	
		this.load.image("bgLobby", lobbyImg);
		this.load.image("refresh", refreshImg);
		this.load.image("coverImg", coverImg);
		this.load.image("guestImg", guestImg);
		this.load.image("noAvaImg", noAvaImg);
		this.load.image("profileName", profileName);
		this.load.image("createLobby", createLobby);
	}
	create() {
		sessionStorage.removeItem('room_id');
		apiControl = new ApiControl();
		soundLobby = this.sound.add('sfxLobby');
		background = this.add.image(1000, 790, "bg");
		background.displayWidth = 2000;
		background.scaleY = background.scaleX;
		
		containerLobby = this.add.container(100, 790);
		allLobbyList = this.add.container(0, 0);
		waitLobby = this.add.container(100, 550);

		scene.drawLobby();
		scene.drawProfile();
		scene.drawWaitLobby();
		scene.drawloginPanel();
		waitLobby.setVisible(false);

		if(sessionStorage.getItem("user_id") != null)
			scene.setProfile();
		
	}
	setProfile(){
		containerLogin.setVisible(false);
		coverBg.setVisible(false);
		userNameText.text = sessionStorage.getItem("name");
	}
	drawProfile(){
		var avaContainer = this.add.container(300, 300);
		var avaPic = this.add.image(0, 0, "noAvaImg");
		avaPic.scaleX = .5;
		avaPic.scaleY = .5;

		var namePic = this.add.image(200, 10, "profileName");
		namePic.scaleX = .6;
		namePic.scaleY = .7;

		var style = { font: "30px toon", fill: "#ffffff", wordWrap: true, wordWrapWidth: namePic.displayWidth, align: "left" };
		userNameText = this.add.text(80, -15, "Player Name", style);


		avaContainer.add(namePic);
		avaContainer.add(avaPic);
		avaContainer.add(userNameText);
	}
	drawloginPanel(){
		coverBg = this.add.image(1000, 790, "coverImg");
		coverBg.displayWidth = 2000;
		coverBg.scaleY = coverBg.scaleX;
		coverBg.setAlpha(0.5);
		coverBg.setInteractive().on('pointerdown', function(){});

		containerLogin = this.add.container(1000, 790);

		var loginPanel = this.add.image(0, 0, "bgLobby");
		loginPanel.scaleX = 4;
		loginPanel.scaleY = 3;

		var guestIcon = this.add.image(-150, 50, "guestImg");
		guestIcon.scaleX = .5;
		guestIcon.scaleY = .5;


		var loginAsGuest = this.add.image(0, 50, "lobbyData");
		loginAsGuest.scaleY = .9;
		loginAsGuest.scaleX = .7;

		loginAsGuest.setInteractive().on('pointerdown', function(){
			var parameters = {
				"fb_id": "guest",
				"device_id": navigator.appVersion.toLowerCase(),
				"name": "Guest"+Math.floor(Math.random() * 1000000)
			};
			apiControl.postRequest(ipaddr+"api/facebook/0", parameters, returnValue => {
				returnValue = JSON.parse(returnValue);
				if(returnValue["id"] != 0){
					sessionStorage.setItem("user_id", returnValue["id"]);
					sessionStorage.setItem("name", returnValue["name"]);
					sessionStorage.setItem("token", returnValue["token"]);
					sessionStorage.setItem("fb_id", returnValue["fb_id"]);

					scene.setProfile();
				}
			});
		});

		var style = { font: "bold 35px Arial", fill: "#0c0c0c", wordWrap: true, wordWrapWidth: loginAsGuest.displayWidth, align: "center" };
		var guestText = this.add.text(-80, 28, "Login as Guest", style);

		containerLogin.add(loginPanel);
		containerLogin.add(loginAsGuest);
		containerLogin.add(guestText);
		containerLogin.add(guestIcon);
	}
	drawWaitLobby(){
		var bgLobby = this.add.image(230, 100, "bgLobby");
		bgLobby.displayWidth = 500;
		bgLobby.displayHeight = 300;

		var cancel = this.add.image(120, 180, "cancelBtn");
		cancel.scaleX = .8;
		cancel.scaleY = .8;
		cancel.setInteractive().on('pointerdown', function(){
			scene.deleteLobby();
		});

		var style = { font: "bold 30px Arial", fill: "#fff", wordWrap: true, wordWrapWidth: cancel.displayWidth, align: "center" };
		var cancelText = this.add.text(70, 160, "Cancel", style);

		waitLobby.add(bgLobby);
		waitLobby.add(cancel);
		waitLobby.add(cancelText);
		scene.drawRoomMaster();
		scene.drawChallenger();
	}
	drawRoomMaster(){
		var lobbyDataContainer = this.add.container(230, 20);
		var lobby = this.add.image(0, 0, "lobbyData");
		lobby.scaleX = .6;
		lobby.scaleY = .6;

		var style = { font: "bold 25px Arial", fill: "#000", wordWrap: true, wordWrapWidth: lobby.displayWidth/2, align: "center" };
		var style2 = { font: "bold 20px Arial", fill: "#000", wordWrap: true, wordWrapWidth: lobby.displayWidth/2, align: "right" };
		rmName = this.add.text(-180, -19, "Player 1", style);
		
		var roomPlayers = this.add.text(60, -15, "Room Master", style2);

		lobbyDataContainer.add(lobby);
		lobbyDataContainer.add(rmName);
		lobbyDataContainer.add(roomPlayers);


		waitLobby.add(lobbyDataContainer);
	}
	drawChallenger(){
		var lobbyDataContainer = this.add.container(230, 90);
		var lobby = this.add.image(0, 0, "lobbyData");
		lobby.scaleX = .6;
		lobby.scaleY = .6;

		var style = { font: "bold 25px Arial", fill: "#000", wordWrap: true, wordWrapWidth: lobby.displayWidth/2, align: "center" };
		var style2 = { font: "bold 20px Arial", fill: "#000", wordWrap: true, wordWrapWidth: lobby.displayWidth/2, align: "right" };
		guestName = this.add.text(-180, -19, "Player 2", style);
		
		var roomPlayers = this.add.text(80, -15, "Challenger", style2);

		lobbyDataContainer.add(lobby);
		lobbyDataContainer.add(guestName);
		lobbyDataContainer.add(roomPlayers);


		waitLobby.add(lobbyDataContainer);
	}
	drawLobby(){
		var bgLobby = this.add.image(230, 100, "bgLobby");
		bgLobby.displayWidth = 500;
		bgLobby.displayHeight = 700;

		var refreshBtn = this.add.image(70, -150, "refresh");
		refreshBtn.scaleX = .4;
		refreshBtn.scaleY = .4;

		var createLobbybtn = this.add.image(300, -150, "createLobby");
		createLobbybtn.scaleX = .4;
		createLobbybtn.scaleY = .5;

		var createText = this.add.text(220, -170, "Create Lobby", { font: "25px toon", fill: "#ffffff", wordWrap: true, wordWrapWidth: createLobby.displayWidth, align: "center" });

		refreshBtn.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
			soundLobby.play();
			apiControl.getRequest(ipaddr+'api/values', returnValue => {
				scene.listLobby(returnValue);
			});
		});

		createLobbybtn.setInteractive().on('pointerdown', function(){
			scene.createMyLobby();
		});


		containerLobby.add(bgLobby);
		containerLobby.add(refreshBtn);
		containerLobby.add(createLobbybtn);
		containerLobby.add(createText);
		containerLobby.add(allLobbyList);

		//Tampilkan data lobby terlebih dahulu jika ada
		apiControl.getRequest(ipaddr+'api/values', returnValue => {
			scene.listLobby(returnValue);
		});
	}
	listLobby(data){
		allLobbyList.removeAll();
		var posisiY = -50;
		data = JSON.parse(data);
		data.forEach(dataList => {
			var lobbyDataContainer = this.add.container(230, posisiY);
			var lobby = this.add.image(0, 0, "lobbyData");
			var countPlayers = dataList["user_guest"] == "1" ? "1/2" : "2/2";
			var color = dataList["user_guest"] == "1" ? "#000" : "#d41111";
			lobby.scaleX = .6;
			lobby.scaleY = .6;

			var style = { font: "bold 30px Arial", fill: color, wordWrap: true, wordWrapWidth: lobby.displayWidth/2, align: "center" };
			var roomName = this.add.text(-180, -19, "Room - "+dataList["id"], style);
			var roomPlayers = this.add.text(140, -19, countPlayers, style);
			
			lobbyDataContainer.setSize(lobby.displayWidth, lobby.displayHeight);
			lobbyDataContainer.customIdRoom = dataList["id"];


			if(dataList["user_guest"] == "1"){
				lobbyDataContainer.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
					scene.joinLobby(this);
				});
			}
			lobbyDataContainer.add(lobby);
			lobbyDataContainer.add(roomName);
			lobbyDataContainer.add(roomPlayers);
			allLobbyList.add(lobbyDataContainer);
			posisiY += 70;
		});
	}
	joinLobby(data){
		var today = new Date();
		var myDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

		var parameters = {
			"id": data.customIdRoom,
			"user_rm": 0,
			"user_guest": sessionStorage.getItem("user_id"),
			"status": 1, 
			"time_created": myDate
		};

		apiControl.postRequest(ipaddr+'api/values/'+data.customIdRoom, parameters, returnValue =>{
			sessionStorage.setItem("room_id", data.customIdRoom);
			returnValue = JSON.parse(returnValue);
			apiControl.getRequest(ipaddr+'api/user/'+returnValue["user_rm"], rmData =>{
				console.log(rmData);
				rmData = JSON.parse(rmData);
				rmName.text = String(rmData["name"]);

				apiControl.getRequest(ipaddr+'api/user/'+returnValue["user_guest"], guestData =>{
					console.log(guestData);
					guestData = JSON.parse(guestData);
					guestName.text = String(guestData["name"]);

					containerLobby.setVisible(false);
					waitLobby.setVisible(true);
					scene.readyToGo();
				});
			});
			
			
		});
	}
	postToAPI(){
		var parameters = {
			"id": 0,
			"user_rm": sessionStorage.getItem("user_id"),
			"user_guest": 1,
			"status": 1
		};
		apiControl.postRequest(ipaddr+'api/values', parameters, returnValue =>{
			returnValue = JSON.parse(returnValue);
			if(returnValue["id"] == 0){
				alert("Proses membuat room gagal");
				coverBg.setVisible(false);
			}
			else{
				sessionStorage.setItem("room_id", returnValue["id"]);
				scene.switchToWait();
				coverBg.setVisible(false);
			}
		});
	}
	switchToLobby(){
		waitLobby.setVisible(false);
		containerLobby.setVisible(true);
		sessionStorage.removeItem("room_id");

		apiControl.getRequest(ipaddr+'api/values/', returnValue =>{
			scene.listLobby(returnValue);
		});
	}
	switchToWait(){
		containerLobby.setVisible(false);
		rmName.text = sessionStorage.getItem("name");
		guestName.text = "-";
		waitLobby.setVisible(true);
	}
	createMyLobby(){
		coverBg.setVisible(true);
		var today = new Date();
		if(today.getSeconds() == 0) scene.postToAPI;
		else if(today.getSeconds() < 5) this.time.delayedCall(5000, scene.postToAPI, [], this);
		else{
			var helper = ((Math.round(today.getSeconds() / 5)) * 5) - today.getSeconds();
			if(helper < 0)
				this.time.delayedCall((helper + 5) * 1000, scene.postToAPI, [], this);
			else
				this.time.delayedCall(helper * 1000, scene.postToAPI, [], this);
		}
	}
	deleteLobby(){
		apiControl.deleteRequest(ipaddr+'api/values/'+sessionStorage.getItem('room_id'), returnValue =>{
			apiControl.getRequest(ipaddr+'api/values/'+sessionStorage.getItem('room_id'), rVal =>{
				rVal = JSON.parse(rVal);
				if(rVal["id"] == 0)
					scene.switchToLobby();
			});
		});
	}




	//Pindah Scene
	readyToGo(){
		var today = new Date();
		if(today.getSeconds() == 0) scene.pindah();
		else if(today.getSeconds() < 5) this.time.delayedCall(5000, scene.pindah, [], this);
		else{
			var helper = ((Math.round(today.getSeconds() / 5)) * 5) - today.getSeconds();
			if(helper < 0)
				this.time.delayedCall((helper + 5) * 1000, scene.pindah, [], this);
			else
				this.time.delayedCall(helper * 1000, scene.pindah, [], this);
		}
	}
	pindah(){
		this.scene.start('GameScene');
	}
}

class ApiControl{
	constructor(obj){
	}

	getRequest(url, callback){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.withCredentials = false;
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		request.setRequestHeader("token", "123123");
		request.setRequestHeader("game_version", "1.1");
		request.onreadystatechange = function() { 
			if (request.readyState == 4 && request.status == 200)
				callback(request.responseText);
		}

		
		request.send();
	}
	deleteRequest(url, callback){
		var request = new XMLHttpRequest();
		request.open('DELETE', url, true);
		request.withCredentials = false;
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		request.setRequestHeader("token", "123123");
		request.setRequestHeader("game_version", "1.1");
		request.onreadystatechange = function() { 
			if (request.readyState == 4 && request.status == 200)
				callback(request.responseText);
		}

		
		request.send();
	}
	postRequest(url, parameters, callback){
		var request = new XMLHttpRequest();
		
		var data = JSON.stringify(parameters);

		request.open('POST', url, true);
		request.withCredentials = false;
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		request.setRequestHeader("token", "123123");
		request.setRequestHeader("game_version", "1.1");
		request.onreadystatechange = function() { 
			if (request.readyState == 4 && request.status == 200)
				callback(request.responseText);
		}

		
		request.send(data);
	}
	
}

