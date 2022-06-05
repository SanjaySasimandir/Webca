import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-four-zero-four',
  templateUrl: './four-zero-four.component.html',
  styleUrls: ['./four-zero-four.component.css']
})
export class FourZeroFourComponent implements OnInit {

  @Input() message: String = 'The page you are looking for was not found.';

  constructor() { }

  ngOnInit(): void {
  }

}
