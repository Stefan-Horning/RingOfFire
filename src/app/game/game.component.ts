import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore,getFirestore, query, where, collection, collectionData, onSnapshot,addDoc,doc, updateDoc, deleteDoc, limit, orderBy } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getDoc } from "firebase/firestore";
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  game: Game = new Game();

  firestore: Firestore = inject(Firestore);
  subGames = [];
  animal:string;
  name: string;
  id:string;
  gameOver:boolean = false;

  constructor(private route: ActivatedRoute,public dialog: MatDialog) {}

  ngOnInit(): void {  
    this.route.params.subscribe((params) =>{
      console.log(params['id']);
      this.id = params['id'];
      this.getGame(params['id']);

      onSnapshot(doc(this.firestore, "games", params['id']), (doc) => {
        console.log("Current data: ", doc.data());
        let data = doc.data();
        let Json = this.setGameObject(data,params['id']);
        this.updateGame(Json);
      });
      
    });
    
    //this.newGame();
  }

  ngOnDestroy(){
    //this.unsubGames();
  }

  subGamesList(){
    return onSnapshot(this.getGameRef(), (list) =>{
      this.subGames = [];
      list.forEach(element => {
        this.subGames.push(this.setGameObject(element.data(), element.id));
      });
      
    })
  }

  async getGame(id:string){
    let getRef = this.getsingelDocRef('games',id);
    let docSnap = (await getDoc(getRef)).data();
    this.game.currentPlayer = docSnap['currentPlayer'] || 0;
    this.game.playerCard = docSnap['playerCard'];
    this.game.players = docSnap['players'];
    this.game.stack = docSnap['stack'];
    this.game.currentCard = docSnap['currentCard'];
    this.game.pickCardAnimation = docSnap['pickCardAnimation'];
    this.game.images = docSnap['images'];
    console.log(docSnap);
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
      images: obj.images || [],
    }

  }

  async updateGame(game: Game){
    if(this.id){
      let docRef = this.getsingelDocRef("games",this.id);
      await updateDoc(docRef, this.getCleanJson(game)).catch(
        (err) => { console.log(err); }
      );
      console.log('work');
      this.getGame(this.id);
    }
  }

  getCleanJson(game :Game): {} {
    return {
      players: game.players,
      stack: game.stack,
      playerCard: game.playerCard,
      currentPlayer: game.currentPlayer || 0,
      pickCardAnimation: game.pickCardAnimation,
      currentCard: game.currentCard,
      images : game.images,
    }
  }

  getsingelDocRef(colId:string, docId:string){
    return doc(collection(this.firestore, colId) ,docId)
  }

  getGameRef(){
    return collection(this.firestore, "games");
  }

  async newGame(){
    this.game = new Game();
    let calId = "games";
    let item = this.setGameObject(this.game, this.game.id);
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
    if(this.game.stack.length == 0){
      this.gameOver = true;
    }else if(!this.game.pickCardAnimation){
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateGame(this.game);

      setTimeout(() =>{
        this.game.playerCard.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.updateGame(this.game);
      },1100);
    }
    
    
  }

  editProfile(i: number){
    console.log(i);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if(change){
        if(change == 'DELETE'){
          this.game.players.splice(i,1);
        }else{
          this.game.images[i] = change;
          this.updateGame(this.game);
        }
        this.updateGame(this.game);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
        this.game.players.push(name);
        this.game.images.push('profile.png');
        this.updateGame(this.game);
      }
    });
  }

}
