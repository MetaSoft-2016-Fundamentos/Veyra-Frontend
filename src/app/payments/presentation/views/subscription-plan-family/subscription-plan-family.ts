import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-plan-family',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-plan-family.html',
  styleUrls: ['./subscription-plan-family.css']
})
export class SubscriptionPlanFamily {

  // Inyectamos el Router de Angular
  constructor(private router: Router) {}

  choosePlan(cycle: 'monthly' | 'annual') {
    // Navega a la ruta dinámica: /payments/checkout/family/monthly (o annual)
    this.router.navigate(['/payments/checkout', 'family', cycle]);
  }
}
