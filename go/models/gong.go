// generated by ModelGongFileTemplate
package models

import "sort"

// swagger:ignore
type __void struct{}

// needed for creating set of instances in the stage
var __member __void

// StageStruct enables storage of staged instances
// swagger:ignore
type StageStruct struct { // insertion point for definition of arrays registering instances
	CountrySpecs           map[*CountrySpec]struct{}
	CountrySpecs_mapString map[string]*CountrySpec

	CountryWithBodiess           map[*CountryWithBodies]struct{}
	CountryWithBodiess_mapString map[string]*CountryWithBodies

	AllModelsStructCreateCallback AllModelsStructCreateInterface

	AllModelsStructDeleteCallback AllModelsStructDeleteInterface

	BackRepo BackRepoInterface

	// if set will be called before each commit to the back repo
	OnInitCommitCallback OnInitCommitInterface
}

type OnInitCommitInterface interface {
	BeforeCommit(stage *StageStruct)
}

type BackRepoInterface interface {
	Commit(stage *StageStruct)
	Checkout(stage *StageStruct)
	Backup(stage *StageStruct, dirPath string)
	Restore(stage *StageStruct, dirPath string)
	BackupXL(stage *StageStruct, dirPath string)
	RestoreXL(stage *StageStruct, dirPath string)
	// insertion point for Commit and Checkout signatures
	CommitCountrySpec(countryspec *CountrySpec)
	CheckoutCountrySpec(countryspec *CountrySpec)
	CommitCountryWithBodies(countrywithbodies *CountryWithBodies)
	CheckoutCountryWithBodies(countrywithbodies *CountryWithBodies)
	GetLastCommitNb() uint
	GetLastPushFromFrontNb() uint
}

// swagger:ignore instructs the gong compiler (gongc) to avoid this particular struct
var Stage StageStruct = StageStruct{ // insertion point for array initiatialisation
	CountrySpecs:           make(map[*CountrySpec]struct{}),
	CountrySpecs_mapString: make(map[string]*CountrySpec),

	CountryWithBodiess:           make(map[*CountryWithBodies]struct{}),
	CountryWithBodiess_mapString: make(map[string]*CountryWithBodies),

	// end of insertion point
}

func (stage *StageStruct) Commit() {
	if stage.BackRepo != nil {
		stage.BackRepo.Commit(stage)
	}
}

func (stage *StageStruct) Checkout() {
	if stage.BackRepo != nil {
		stage.BackRepo.Checkout(stage)
	}
}

// backup generates backup files in the dirPath
func (stage *StageStruct) Backup(dirPath string) {
	if stage.BackRepo != nil {
		stage.BackRepo.Backup(stage, dirPath)
	}
}

// Restore resets Stage & BackRepo and restores their content from the restore files in dirPath
func (stage *StageStruct) Restore(dirPath string) {
	if stage.BackRepo != nil {
		stage.BackRepo.Restore(stage, dirPath)
	}
}

// backup generates backup files in the dirPath
func (stage *StageStruct) BackupXL(dirPath string) {
	if stage.BackRepo != nil {
		stage.BackRepo.BackupXL(stage, dirPath)
	}
}

// Restore resets Stage & BackRepo and restores their content from the restore files in dirPath
func (stage *StageStruct) RestoreXL(dirPath string) {
	if stage.BackRepo != nil {
		stage.BackRepo.RestoreXL(stage, dirPath)
	}
}

// insertion point for cumulative sub template with model space calls
func (stage *StageStruct) getCountrySpecOrderedStructWithNameField() []*CountrySpec {
	// have alphabetical order generation
	countryspecOrdered := []*CountrySpec{}
	for countryspec := range stage.CountrySpecs {
		countryspecOrdered = append(countryspecOrdered, countryspec)
	}
	sort.Slice(countryspecOrdered[:], func(i, j int) bool {
		return countryspecOrdered[i].Name < countryspecOrdered[j].Name
	})
	return countryspecOrdered
}

// Stage puts countryspec to the model stage
func (countryspec *CountrySpec) Stage() *CountrySpec {
	Stage.CountrySpecs[countryspec] = __member
	Stage.CountrySpecs_mapString[countryspec.Name] = countryspec

	return countryspec
}

