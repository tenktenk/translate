// insertion point for imports

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class CountryWithBodiesDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	NCols: number = 0
	NRows: number = 0
	XllCorner: number = 0
	YllCorner: number = 0
	NbBodies: number = 0
	Step: number = 0

	// insertion point for other declarations
}
