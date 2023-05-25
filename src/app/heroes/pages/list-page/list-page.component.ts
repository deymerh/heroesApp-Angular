import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/Hero.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {

  public heroes: Hero[] = [];

  constructor(private readonly heroesService: HeroesService ){}

  ngOnInit(): void {
    this.heroesService.getHeroes().subscribe((heroes) => this.heroes = heroes);
  }

}