// Unstage removes countryspec off the model stage
func (countryspec *CountrySpec) Unstage() *CountrySpec {
	delete(Stage.CountrySpecs, countryspec)
	delete(Stage.CountrySpecs_mapString, countryspec.Name)
	return countryspec
}

// commit countryspec to the back repo (if it is already staged)
func (countryspec *CountrySpec) Commit() *CountrySpec {
	if _, ok := Stage.CountrySpecs[countryspec]; ok {
		if Stage.BackRepo != nil {
			Stage.BackRepo.CommitCountrySpec(countryspec)
		}
	}
	return countryspec
}

// Checkout countryspec to the back repo (if it is already staged)
func (countryspec *CountrySpec) Checkout() *CountrySpec {
	if _, ok := Stage.CountrySpecs[countryspec]; ok {
		if Stage.BackRepo != nil {
			Stage.BackRepo.CheckoutCountrySpec(countryspec)
		}
	}
	return countryspec
}

//
// Legacy, to be deleted
//

// StageCopy appends a copy of countryspec to the model stage
func (countryspec *CountrySpec) StageCopy() *CountrySpec {
	_countryspec := new(CountrySpec)
	*_countryspec = *countryspec
	_countryspec.Stage()
	return _countryspec
}

// StageAndCommit appends countryspec to the model stage and commit to the orm repo
func (countryspec *CountrySpec) StageAndCommit() *CountrySpec {
	countryspec.Stage()
	if Stage.AllModelsStructCreateCallback != nil {
		Stage.AllModelsStructCreateCallback.CreateORMCountrySpec(countryspec)
	}
	return countryspec
}

// DeleteStageAndCommit appends countryspec to the model stage and commit to the orm repo
func (countryspec *CountrySpec) DeleteStageAndCommit() *CountrySpec {
	countryspec.Unstage()
	DeleteORMCountrySpec(countryspec)
	return countryspec
}

// StageCopyAndCommit appends a copy of countryspec to the model stage and commit to the orm repo
func (countryspec *CountrySpec) StageCopyAndCommit() *CountrySpec {
	_countryspec := new(CountrySpec)
	*_countryspec = *countryspec
	_countryspec.Stage()
	if Stage.AllModelsStructCreateCallback != nil {
		Stage.AllModelsStructCreateCallback.CreateORMCountrySpec(countryspec)
	}
	return _countryspec
}

// CreateORMCountrySpec enables dynamic staging of a CountrySpec instance
func CreateORMCountrySpec(countryspec *CountrySpec) {
	countryspec.Stage()
	if Stage.AllModelsStructCreateCallback != nil {
		Stage.AllModelsStructCreateCallback.CreateORMCountrySpec(countryspec)
	}
}

// DeleteORMCountrySpec enables dynamic staging of a CountrySpec instance
func DeleteORMCountrySpec(countryspec *CountrySpec) {
	countryspec.Unstage()
	if Stage.AllModelsStructDeleteCallback != nil {
		Stage.AllModelsStructDeleteCallback.DeleteORMCountrySpec(countryspec)
	}
}

func (stage *StageStruct) getCountryWithBodiesOrderedStructWithNameField() []*CountryWithBodies {
	// have alphabetical order generation
	countrywithbodiesOrdered := []*CountryWithBodies{}
	for countrywithbodies := range stage.CountryWithBodiess {
		countrywithbodiesOrdered = append(countrywithbodiesOrdered, countrywithbodies)
	}
	sort.Slice(countrywithbodiesOrdered[:], func(i, j int) bool {
		return countrywithbodiesOrdered[i].Name < countrywithbodiesOrdered[j].Name
	})
	return countrywithbodiesOrdered
}

// Stage puts countrywithbodies to the model stage
func (countrywithbodies *CountryWithBodies) Stage() *CountryWithBodies {
	Stage.CountryWithBodiess[countrywithbodies] = __member
	Stage.CountryWithBodiess_mapString[countrywithbodies.Name] = countrywithbodies

	return countrywithbodies
}

// Unstage removes countrywithbodies off the model stage
func (countrywithbodies *CountryWithBodies) Unstage() *CountryWithBodies {
	delete(Stage.CountryWithBodiess, countrywithbodies)
	delete(Stage.CountryWithBodiess_mapString, countrywithbodies.Name)
	return countrywithbodies
}

