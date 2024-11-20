import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirmed',
  standalone: true,
  imports: [],
  templateUrl: './confirmed.component.html',
  styleUrls: ['./confirmed.component.css']
})
export class ConfirmedComponent implements OnInit {

  isConfirm: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Accessing the query parameter from the route
    this.route.queryParams.subscribe(params => {
      const emailConfirm = params['email-confirm'];  // Extract ?email-confirm=true

      if (emailConfirm === 'true') {
        this.isConfirm = true;
      } else if (emailConfirm === 'false') {
        this.isConfirm = false;
      }

      // Set timeout for redirection after 30 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);  // Redirect to /login after 30 seconds
      }, 3000);  // 30 seconds in milliseconds
    });
  }
}
