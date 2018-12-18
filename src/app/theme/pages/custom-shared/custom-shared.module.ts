import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../../layouts/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    LayoutModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    NgbModule
  ],
  declarations: [CartComponent],
  exports : [CartComponent]
})
export class CustomSharedModule { }
