import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {
  profiles = ['profile.png','profile2.jpg','profile3.jpg','profile4.jpg'];
  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}
  
  onNoClick(): void{
    this.dialogRef.close();
  }

}
