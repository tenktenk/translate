// insertion point for imports
import { CountryWithBodiesDB } from './countrywithbodies-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class TranslationDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""

	// insertion point for other declarations
	SourceCountryWithBodies?: CountryWithBodiesDB
	SourceCountryWithBodiesID: NullInt64 = new NullInt64 // if pointer is null, SourceCountryWithBodies.ID = 0

	TargetCountryWithBodies?: CountryWithBodiesDB
	TargetCountryWithBodiesID: NullInt64 = new NullInt64 // if pointer is null, TargetCountryWithBodies.ID = 0

}
