import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore,getFirestore, query, where, collection, collectionData, onSnapshot,addDoc,doc, updateDoc, deleteDoc, limit, orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{
  pickCardAnimation = false;
  game: Game = new Game();
  currentCard:string = "";
  firestore: Firestore = inject(Firestore);
  subGames = [];
  animal: string;
  name: string;

  unsubGames;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {  
    //this.subGamesList();
    this.newGame();
  }

  ngDestroy(){
    this.unsubGames();
  }

  getIDFromGame;

  subGamesList(){
    return onSnapshot(this.getGameRef(), (list) =>{
      this.subGames = [];
      list.forEach(element => {
        this.subGames.push(this.setGameObject(element.data()));
      });
      console.log(this.subGames);
    })
  }

  setGameObject(obj:any):Game{
    return {
      players: obj.players || [],
      stack: obj.stack || [],
      playerCard: obj.playerCard || [],
      currentPlayer: obj.currentPlayer || "",
    }

  }

  getGameRef(){
    return collection(this.firestore, "games");
  }

  async newGame(){
    this.game = new Game();
    console.log(this.game);
    let calId = "games";
    let item = this.setGameObject(this.game);
    this.addNewGame(item,calId);
  }

  async addNewGame(item: Game, calId:string){
    await addDoc(this.getGamesRef(calId), item).catch(
      (err) => { console.log(err) }
    );
  }

  getGamesRef(calId:string){
    return collection(this.firestore, calId);
  }
  takeCard(){
    if(!this.pickCardAnimation){
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() =>{
        this.game.playerCard.push(this.currentCard);
        this.pickCardAnimation = false;
      },1100);
      
    }
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
        this.game.players.push(name);
      }
    });
  }
}
