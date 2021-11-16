import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CountrySpecDB } from '../countryspec-db'
import { CountrySpecService } from '../countryspec.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface countryspecDummyElement {
}

const ELEMENT_DATA: countryspecDummyElement[] = [
];

@Component({
	selector: 'app-countryspec-presentation',
	templateUrl: './countryspec-presentation.component.html',
	styleUrls: ['./countryspec-presentation.component.css'],
})
export class CountrySpecPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	countryspec: CountrySpecDB = new (CountrySpecDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private countryspecService: CountrySpecService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getCountrySpec();

		// observable for changes in 
		this.countryspecService.CountrySpecServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getCountrySpec()
				}
			}
		)
	}

	getCountrySpec(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.countryspec = this.frontRepo.CountrySpecs.get(id)!

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
				github_com_tenktenk_translate_go_editor: ["github_com_tenktenk_translate_go-" + "countryspec-detail", ID]
			}
		}]);
	}
}
