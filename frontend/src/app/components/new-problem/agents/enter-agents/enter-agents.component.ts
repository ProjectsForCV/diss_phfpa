import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-enter-agents',
  templateUrl: './enter-agents.component.html',
  styleUrls: ['./enter-agents.component.css']
})
export class EnterAgentsComponent implements OnInit {

  public currentEmailInput: FormControl = new FormControl('');

  public emailList: Array<string> = [];

  constructor() { }

  public getEmails(): string[] {
    return this.emailList;
  }

  addEmail() {
    if (this.currentEmailInput.value && this.currentEmailInput.value !== '') {
      this.emailList.push(this.currentEmailInput.value);
    }
  }

  removeEmail(index) {

    this.emailList.splice(i);
  }
  ngOnInit() {
  }

}
