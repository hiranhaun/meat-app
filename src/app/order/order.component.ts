import { Component, OnInit } from '@angular/core';
import { RadioOption } from 'app/shared/radio/radio-option.model';
import { OrderService } from './order.service';
import { CartItem } from 'app/restaurant-detail/shopping-cart/cart-item.model';
import { Order, OrderItem } from './order.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { LoginService } from 'app/security/login/login.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: FormGroup;

  delivery: number = 8;

  orderId: string;

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  numberPattern = /^[0-9]*$/;

  paymentOptions: RadioOption[] = [
    {label: 'Dinheiro', value: 'MON'},
    {label: 'Cartão de Débito', value: 'DEB'},
    {label: 'Cartão Refeição', value: 'REF'}
  ];

  constructor(private orderService: OrderService, 
              private router: Router,
              private formBuilder: FormBuilder,
              private loginService: LoginService) { }

  ngOnInit() {
    this.orderForm = new FormGroup({
      name: this.formBuilder.control(''),
      email: this.formBuilder.control(''),
      emailConfirmation: this.formBuilder.control(''),
      address: new FormControl('', {validators: [Validators.required, Validators.minLength(5)]}),
      number: this.formBuilder.control('', [Validators.required, Validators.pattern(this.numberPattern)]),
      optionalAdress: this.formBuilder.control(''),
      paymentOption: this.formBuilder.control('', [Validators.required])
    }, {validators: [OrderComponent.equalsTo], updateOn: 'change'});

    const group: AbstractControl = this.orderForm;
    const name = group.get('name');
    const email = group.get('email');
    const emailConfirmation = group.get('emailConfirmation');

    if (!this.isLoggedIn()) {
      name.setValidators([Validators.required, Validators.minLength(5)]);
      email.setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
      emailConfirmation.setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
    } else {
      name.setValue(this.loginService.user.name);
      email.setValue(this.loginService.user.email);
      emailConfirmation.setValue(this.loginService.user.email);
    }
  }

  static equalsTo(group: AbstractControl): {[key: string]: boolean}  {
    const email = group.get('email');
    const emailConfirmation = group.get('emailConfirmation');
    if (!email || !emailConfirmation) {
      return undefined;
    }
    if (email.value != emailConfirmation.value) {
      return {emailsNotMatch: true};
    }
    return undefined;
  }

  itemsValue(): number {
    return this.orderService.itemsValue();
  }

  cartItems(): CartItem[] {
    return this.orderService.cartItems();
  }

  increaseQty(item: CartItem) {
    this.orderService.increaseQty(item);
  }

  decreaseQty(item: CartItem) {
    this.orderService.decreaseQty(item);
  }

  remove(item: CartItem) {
    this.orderService.remove(item);
  }

  checkOrder(order: Order) {
    order.orderItems = this.cartItems()
      .map((item:CartItem)=>new OrderItem(item.quantity, item.menuItem.id));
    this.orderService
      .checkOrder(order)
      .pipe(tap((orderId: string) => {
              this.orderId = orderId;
            }))
      .subscribe((orderId: string) => {
        this.router.navigate(['/order-summary'])
        this.orderService.clear();
      });
  }

  isOrderCompleted(): boolean {
    return this.orderId != undefined;
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }
}