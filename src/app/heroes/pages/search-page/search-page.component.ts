import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/Hero.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html'
})
export class SearchPageComponent {

  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;

  constructor(
    private readonly heroesService: HeroesService,
  ) { }

  searchHero(): void {
    const value: string = this.searchInput.value!;
    console.log(value);
    this.heroesService.getSuggestions(value).subscribe({
      next: (heroes) => this.heroes = heroes
    })
  }

  optionSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
    }
    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);

  }

}
