import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CountryWithBodiesDB } from '../countrywithbodies-db'
import { CountryWithBodiesService } from '../countrywithbodies.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface countrywithbodiesDummyElement {
}

const ELEMENT_DATA: countrywithbodiesDummyElement[] = [
];

@Component({
	selector: 'app-countrywithbodies-presentation',
	templateUrl: './countrywithbodies-presentation.component.html',
	styleUrls: ['./countrywithbodies-presentation.component.css'],
})
export class CountryWithBodiesPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	countrywithbodies: CountryWithBodiesDB = new (CountryWithBodiesDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private countrywithbodiesService: CountryWithBodiesService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getCountryWithBodies();

		// observable for changes in 
		this.countrywithbodiesService.CountryWithBodiesServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getCountryWithBodies()
				}
			}
		)
	}

	getCountryWithBodies(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.countrywithbodies = this.frontRepo.CountryWithBodiess.get(id)!

				// insertion point for recovery of durations
			}
		);
	}

	// set presentation outlet
	setPresentationRouterOutlet(structName: string, ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_tenktenk_translate_go_presentation: ["github_com_tenktenk_translate_go-" + structName + "-presentation", ID]
			}
		}]);
	}

	// set editor outlet
	setEditorRouterOutlet(ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_tenktenk_translate_go_editor: ["github_com_tenktenk_translate_go-" + "countrywithbodies-detail", ID]
			}
		}]);
	}
}
