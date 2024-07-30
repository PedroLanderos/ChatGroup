import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  
  chatService = inject(ChatService);
  inputMessage = "";
  messages:any[] = [];
  router = inject(Router);
  loggedInUserName = sessionStorage.getItem("user");
  roomName = sessionStorage.getItem("room");

  @ViewChild('scrollMe') private scrollContainer! : ElementRef;


  ngOnInit(): void {
      this.chatService.messages$.subscribe(res=>{
        this.messages = res
      });
  }

  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; 
  }

  sendMessage()
  {
    this.chatService.SendMessage(this.inputMessage).then(() =>
    {
      this.inputMessage = '';
    }).catch((error) =>
    {
      console.log(error);
      
    })
  }
  
  leaveChat(){
    this.chatService.LeaveChat().then(() =>
    {
      this.router.navigate(['welcome'])
      setTimeout(() => {
        location.reload();
      }, 0);
    }).catch((error) =>{
      console.log(error);
      
    })
  }

  
}
