import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { RouterLink } from '@angular/router';
import { routes } from '../../../../shared/routes/routes';
import { IApiResponse, IApiResponseWithList } from '../../../../core/models/shared.dto';
import { SharedService } from '../../../../core/services/shared.service';

export interface ICard {
  id: number;
  title: string;
  amount: number;
  description: string;
  order: number;
}

export interface IAddCard {
  title: string;
  amount: number;
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
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.generateFakeCards();
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
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
        amount: 9.99,
        description: 'Essential features for individuals',
        order: 1
      },
      {
        id: 2,
        title: 'Professional Plan',
        amount: 29.99,
        description: 'Advanced features for professionals',
        order: 2
      },
      {
        id: 3,
        title: 'Enterprise Plan',
        amount: 99.99,
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
      amount: '',
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
    const newCard: ICard = {
      id: Math.max(...this.cards.map(c => c.id), 0) + 1,
      title: values.title,
      amount: values.amount,
      description: values.description,
      order: this.cards.length + 1
    };

    this.cards.push(newCard);
    const offcanvas = document.getElementById('offcanvas_add');
    if (offcanvas) {
      (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
    }
    this.sharedService.handleResponse({ status: 200, message: 'Card added successfully', data: null, errors: [], errorCode: null });
    this.resetForm();
  }

  editCard(): void {
    if (!this.selectedCardForEdit) return;

    const values = this.cardForm.value;
    const cardIndex = this.cards.findIndex(c => c.id === this.selectedCardForEdit);

    if (cardIndex > -1) {
      this.cards[cardIndex] = {
        ...this.cards[cardIndex],
        title: values.title,
        amount: values.amount,
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
        amount: card.amount,
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
    debugger
    if ((event.previousIndex !== event.currentIndex) && (event.previousIndex > event.currentIndex)) {
      const card = this.cards[event.previousIndex];
      this.cards.splice(event.previousIndex, 1);
      this.cards.splice(event.currentIndex, 0, card);
      this.updateCardOrder();
    }
  }

  private updateCardOrder(): void {
    this.cards.forEach((card, index) => {
      card.order = index + 1;
    });
  }
}
