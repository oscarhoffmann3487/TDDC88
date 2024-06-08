import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { Card } from '../Card';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent {

  card!: Card;

  constructor(@Inject('CardToken') card: Card) {

    this.card = card;

  }

  ngOnInit(): void {


  }

}