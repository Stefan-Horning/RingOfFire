import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Firestore,getFirestore, query, where, collection, collectionData, onSnapshot,addDoc,doc, updateDoc, deleteDoc, limit, orderBy } from '@angular/fire/firestore';
import { Game } from 'src/models/game';
import { inject } from '@angular/core';
@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit{

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router){
    
  }

  ngOnInit(){

  }

  newGame(){
    let game = new Game();
    let calId = "games";
    let item = this.setGameObject(game, game.id);
    this.addNewGame(item,calId)
    
  }

  async addNewGame(item: Game, calId:string){
    await addDoc(this.getGamesRef(calId), item).catch(
      (err) => { console.log(err) }
    ).then((gamesInfo:any) =>{
      this.router.navigateByUrl('/game/' + gamesInfo.id);
    })
  }

  getGamesRef(calId:string){
    return collection(this.firestore, calId);
  }

  setGameObject(obj:any, id:string):Game{
    return {
      id: id, 
      players: obj.players || [],
      stack: obj.stack || [],
      playerCard: obj.playerCard || [],
      currentPlayer: obj.currentPlayer || 0,
      currentCard: obj.currentCard,
      pickCardAnimation: obj.pickCardAnimation,
    }
  }
}
