import Phaser from "phaser";
import config from './config/config.js';
import GameScene from './scenes/GameScene';
import GameMenu from './scenes/GameMenu';

class Game extends Phaser.Game{
  constructor(){
    super(config);
    this.scene.add('GameMenu', GameMenu);
    this.scene.add('GameScene', GameScene);
    this.scene.start('GameMenu');
    //this.scene.start('GameScene');
  }
}

window.onload = function(){
  window.game = new Game();
  window.focus()
  resize();
  window.addEventListener("resize", resize, false);
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}