import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent {

  number:number = 0;
  
  constructor(private http: HttpClient) {
  }

  addPlaceholderNumber() {
    let data = {
      "PlaceholderNumber" : this.number,
    }

    this.http.post("http://127.0.0.1:8000/placeholderapp/item", data).subscribe((result: any) =>
    {
      alert("Postade");
    });
  }

}
