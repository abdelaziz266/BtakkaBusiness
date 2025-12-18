import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../../shared/routes/routes';
import { IApiResponse, IApiResponseWithList } from '../../../../core/models/shared.dto';
import { SharedService } from '../../../../core/services/shared.service';
import { PlansService } from '../../../../core/services/plans.service';
import { IGetPlansDTO } from '../../../../core/models/plans.dto';

export interface ICard {
  id: number;
  title: string;
  value: number;
  description: string;
  order: number;
}

export interface IAddCard {
  title: string;
  value: number;
  description: string;
}

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DragDropModule, RouterLink],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.scss'
})
export class PlanesComponent implements OnInit, AfterViewInit {
  @ViewChild('offcanvasAdd', { static: false }) offcanvasAdd!: ElementRef;
  @ViewChild('offcanvasEdit', { static: false }) offcanvasEdit!: ElementRef;

  routes = routes;
  cards: ICard[] = [];
  cardForm!: FormGroup;
  isEditMode: boolean = false;
  selectedCardForEdit: number | null = null;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private plansService: PlansService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPlans();
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });
  }

  private loadPlans(): void {
    this.plansService.getPlans().subscribe({
      next: (response: IApiResponse<IGetPlansDTO[]>) => {
        if (response.data) {
          // Map API response to ICard with fake order if not present
          this.cards = response.data.map((plan: IGetPlansDTO, index: number) => ({
            id: plan.id,
            title: plan.title,
            value: plan.value || 0,
            description: plan.description,
            order: plan.order || index + 1  // Use order from API or generate fake one
          }));
        }
        debugger
      },
      error: (error) => {
        console.error('Failed to load plans', error);
        // Fallback to fake data if API fails
        this.generateFakeCards();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.offcanvasAdd && this.offcanvasAdd.nativeElement) {
      this.offcanvasAdd.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
        this.resetForm();
      });
    }

    if (this.offcanvasEdit && this.offcanvasEdit.nativeElement) {
      this.offcanvasEdit.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
        this.resetForm();
      });
    }
  }

  private generateFakeCards(): void {
    this.cards = [
      {
        id: 1,
        title: 'Basic Plan',
        value: 9.99,
        description: 'Essential features for individuals',
        order: 1
      },
      {
        id: 2,
        title: 'Professional Plan',
        value: 29.99,
        description: 'Advanced features for professionals',
        order: 2
      },
      {
        id: 3,
        title: 'Enterprise Plan',
        value: 99.99,
        description: 'Full features for large teams',
        order: 3
      }
    ];
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedCardForEdit = null;
    this.cardForm.reset({
      title: '',
      value: '',
      description: ''
    });
  }

  submitForm(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      this.cardForm.updateValueAndValidity();
      return;
    }

    if (this.isEditMode && this.selectedCardForEdit) {
      this.editCard();
    } else {
      this.createCard();
    }
  }

  createCard(): void {
    const values = this.cardForm.value;
    const newCard: IAddCard = {
      title: values.title,
      value: values.value,
      description: values.description,
    };

    this.plansService.createPlan(newCard).subscribe({
      next: (response: IApiResponse<IGetPlansDTO>) => {
        this.loadPlans();
        const offcanvas = document.getElementById('offcanvas_add');
        if (offcanvas) {
          (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
        }
        this.sharedService.handleResponse({ status: response.status, message: response.message, data: null, errors: [], errorCode: null });
        this.resetForm();
      },
      error: (error) => {
        this.sharedService.handleResponse({ status: 500, message: 'Failed to add card', data: null, errors: [error], errorCode: null });
      }
    });
  }

  editCard(): void {
    if (!this.selectedCardForEdit) return;

    const values = this.cardForm.value;
    const cardIndex = this.cards.findIndex(c => c.id === this.selectedCardForEdit);

    if (cardIndex > -1) {
      this.cards[cardIndex] = {
        ...this.cards[cardIndex],
        title: values.title,
        value: values.value,
        description: values.description
      };

      const offcanvas = document.getElementById('offcanvas_edit');
      if (offcanvas) {
        (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
      }
      this.sharedService.handleResponse({ status: 200, message: 'Card updated successfully', data: null, errors: [], errorCode: null });
      this.resetForm();
    }
  }

  openEditModal(cardId: number): void {
    this.isEditMode = true;
    this.selectedCardForEdit = cardId;
    const card = this.cards.find(c => c.id === cardId);
    if (card) {
      this.cardForm.patchValue({
        title: card.title,
        value: card.value,
        description: card.description
      });
    }
  }

  deleteCard(cardId: number): void {
    const cardIndex = this.cards.findIndex(c => c.id === cardId);
    if (cardIndex > -1) {
      this.cards.splice(cardIndex, 1);
      this.updateCardOrder();
      this.sharedService.handleResponse({ status: 200, message: 'Card deleted successfully', data: null, errors: [], errorCode: null });
    }
  }

  drop(event: CdkDragDrop<ICard[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;
      
      // Use CDK's moveItemInArray for proper reordering
      moveItemInArray(this.cards, previousIndex, currentIndex);
      this.updateCardOrder();
    }
  }

  private updateCardOrder(): void {
    this.cards.forEach((card, index) => {
      card.order = index + 1;
    });
  }

  navigateToContractRequest(planId: number): void {
    this.router.navigate([routes.ContractRequest], { state: { planId: planId } });
  }

}
