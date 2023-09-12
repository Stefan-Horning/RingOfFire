import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{
  pickCardAnimation = false;
  game: Game = new Game();
  currentCard:string = "";
  
  constructor(){}

  ngOnInit(): void {  
    this.newGame();
  }

  newGame(){
    this.game = new Game();
    console.log(this.game);
  }

  takeCard(){
    if(!this.pickCardAnimation){
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard, this.game);
      this.pickCardAnimation = true;
      
      setTimeout(() =>{
        this.game.playerCard.push(this.currentCard);
        this.pickCardAnimation = false;
      },1100);
      
    }
    
  }
}
