// generated by gong
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { TypeofExpr } from '@angular/compiler';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { DialogData } from '../front-repo.service'
import { SelectionModel } from '@angular/cdk/collections';

import { Router, RouterState } from '@angular/router';
import { CountrySpecDB } from '../countryspec-db'
import { CountrySpecService } from '../countryspec.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'
import { NullInt64 } from '../null-int64'

@Component({
  selector: 'lib-countryspec-sorting',
  templateUrl: './countryspec-sorting.component.html',
  styleUrls: ['./countryspec-sorting.component.css']
})
export class CountrySpecSortingComponent implements OnInit {

  frontRepo: FrontRepo = new (FrontRepo)

  // array of CountrySpec instances that are in the association
  associatedCountrySpecs = new Array<CountrySpecDB>();

  constructor(
    private countryspecService: CountrySpecService,
    private frontRepoService: FrontRepoService,

    // not null if the component is called as a selection component of countryspec instances
    public dialogRef: MatDialogRef<CountrySpecSortingComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,

    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.getCountrySpecs()
  }

  getCountrySpecs(): void {
    this.frontRepoService.pull().subscribe(
      frontRepo => {
        this.frontRepo = frontRepo

        let index = 0
        for (let countryspec of this.frontRepo.CountrySpecs_array) {
          let ID = this.dialogData.ID
          let revPointerID = countryspec[this.dialogData.ReversePointer as keyof CountrySpecDB] as unknown as NullInt64
          let revPointerID_Index = countryspec[this.dialogData.ReversePointer + "_Index" as keyof CountrySpecDB] as unknown as NullInt64
          if (revPointerID.Int64 == ID) {
            if (revPointerID_Index == undefined) {
              revPointerID_Index = new NullInt64
              revPointerID_Index.Valid = true
              revPointerID_Index.Int64 = index++
            }
            this.associatedCountrySpecs.push(countryspec)
          }
        }

        // sort associated countryspec according to order
        this.associatedCountrySpecs.sort((t1, t2) => {
          let t1_revPointerID_Index = t1[this.dialogData.ReversePointer + "_Index" as keyof typeof t1] as unknown as NullInt64
          let t2_revPointerID_Index = t2[this.dialogData.ReversePointer + "_Index" as keyof typeof t2] as unknown as NullInt64
          if (t1_revPointerID_Index && t2_revPointerID_Index) {
            if (t1_revPointerID_Index.Int64 > t2_revPointerID_Index.Int64) {
              return 1;
            }
            if (t1_revPointerID_Index.Int64 < t2_revPointerID_Index.Int64) {
              return -1;
            }
          }
          return 0;
        });
      }
    )
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.associatedCountrySpecs, event.previousIndex, event.currentIndex);

    // set the order of CountrySpec instances
    let index = 0

    for (let countryspec of this.associatedCountrySpecs) {
      let revPointerID_Index = countryspec[this.dialogData.ReversePointer + "_Index" as keyof CountrySpecDB] as unknown as NullInt64
      revPointerID_Index.Valid = true
      revPointerID_Index.Int64 = index++
    }
  }

  save() {

    this.associatedCountrySpecs.forEach(
      countryspec => {
        this.countryspecService.updateCountrySpec(countryspec)
          .subscribe(countryspec => {
            this.countryspecService.CountrySpecServiceChanged.next("update")
          });
      }
    )

    this.dialogRef.close('Sorting of ' + this.dialogData.ReversePointer +' done');
  }
}
