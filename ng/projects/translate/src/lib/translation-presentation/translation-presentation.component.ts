import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { TranslationDB } from '../translation-db'
import { TranslationService } from '../translation.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface translationDummyElement {
}

const ELEMENT_DATA: translationDummyElement[] = [
];

@Component({
	selector: 'app-translation-presentation',
	templateUrl: './translation-presentation.component.html',
	styleUrls: ['./translation-presentation.component.css'],
})
export class TranslationPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	translation: TranslationDB = new (TranslationDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private translationService: TranslationService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getTranslation();

		// observable for changes in 
		this.translationService.TranslationServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getTranslation()
				}
			}
		)
	}

	getTranslation(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.translation = this.frontRepo.Translations.get(id)!

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
				github_com_tenktenk_translate_go_editor: ["github_com_tenktenk_translate_go-" + "translation-detail", ID]
			}
		}]);
	}
}
