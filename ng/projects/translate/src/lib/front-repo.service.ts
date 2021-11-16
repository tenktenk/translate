import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, combineLatest, BehaviorSubject } from 'rxjs';

// insertion point sub template for services imports 
import { CountrySpecDB } from './countryspec-db'
import { CountrySpecService } from './countryspec.service'

import { CountryWithBodiesDB } from './countrywithbodies-db'
import { CountryWithBodiesService } from './countrywithbodies.service'


// FrontRepo stores all instances in a front repository (design pattern repository)
export class FrontRepo { // insertion point sub template 
  CountrySpecs_array = new Array<CountrySpecDB>(); // array of repo instances
  CountrySpecs = new Map<number, CountrySpecDB>(); // map of repo instances
  CountrySpecs_batch = new Map<number, CountrySpecDB>(); // same but only in last GET (for finding repo instances to delete)
  CountryWithBodiess_array = new Array<CountryWithBodiesDB>(); // array of repo instances
  CountryWithBodiess = new Map<number, CountryWithBodiesDB>(); // map of repo instances
  CountryWithBodiess_batch = new Map<number, CountryWithBodiesDB>(); // same but only in last GET (for finding repo instances to delete)
}

//
// Store of all instances of the stack
//
export const FrontRepoSingloton = new (FrontRepo)

// the table component is called in different ways
//
// DISPLAY or ASSOCIATION MODE
//
// in ASSOCIATION MODE, it is invoked within a diaglo and a Dialog Data item is used to
// configure the component
// DialogData define the interface for information that is forwarded from the calling instance to 
// the select table
export class DialogData {
  ID: number = 0 // ID of the calling instance

  // the reverse pointer is the name of the generated field on the destination
  // struct of the ONE-MANY association
  ReversePointer: string = "" // field of {{Structname}} that serve as reverse pointer
  OrderingMode: boolean = false // if true, this is for ordering items

  // there are different selection mode : ONE_MANY or MANY_MANY
  SelectionMode: SelectionMode = SelectionMode.ONE_MANY_ASSOCIATION_MODE

  // used if SelectionMode is MANY_MANY_ASSOCIATION_MODE
  //
  // In Gong, a MANY-MANY association is implemented as a ONE-ZERO/ONE followed by a ONE_MANY association
  // 
  // in the MANY_MANY_ASSOCIATION_MODE case, we need also the Struct and the FieldName that are
  // at the end of the ONE-MANY association
  SourceStruct: string = ""  // The "Aclass"
  SourceField: string = "" // the "AnarrayofbUse"
  IntermediateStruct: string = "" // the "AclassBclassUse" 
  IntermediateStructField: string = "" // the "Bclass" as field
  NextAssociationStruct: string = "" // the "Bclass"
}

export enum SelectionMode {
  ONE_MANY_ASSOCIATION_MODE = "ONE_MANY_ASSOCIATION_MODE",
  MANY_MANY_ASSOCIATION_MODE = "MANY_MANY_ASSOCIATION_MODE",
}