// commit countrywithbodies to the back repo (if it is already staged)
func (countrywithbodies *CountryWithBodies) Commit() *CountryWithBodies {
	if _, ok := Stage.CountryWithBodiess[countrywithbodies]; ok {
		if Stage.BackRepo != nil {
			Stage.BackRepo.CommitCountryWithBodies(countrywithbodies)
		}
	}
	return countrywithbodies
}

// Checkout countrywithbodies to the back repo (if it is already staged)
func (countrywithbodies *CountryWithBodies) Checkout() *CountryWithBodies {
	if _, ok := Stage.CountryWithBodiess[countrywithbodies]; ok {
		if Stage.BackRepo != nil {
			Stage.BackRepo.CheckoutCountryWithBodies(countrywithbodies)
		}
	}
	return countrywithbodies
}

//
// Legacy, to be deleted
//

// StageCopy appends a copy of countrywithbodies to the model stage
func (countrywithbodies *CountryWithBodies) StageCopy() *CountryWithBodies {
	_countrywithbodies := new(CountryWithBodies)
	*_countrywithbodies = *countrywithbodies
	_countrywithbodies.Stage()
	return _countrywithbodies
}

// StageAndCommit appends countrywithbodies to the model stage and commit to the orm repo
func (countrywithbodies *CountryWithBodies) StageAndCommit() *CountryWithBodies {
	countrywithbodies.Stage()
	if Stage.AllModelsStructCreateCallback != nil {
		Stage.AllModelsStructCreateCallback.CreateORMCountryWithBodies(countrywithbodies)
	}
	return countrywithbodies
}

// DeleteStageAndCommit appends countrywithbodies to the model stage and commit to the orm repo
func (countrywithbodies *CountryWithBodies) DeleteStageAndCommit() *CountryWithBodies {
	countrywithbodies.Unstage()
	DeleteORMCountryWithBodies(countrywithbodies)
	return countrywithbodies
}

// StageCopyAndCommit appends a copy of countrywithbodies to the model stage and commit to the orm repo
func (countrywithbodies *CountryWithBodies) StageCopyAndCommit() *CountryWithBodies {
	_countrywithbodies := new(CountryWithBodies)
	*_countrywithbodies = *countrywithbodies
	_countrywithbodies.Stage()
	if Stage.AllModelsStructCreateCallback != nil {
		Stage.AllModelsStructCreateCallback.CreateORMCountryWithBodies(countrywithbodies)
	}
	return _countrywithbodies
}

// CreateORMCountryWithBodies enables dynamic staging of a CountryWithBodies instance
func CreateORMCountryWithBodies(countrywithbodies *CountryWithBodies) {
	countrywithbodies.Stage()
	if Stage.AllModelsStructCreateCallback != nil {
		Stage.AllModelsStructCreateCallback.CreateORMCountryWithBodies(countrywithbodies)
	}
}

// DeleteORMCountryWithBodies enables dynamic staging of a CountryWithBodies instance
func DeleteORMCountryWithBodies(countrywithbodies *CountryWithBodies) {
	countrywithbodies.Unstage()
	if Stage.AllModelsStructDeleteCallback != nil {
		Stage.AllModelsStructDeleteCallback.DeleteORMCountryWithBodies(countrywithbodies)
	}
}

// swagger:ignore
type AllModelsStructCreateInterface interface { // insertion point for Callbacks on creation
	CreateORMCountrySpec(CountrySpec *CountrySpec)
	CreateORMCountryWithBodies(CountryWithBodies *CountryWithBodies)
}

type AllModelsStructDeleteInterface interface { // insertion point for Callbacks on deletion
	DeleteORMCountrySpec(CountrySpec *CountrySpec)
	DeleteORMCountryWithBodies(CountryWithBodies *CountryWithBodies)
}

func (stage *StageStruct) Reset() { // insertion point for array reset
	stage.CountrySpecs = make(map[*CountrySpec]struct{})
	stage.CountrySpecs_mapString = make(map[string]*CountrySpec)

	stage.CountryWithBodiess = make(map[*CountryWithBodies]struct{})
	stage.CountryWithBodiess_mapString = make(map[string]*CountryWithBodies)

}

func (stage *StageStruct) Nil() { // insertion point for array nil
	stage.CountrySpecs = nil
	stage.CountrySpecs_mapString = nil

	stage.CountryWithBodiess = nil
	stage.CountryWithBodiess_mapString = nil

}
