import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// insertion point for imports
import { CountrySpecsTableComponent } from './countryspecs-table/countryspecs-table.component'
import { CountrySpecDetailComponent } from './countryspec-detail/countryspec-detail.component'
import { CountrySpecPresentationComponent } from './countryspec-presentation/countryspec-presentation.component'

import { CountryWithBodiessTableComponent } from './countrywithbodiess-table/countrywithbodiess-table.component'
import { CountryWithBodiesDetailComponent } from './countrywithbodies-detail/countrywithbodies-detail.component'
import { CountryWithBodiesPresentationComponent } from './countrywithbodies-presentation/countrywithbodies-presentation.component'

import { TranslationsTableComponent } from './translations-table/translations-table.component'
import { TranslationDetailComponent } from './translation-detail/translation-detail.component'
import { TranslationPresentationComponent } from './translation-presentation/translation-presentation.component'


const routes: Routes = [ // insertion point for routes declarations
	{ path: 'github_com_tenktenk_translate_go-countryspecs', component: CountrySpecsTableComponent, outlet: 'github_com_tenktenk_translate_go_table' },
	{ path: 'github_com_tenktenk_translate_go-countryspec-adder', component: CountrySpecDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-countryspec-adder/:id/:originStruct/:originStructFieldName', component: CountrySpecDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-countryspec-detail/:id', component: CountrySpecDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-countryspec-presentation/:id', component: CountrySpecPresentationComponent, outlet: 'github_com_tenktenk_translate_go_presentation' },
	{ path: 'github_com_tenktenk_translate_go-countryspec-presentation-special/:id', component: CountrySpecPresentationComponent, outlet: 'github_com_tenktenk_translate_gocountryspecpres' },

	{ path: 'github_com_tenktenk_translate_go-countrywithbodiess', component: CountryWithBodiessTableComponent, outlet: 'github_com_tenktenk_translate_go_table' },
	{ path: 'github_com_tenktenk_translate_go-countrywithbodies-adder', component: CountryWithBodiesDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-countrywithbodies-adder/:id/:originStruct/:originStructFieldName', component: CountryWithBodiesDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-countrywithbodies-detail/:id', component: CountryWithBodiesDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-countrywithbodies-presentation/:id', component: CountryWithBodiesPresentationComponent, outlet: 'github_com_tenktenk_translate_go_presentation' },
	{ path: 'github_com_tenktenk_translate_go-countrywithbodies-presentation-special/:id', component: CountryWithBodiesPresentationComponent, outlet: 'github_com_tenktenk_translate_gocountrywithbodiespres' },

	{ path: 'github_com_tenktenk_translate_go-translations', component: TranslationsTableComponent, outlet: 'github_com_tenktenk_translate_go_table' },
	{ path: 'github_com_tenktenk_translate_go-translation-adder', component: TranslationDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-translation-adder/:id/:originStruct/:originStructFieldName', component: TranslationDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-translation-detail/:id', component: TranslationDetailComponent, outlet: 'github_com_tenktenk_translate_go_editor' },
	{ path: 'github_com_tenktenk_translate_go-translation-presentation/:id', component: TranslationPresentationComponent, outlet: 'github_com_tenktenk_translate_go_presentation' },
	{ path: 'github_com_tenktenk_translate_go-translation-presentation-special/:id', component: TranslationPresentationComponent, outlet: 'github_com_tenktenk_translate_gotranslationpres' },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
