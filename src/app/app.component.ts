import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationStart, Router, Event as RouterEvent, RouterOutlet, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '';
  public base = '';
  public page = '';
  constructor(private router: Router, private titleService: Title) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        const URL = event.url.split('/');
        this.base =URL[1] ? URL[1].replace('-',' '): '';
        this.page = URL[2] ? URL[2].replace('-',' '): '';
      }
      if(this.base === 'index'){
        this.page = 'Deals Dashboard'
      }
      if(this.base === 'lead dashboard' || this.base === 'project dashboard'
        ||this.base ==='pipeline' || this.base === 'payments' ||this.base === 'analytics' ||this.base === 'sources'
        ||this.base ==='lost reason' || this.base === 'contact stage' ||this.base === 'industry' ||this.base === 'calls'
        ||this.base ==='manage users' || this.base === 'roles permissions' ||this.base === 'permission' ||this.base === 'delete request'
        ||this.base ==='pages' || this.base === 'roles permissions' ||this.base === 'testimonials' ||this.base === 'faq'
        ||this.base ==='contact messages' || this.base === 'tickets' ||this.base === 'testimonials' ||this.base === 'faq'
        ||this.base ==='login' || this.base === 'forgot password' ||this.base === 'email verification' ||this.base === 'two step verification'
        ||this.base ==='reset password' || this.base === 'coming soon' ||this.base === 'under maintenance' 
        ||this.base ==='layout fullwidth' || this.base === 'layout hoverview' ||this.base === 'layout rtl' 
        ||this.base ==='layout mini' || this.base === 'layout hidden' ||this.base === 'layout dark' 
        ||this.base ==='notifications' 
      ){
        this.page = this.base
      }
      
      // Update page title on navigation end
      if (event instanceof NavigationEnd) {
        // Check if page looks like a GUID or ID parameter (contains mostly hex chars and spaces from replaced dashes)
        const isGuidOrId = /^[0-9a-f\s-]{20,}$/i.test(this.page) || /^[0-9]+$/.test(this.page) || this.page === '';
        const pageName = isGuidOrId ? this.base : (this.page || this.base || 'Home');
        const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        this.titleService.setTitle(`Business - ${formattedName}`);
      }
    });
  }
}