//
// observable that fetch all elements of the stack and store them in the FrontRepo
//
@Injectable({
  providedIn: 'root'
})
export class FrontRepoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient, // insertion point sub template 
    private countryspecService: CountrySpecService,
    private countrywithbodiesService: CountryWithBodiesService,
  ) { }

  // postService provides a post function for each struct name
  postService(structName: string, instanceToBePosted: any) {
    let service = this[structName.toLowerCase() + "Service" + "Service" as keyof FrontRepoService]
    let servicePostFunction = service[("post" + structName) as keyof typeof service] as (instance: typeof instanceToBePosted) => Observable<typeof instanceToBePosted>

    servicePostFunction(instanceToBePosted).subscribe(
      instance => {
        let behaviorSubject = instanceToBePosted[(structName + "ServiceChanged") as keyof typeof instanceToBePosted] as unknown as BehaviorSubject<string>
        behaviorSubject.next("post")
      }
    );
  }

  // deleteService provides a delete function for each struct name
  deleteService(structName: string, instanceToBeDeleted: any) {
    let service = this[structName.toLowerCase() + "Service" as keyof FrontRepoService]
    let serviceDeleteFunction = service["delete" + structName as keyof typeof service] as (instance: typeof instanceToBeDeleted) => Observable<typeof instanceToBeDeleted>

    serviceDeleteFunction(instanceToBeDeleted).subscribe(
      instance => {
        let behaviorSubject = instanceToBeDeleted[(structName + "ServiceChanged") as keyof typeof instanceToBeDeleted] as unknown as BehaviorSubject<string>
        behaviorSubject.next("delete")
      }
    );
  }

  // typing of observable can be messy in typescript. Therefore, one force the type
  observableFrontRepo: [ // insertion point sub template 
    Observable<CountrySpecDB[]>,
    Observable<CountryWithBodiesDB[]>,
  ] = [ // insertion point sub template 
      this.countryspecService.getCountrySpecs(),
      this.countrywithbodiesService.getCountryWithBodiess(),
    ];

  //
  // pull performs a GET on all struct of the stack and redeem association pointers 
  //
  // This is an observable. Therefore, the control flow forks with
  // - pull() return immediatly the observable
  // - the observable observer, if it subscribe, is called when all GET calls are performs
  pull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest(
          this.observableFrontRepo
        ).subscribe(
          ([ // insertion point sub template for declarations 
            countryspecs_,
            countrywithbodiess_,
          ]) => {
            // Typing can be messy with many items. Therefore, type casting is necessary here
            // insertion point sub template for type casting 
            var countryspecs: CountrySpecDB[]
            countryspecs = countryspecs_ as CountrySpecDB[]
            var countrywithbodiess: CountryWithBodiesDB[]
            countrywithbodiess = countrywithbodiess_ as CountryWithBodiesDB[]

            // 
            // First Step: init map of instances
            // insertion point sub template for init 
            // init the array
            FrontRepoSingloton.CountrySpecs_array = countryspecs

            // clear the map that counts CountrySpec in the GET
            FrontRepoSingloton.CountrySpecs_batch.clear()

            countryspecs.forEach(
              countryspec => {
                FrontRepoSingloton.CountrySpecs.set(countryspec.ID, countryspec)
                FrontRepoSingloton.CountrySpecs_batch.set(countryspec.ID, countryspec)
              }
            )

            // clear countryspecs that are absent from the batch
            FrontRepoSingloton.CountrySpecs.forEach(
              countryspec => {
                if (FrontRepoSingloton.CountrySpecs_batch.get(countryspec.ID) == undefined) {
                  FrontRepoSingloton.CountrySpecs.delete(countryspec.ID)
                }
              }
            )

            // sort CountrySpecs_array array
            FrontRepoSingloton.CountrySpecs_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.CountryWithBodiess_array = countrywithbodiess

            // clear the map that counts CountryWithBodies in the GET
            FrontRepoSingloton.CountryWithBodiess_batch.clear()

            countrywithbodiess.forEach(
              countrywithbodies => {
                FrontRepoSingloton.CountryWithBodiess.set(countrywithbodies.ID, countrywithbodies)
                FrontRepoSingloton.CountryWithBodiess_batch.set(countrywithbodies.ID, countrywithbodies)
              }
            )

            // clear countrywithbodiess that are absent from the batch
            FrontRepoSingloton.CountryWithBodiess.forEach(
              countrywithbodies => {
                if (FrontRepoSingloton.CountryWithBodiess_batch.get(countrywithbodies.ID) == undefined) {
                  FrontRepoSingloton.CountryWithBodiess.delete(countrywithbodies.ID)
                }
              }
            )

            // sort CountryWithBodiess_array array
            FrontRepoSingloton.CountryWithBodiess_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });


            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template for redeem 
            countryspecs.forEach(
              countryspec => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            countrywithbodiess.forEach(
              countrywithbodies => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // insertion point for pull per struct 

  // CountrySpecPull performs a GET on CountrySpec of the stack and redeem association pointers 
  CountrySpecPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.countryspecService.getCountrySpecs()
        ]).subscribe(
          ([ // insertion point sub template 
            countryspecs,
          ]) => {
            // init the array
            FrontRepoSingloton.CountrySpecs_array = countryspecs

            // clear the map that counts CountrySpec in the GET
            FrontRepoSingloton.CountrySpecs_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            countryspecs.forEach(
              countryspec => {
                FrontRepoSingloton.CountrySpecs.set(countryspec.ID, countryspec)
                FrontRepoSingloton.CountrySpecs_batch.set(countryspec.ID, countryspec)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear countryspecs that are absent from the GET
            FrontRepoSingloton.CountrySpecs.forEach(
              countryspec => {
                if (FrontRepoSingloton.CountrySpecs_batch.get(countryspec.ID) == undefined) {
                  FrontRepoSingloton.CountrySpecs.delete(countryspec.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // CountryWithBodiesPull performs a GET on CountryWithBodies of the stack and redeem association pointers 
  CountryWithBodiesPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.countrywithbodiesService.getCountryWithBodiess()
        ]).subscribe(
          ([ // insertion point sub template 
            countrywithbodiess,
          ]) => {
            // init the array
            FrontRepoSingloton.CountryWithBodiess_array = countrywithbodiess

            // clear the map that counts CountryWithBodies in the GET
            FrontRepoSingloton.CountryWithBodiess_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            countrywithbodiess.forEach(
              countrywithbodies => {
                FrontRepoSingloton.CountryWithBodiess.set(countrywithbodies.ID, countrywithbodies)
                FrontRepoSingloton.CountryWithBodiess_batch.set(countrywithbodies.ID, countrywithbodies)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear countrywithbodiess that are absent from the GET
            FrontRepoSingloton.CountryWithBodiess.forEach(
              countrywithbodies => {
                if (FrontRepoSingloton.CountryWithBodiess_batch.get(countrywithbodies.ID) == undefined) {
                  FrontRepoSingloton.CountryWithBodiess.delete(countrywithbodies.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }
}

// insertion point for get unique ID per struct 
export function getCountrySpecUniqueID(id: number): number {
  return 31 * id
}
export function getCountryWithBodiesUniqueID(id: number): number {
  return 37 * id
}
