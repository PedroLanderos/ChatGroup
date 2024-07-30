import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { sign } from 'crypto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  //stablish the connection with asp.net backend
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/chat")
  .configureLogging(signalR.LogLevel.Information)
  .build();

  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages : any[ ] = [];
  public users : string[] = [];

  constructor() {
    this.Start();
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {
      
      this.messages.push({ user, message, messageTime });
      
      this.messages$.next(this.messages); 
  });

    this.connection.on("ConnectedUser", (users:any) => {
      this.connectedUsers$.next(users); 
    })
   }

  public async Start()
  {
    try{
      await this.connection.start();
    }catch(error){
      console.log(error);
      
    }
  }

  //all the references to the methods name from the back end


  public async JoinRoom(user:string, room:string){
    return this.connection.invoke("JoinRoom", {user, room});
  }

  public async SendMessage(message:string)
  {
    return this.connection.invoke("SendMessage", message);
  }

  public async LeaveChat()
  {
    return this.connection.stop();
  }
}


