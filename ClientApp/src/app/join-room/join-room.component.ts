import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent implements OnInit{
    joinRoomForm : FormGroup;
    fb = inject(FormBuilder);

    ngOnInit(): void {
      this.joinRoomForm = this.fb.group({
        user: ['', Validators.required],
        room: ['', Validators.required]
      });
    }
}
