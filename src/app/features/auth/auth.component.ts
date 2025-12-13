import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';


@Component({
  selector: 'app-auth',
  standalone:true,
  imports: [RouterModule,SpinnerComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
