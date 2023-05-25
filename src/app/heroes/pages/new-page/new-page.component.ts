import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/Hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    alt_img: new FormControl(),
    alter_ego: new FormControl(),
    characters: new FormControl(),
    first_appearance: new FormControl(),
    id: new FormControl<string>(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    superhero: new FormControl<string>('ADBXXX', { nonNullable: true }),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private readonly heroesService: HeroesService,
    private readonly ActivatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly matSnackBar: MatSnackBar,
    private readonly matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ActivatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHero(id))
      ).subscribe((hero) => {
        if (!hero) return this.router.navigate(['/heroes/list']);

        this.heroForm.reset(hero);
        return;
      })
  }

  get currenHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {

    if (!this.heroForm.valid) return;

    if (this.currenHero.id) {
      this.heroesService.updateHero(this.currenHero).subscribe((heroUpdatedResponse) => {
        this.showSnackBar(` ${heroUpdatedResponse.superhero} actualizado!`);
      });
    } else {
      this.heroesService.addHero(this.currenHero).subscribe(newHeroResponse => {
        this.router.navigate(['heroes/edit', newHeroResponse.id]);
        this.showSnackBar(` ${this.currenHero.superhero} guardado!`);
      });
    }
  }

  showSnackBar(messaje: string): void {
    this.matSnackBar.open(messaje, 'done', {
      duration: 2500
    })
  }

  onDeleteHero() {
    if (!this.currenHero.id) throw Error('Hero id is required!');

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: this.currenHero
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHero(this.currenHero.id)),
        filter((easDeleted: boolean) => easDeleted),
      ).subscribe(() => {
        this.router.navigate(['/heroes']);
      });
  }

}

