import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

import * as moment from 'moment';
import { distinctUntilChanged, filter, skipWhile, scan, takeWhile, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'rxjs-chat';
  message: string;
  messages: string[] = [];
  secretCode: string;
  endConversationCode: string;

  constructor(private chatService: ChatService) {
    this.secretCode = 'DO NOT TELL';
    this.endConversationCode = 'BYE';
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.chatService
      .getMessages()
      .pipe(
        distinctUntilChanged(),
        filter((message: string) => message.trim().length > 0),
        throttleTime(1000),
        takeWhile((message) => message !== this.endConversationCode),
        skipWhile((message) => message !== this.secretCode),
        scan((acc: string, message: string, index: number) => `${message}(${index + 1})`)
      )
      .subscribe((message: string) => {
        let currentTime = moment().format('hh:mm:ss a');
        let messageWithTimestamp = `${currentTime} : ${message}`;
        this.messages.push(messageWithTimestamp);
      })
  }
}
