import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// for angular material
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AngularSplitModule, SplitComponent } from 'angular-split';

import {
	NgxMatDatetimePickerModule,
	NgxMatNativeDateModule,
	NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

import { AppRoutingModule } from './app-routing.module';

import { SplitterComponent } from './splitter/splitter.component'
import { SidebarComponent } from './sidebar/sidebar.component';

// insertion point for imports 
import { CountrySpecsTableComponent } from './countryspecs-table/countryspecs-table.component'
import { CountrySpecSortingComponent } from './countryspec-sorting/countryspec-sorting.component'
import { CountrySpecDetailComponent } from './countryspec-detail/countryspec-detail.component'
import { CountrySpecPresentationComponent } from './countryspec-presentation/countryspec-presentation.component'

import { CountryWithBodiessTableComponent } from './countrywithbodiess-table/countrywithbodiess-table.component'
import { CountryWithBodiesSortingComponent } from './countrywithbodies-sorting/countrywithbodies-sorting.component'
import { CountryWithBodiesDetailComponent } from './countrywithbodies-detail/countrywithbodies-detail.component'
import { CountryWithBodiesPresentationComponent } from './countrywithbodies-presentation/countrywithbodies-presentation.component'


@NgModule({
	declarations: [
		// insertion point for declarations 
		CountrySpecsTableComponent,
		CountrySpecSortingComponent,
		CountrySpecDetailComponent,
		CountrySpecPresentationComponent,

		CountryWithBodiessTableComponent,
		CountryWithBodiesSortingComponent,
		CountryWithBodiesDetailComponent,
		CountryWithBodiesPresentationComponent,


		SplitterComponent,
		SidebarComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RouterModule,

		AppRoutingModule,

		MatSliderModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MatExpansionModule,
		MatListModule,
		MatDialogModule,
		MatGridListModule,
		MatTreeModule,
		DragDropModule,

		NgxMatDatetimePickerModule,
		NgxMatNativeDateModule,
		NgxMatTimepickerModule,

		AngularSplitModule,
	],
	exports: [
		// insertion point for declarations 
		CountrySpecsTableComponent,
		CountrySpecSortingComponent,
		CountrySpecDetailComponent,
		CountrySpecPresentationComponent,

		CountryWithBodiessTableComponent,
		CountryWithBodiesSortingComponent,
		CountryWithBodiesDetailComponent,
		CountryWithBodiesPresentationComponent,


		SplitterComponent,
		SidebarComponent,

	],
	providers: [
		{
			provide: MatDialogRef,
			useValue: {}
		},
	],
})
export class TranslateModule { }
