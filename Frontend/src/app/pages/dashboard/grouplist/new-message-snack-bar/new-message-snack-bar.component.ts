import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-message-snack-bar',
  templateUrl: './new-message-snack-bar.component.html',
  styleUrls: ['./new-message-snack-bar.component.css']
})
export class NewMessageSnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data.res)
  }

}
