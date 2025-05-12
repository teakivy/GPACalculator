import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

import './App.css';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from './components/ui/switch';
import type {
	Grade,
	Semester,
	Class,
} from './lib/types';
import Titlebar from './components/titlebar';
import TopCard from './components/TopCard';
import Semesters from './components/Semesters';

export default function App() {
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [activeSemester, setActiveSemester] = useState<string>('');
	const [editingClass, setEditingClass] = useState<Class | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [maxCredits, setMaxCredits] = useState(5);
	const [includePlusMinus, setIncludePlusMinus] = useState(false);
	const [tempMaxCredits, setTempMaxCredits] = useState(5);
	const [tempIncludePlusMinus, setTempIncludePlusMinus] = useState(false);

	useEffect(() => {
		const storedSemesters = localStorage.getItem('semesters');
		if (storedSemesters) {
			setSemesters(JSON.parse(storedSemesters));
		} else {
			const initialSemesters: Semester[] = [
				{
					id: '1',
					name: 'Fall 2023',
					classes: [
						{
							id: '1',
							code: 'CSCI 1301',
							name: 'Intro to Computer Science',
							grade: 'A',
							weight: 3,
						},
						{
							id: '2',
							code: 'MATH 1441',
							name: 'Calculus I',
							grade: 'B',
							weight: 4,
						},
					],
				},
			];
			setSemesters(initialSemesters);
			setActiveSemester(initialSemesters[0].id);
			localStorage.setItem('activeSemester', initialSemesters[0].id);
			localStorage.setItem('semesters', JSON.stringify(initialSemesters));
		}
	}, []);

	useEffect(() => {
		if (semesters.length <= 0) return;

		localStorage.setItem('semesters', JSON.stringify(semesters));
	}, [semesters]);
	useEffect(() => {
		const activeSemester = localStorage.getItem('activeSemester');
		if (activeSemester) {
			setActiveSemester(activeSemester);
		} else {
			const firstSemester = semesters[0]?.id;
			if (firstSemester) {
				setActiveSemester(firstSemester);
				localStorage.setItem('activeSemester', firstSemester);
			}
		}
	}, []);

	useEffect(() => {
		const storedMaxCredits = localStorage.getItem('maxCredits');
		const storedIncludePlusMinus = localStorage.getItem('includePlusMinus');

		if (storedMaxCredits) {
			setMaxCredits(parseInt(storedMaxCredits));
			setTempMaxCredits(parseInt(storedMaxCredits));
		}
		if (storedIncludePlusMinus) {
			const parsed = storedIncludePlusMinus === 'true';
			setIncludePlusMinus(parsed);
			setTempIncludePlusMinus(parsed);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('activeSemester', activeSemester);
	}, [activeSemester]);

	useEffect(() => {
		setTempMaxCredits(maxCredits);
		setTempIncludePlusMinus(includePlusMinus);
	}, [isSettingsOpen]);

	// Open edit dialog for a class
	const openEditDialog = (semesterId: string, classId: string) => {
		const semester = semesters.find((s) => s.id === semesterId);
		const classToEdit = semester?.classes.find((c) => c.id === classId);

		if (classToEdit) {
			setEditingClass({ ...classToEdit });
			setIsEditDialogOpen(true);
		}
	};

	// Save edited class
	const saveEditedClass = () => {
		if (!editingClass || !editingClass.name.trim() || !editingClass.code.trim())
			return;

		setSemesters(
			semesters.map((semester) => ({
				...semester,
				classes: semester.classes.map((cls) =>
					cls.id === editingClass.id ? editingClass : cls
				),
			}))
		);

		setIsEditDialogOpen(false);
		setEditingClass(null);
	};

	return (
		<div className='App'>
			<div className='container mx-auto py-8 px-4'>
				<Titlebar />
				<TopCard semesters={semesters} setIsSettingsOpen={setIsSettingsOpen} />

				<Semesters
					semesters={semesters}
					setSemesters={setSemesters}
					activeSemester={activeSemester}
					setActiveSemester={setActiveSemester}
					includePlusMinus={includePlusMinus}
					maxCredits={maxCredits}
					openEditDialog={openEditDialog}
				/>
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Class</DialogTitle>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='edit-class-code'>Class Code</Label>
							<Input
								id='edit-class-code'
								value={editingClass?.code || ''}
								onChange={(e) =>
									setEditingClass((prev) =>
										prev ? { ...prev, code: e.target.value } : null
									)
								}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='edit-class-name'>Class Name</Label>
							<Input
								id='edit-class-name'
								value={editingClass?.name || ''}
								onChange={(e) =>
									setEditingClass((prev) =>
										prev ? { ...prev, name: e.target.value } : null
									)
								}
							/>
						</div>
						<div className='grid gap-2 w-full'>
							<Label htmlFor='edit-grade'>Grade</Label>
							<div className='w-full'>
								<Select
									value={editingClass?.grade || 'A'}
									onValueChange={(value) =>
										setEditingClass((prev) =>
											prev ? { ...prev, grade: value as Grade } : null
										)
									}
								>
									<SelectTrigger
										id='edit-grade'
										className='w-full'
										style={{ cursor: 'pointer' }}
									>
										<SelectValue placeholder='Select grade' />
									</SelectTrigger>
									<SelectContent>
										{(includePlusMinus
											? [
													{ label: 'A', value: 'A' },
													{ label: 'A-', value: 'AMinus' },
													{ label: 'B+', value: 'BPlus' },
													{ label: 'B', value: 'B' },
													{ label: 'B-', value: 'BMinus' },
													{ label: 'C+', value: 'CPlus' },
													{ label: 'C', value: 'C' },
													{ label: 'C-', value: 'CMinus' },
													{ label: 'D+', value: 'DPlus' },
													{ label: 'D', value: 'D' },
													{ label: 'F', value: 'F' },
											  ]
											: [
													{ label: 'A', value: 'A' },
													{ label: 'B', value: 'B' },
													{ label: 'C', value: 'C' },
													{ label: 'D', value: 'D' },
													{ label: 'F', value: 'F' },
											  ]
										).map(({ label, value }) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='edit-credits'>Credits</Label>
							<Select
								value={editingClass?.weight.toString() || '3'}
								onValueChange={(value) =>
									setEditingClass((prev) =>
										prev ? { ...prev, weight: Number.parseInt(value) } : null
									)
								}
							>
								<SelectTrigger
									id='edit-credits'
									className='w-full'
									style={{ cursor: 'pointer' }}
								>
									<SelectValue placeholder='Credits' />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: maxCredits }, (_, i) => {
										const credit = (i + 1).toString();
										return (
											<SelectItem key={credit} value={credit}>
												{credit}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsEditDialogOpen(false)}
							style={{ cursor: 'pointer' }}
						>
							Cancel
						</Button>
						<Button onClick={saveEditedClass} style={{ cursor: 'pointer' }}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='max-credits'>Max Credits</Label>
							<Input
								id='max-credits'
								type='number'
								min={1}
								max={100}
								style={{ width: '100px' }}
								value={tempMaxCredits}
								onChange={(e) => setTempMaxCredits(Number(e.target.value))}
							/>
						</div>
						<div className='flex items-center justify-between'>
							<Label htmlFor='plus-minus-toggle'>Include +/- Grades</Label>
							<Switch
								id='plus-minus-grades'
								checked={tempIncludePlusMinus}
								onCheckedChange={setTempIncludePlusMinus}
								style={{ cursor: 'pointer' }}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => {
								setTempMaxCredits(maxCredits);
								setTempIncludePlusMinus(includePlusMinus);
								setIsSettingsOpen(false);
							}}
							style={{ cursor: 'pointer' }}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								setMaxCredits(tempMaxCredits);
								setIncludePlusMinus(tempIncludePlusMinus);
								localStorage.setItem('maxCredits', tempMaxCredits.toString());
								localStorage.setItem(
									'includePlusMinus',
									tempIncludePlusMinus.toString()
								);
								setIsSettingsOpen(false);
							}}
							style={{ cursor: 'pointer' }}
						>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
