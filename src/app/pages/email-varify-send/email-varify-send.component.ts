import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../shared/global.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { timer } from 'rxjs';

@Component({
  selector: 'app-email-varify-send',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './email-varify-send.component.html',
  styleUrl: './email-varify-send.component.css',
})
export class EmailVarifySendComponent implements OnInit {
  email: any;
  isEmailSend: boolean = false;
  canResend: boolean = true;
  countdown: number = 60;
  constructor(
    private actRouter: ActivatedRoute,
    private global: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.actRouter.paramMap.subscribe((m: any) => {
      this.email = m.get('id');
    });
    console.log(this.email);
  }

  startCountdown() {
    const countdownTimer = timer(0, 1000);
    countdownTimer.subscribe((secondsElapsed: number) => {
      this.countdown = 60 - secondsElapsed;
      if (this.countdown <= 0) {
        this.canResend = true; // Enable the button after 60 seconds
      }
    });
  }

  emailSendCode(f: NgForm) {
    const body = {
      email: f.value.email,
      path: `http://localhost:4200/email-varify/${f.value.email}`,
    };
    this.isEmailSend = true;
    if (f.value.email !== '') {
      this.global.login(body, `auth/send-email-confirmation`).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastr.success('Varification Code Send', 'SEND');

          this.isEmailSend = true;
          this.canResend = false; // Disable the button

          setTimeout(() => {
            this.isEmailSend = false;
            this.startCountdown();
          }, 2000); // Simulate 2-second email sending delay
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.success(err.error.error.message, 'ERROR');
        },
      });
    }
  }
}
