export type Grade =
	| 'A'
	| 'AMinus'
	| 'BPlus'
	| 'B'
	| 'BMinus'
	| 'CPlus'
	| 'C'
	| 'CMinus'
	| 'DPlus'
	| 'D'
	| 'F';
export type SortField = 'code' | 'name' | 'grade' | 'weight' | 'none';
export type SortDirection = 'asc' | 'desc';

export interface Class {
	id: string;
	code: string;
	name: string;
	grade: Grade;
	weight: number;
}

export interface Semester {
	id: string;
	name: string;
	classes: Class[];
}
