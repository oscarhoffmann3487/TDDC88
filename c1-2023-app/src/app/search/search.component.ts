import { Component, ViewChild, ElementRef } from '@angular/core';
import { CardComponent } from '../card/card.component';
import * as $ from 'jquery';
import { Card } from '../Card';
import { CardList } from '../Card';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  //for clearing filters
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  @ViewChild('clinic') clinicRef!: ElementRef;
  @ViewChild('center') centerRef!: ElementRef;
  @ViewChild('place') placeRef!: ElementRef;
  @ViewChild('PDSA') pdsaRef!: ElementRef;
  @ViewChild('starttime') starttimeRef!: ElementRef;
  @ViewChild('endtime') endtimeRef!: ElementRef;
  @ViewChild('finished') finishedRef!: ElementRef;

  card!: Card;
  cardList: CardList = [];
  dropDown: boolean = false;

  constructor() { }

  ngOnInit(): void {

    this.search('', '','', '', '', '', '', ''); 

  }

  showCard() {
    new CardComponent(this.card);
    this.cardList.push(this.card);
  }

  search(searchWord: any, clinic: any, PDSA: any, center: any, place: any, starttime: any,endtime: any, finished: any ) {

    this.cardList = [];

    const url = "http://127.0.0.1:8000/Improvment/CombinedImprovmentWork";

    const data = {
      keyword: searchWord,
      clinic_name: clinic,
      center_name: center,
      pdsa: PDSA,
      place_name: place,
      start_timestamp: starttime,
      end_timestamp: endtime,
      finished: finished
    }

    $.get(url, data, (result: any) => {

      for (var res of result) {
        if(res.published){
          if (res.responsible_user != null) {
            this.card = {
              owner_id:res.responsible_user.has_id,
              owner: {
                auth_lvl: res.responsible_user.auth_lvl,
                first_name: res.responsible_user.first_name,
                last_name: res.responsible_user.last_name,
                profession: res.responsible_user.profession,
                has_id: res.responsible_user.has_id
              },
              center: res.responsible_user.center,
              unit: res.responsible_user.unit.name,
              id: res.id,
              title: res.name,
              department: res.department,
              description: res.description,
              pdsaTag: res.pdsa_tag,
              problem: res.problem, 
              how: res.how,
              ideas: res.ideas,
              how_goal: res.how_goal, 
              plan: res.plan,
              planned_time: res.planned_time,
              improvment: res.improvment,
              time: res.time,
              trends: res.trends,
              effects: res.effects,
              evaluate_changes: res.evaluate_changes, 
              teachings: res.teachings,
              evaluate_plan: res.evaluate_plan,
              improvment_plan: res.improvment_plan,
              evaluate_do: res.evaluate_do,
              next_step: res.next_step,
              spreading: res.spreading,
              maintain: res.maintain,
              future: res.future,
              archive: res.archive,
              archive_date: res.archive_date,
              goal: res.goal,
              numberOfComments: res.numberOfComments,
              numberOfLikes: res.numberOfLikes,
              created_at: res.created_at
          }
          }
          this.showCard();
        }
      }
    })
  }

  showFilters() {
    var filter_div = document.getElementById('filterRow');
    if (filter_div != null) {
      if (filter_div.style.display == "flex") {
        filter_div.style.display = "none";
        this.dropDown = false;
      } else {
        filter_div.style.display = "flex";
        this.dropDown = true;
      }
    }
  }

  clearFilters() {
    this.searchInputRef.nativeElement.value = '';
    this.clinicRef.nativeElement.value = '';
    this.centerRef.nativeElement.value = '';
    this.placeRef.nativeElement.value = '';
    this.pdsaRef.nativeElement.value = '';
    this.starttimeRef.nativeElement.value = '';
    this.endtimeRef.nativeElement.value = '';
    this.finishedRef.nativeElement.checked = false;

    this.search('', '','', '', '', '', '', ''); 
  }
}