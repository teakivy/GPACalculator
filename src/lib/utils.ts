import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Class, Semester } from './types';
import { gradePoints } from './constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getSemesterCount(semesters: Semester[]): number {
	return semesters.length;
}

export function getCourseCount(semesters: Semester[]): number {
	return semesters.reduce(
		(total, semester) => total + semester.classes.length,
		0
	);
}

export function getTotalCredits(semesters: Semester[]): number {
	return semesters.reduce((total, semester) => {
		return (
			total + semester.classes.reduce((sum, course) => sum + course.weight, 0)
		);
	}, 0);
}

export function getGPA(semesters: Semester[]): string {
	const totalPoints = semesters.reduce((total, semester) => {
		return (
			total +
			semester.classes.reduce(
				(sum, course) => sum + gradePoints[course.grade] * course.weight,
				0
			)
		);
	}, 0);

	const totalCredits = getTotalCredits(semesters);

	return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}

export function calculateSemesterGPA(classes: Class[]): number {
	const totalPoints = classes.reduce(
		(total, cls) => total + gradePoints[cls.grade] * cls.weight,
		0
	);
	const totalCredits = classes.reduce((total, cls) => total + cls.weight, 0);
	return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

// Sort classes based on current sort field and direction
export const getSortedClasses = (
	classes: Class[],
	sortField: string,
	sortDirection: string
): Class[] => {
	return [...classes].sort((a, b) => {
		let comparison = 0;

		if (sortField === 'code') {
			comparison = a.code.localeCompare(b.code);
		} else if (sortField === 'name') {
			comparison = a.name.localeCompare(b.name);
		} else if (sortField === 'grade') {
			comparison = gradePoints[b.grade] - gradePoints[a.grade];
		} else if (sortField === 'weight') {
			comparison = a.weight - b.weight;
		}

		return sortDirection === 'asc' ? comparison : -comparison;
	});
};

// Format GPA to 2 decimal places
export const formatGPA = (gpa: number): string => {
	return gpa.toFixed(2);
};
