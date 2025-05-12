import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import type {
	Class,
	Grade,
	Semester,
	SortDirection,
	SortField,
} from '@/lib/types';
import { formatGPA, calculateSemesterGPA, getSortedClasses } from '@/lib/utils';
import { Label } from './ui/label';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from './ui/select';
import {
	Trash2,
	Plus,
	Edit,
	ArrowUp,
	ArrowDownUp,
	ArrowDown,
} from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';
import { Badge } from './ui/badge';

function Semesters(props: {
	semesters: Semester[];
	setSemesters: (semesters: Semester[]) => void;
	activeSemester: string;
	setActiveSemester: (semesterId: string) => void;
	includePlusMinus: boolean;
	maxCredits: number;
	openEditDialog: (semesterId: string, classId: string) => void;
}) {
	const {
		semesters,
		setSemesters,
		activeSemester,
		setActiveSemester,
		includePlusMinus,
		maxCredits,
		openEditDialog,
	} = props;

	const [newSemesterName, setNewSemesterName] = useState('');
	const [newClassCode, setNewClassCode] = useState('');
	const [newClassName, setNewClassName] = useState('');
	const [newGrade, setNewGrade] = useState<Grade>('A');
	const [newWeight, setNewWeight] = useState(3);
	const [sortField, setSortField] = useState<SortField>('code');
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	const addSemester = () => {
		if (!newSemesterName.trim()) return;

		const newSemester: Semester = {
			id: Date.now().toString(),
			name: newSemesterName,
			classes: [],
		};

		setSemesters([...semesters, newSemester]);
		setNewSemesterName('');
		setActiveSemester(newSemester.id);
	};

	// Add a class to a semester
	const addClass = (semesterId: string) => {
		if (!newClassName.trim() || !newClassCode.trim()) return;

		const newClass: Class = {
			id: Date.now().toString(),
			code: newClassCode,
			name: newClassName,
			grade: newGrade,
			weight: newWeight,
		};

		setSemesters(
			semesters.map((semester) =>
				semester.id === semesterId
					? {
							...semester,
							classes: [...semester.classes, newClass],
					  }
					: semester
			)
		);

		setNewClassCode('');
		setNewClassName('');
		setNewGrade('A');
		setNewWeight(3);
	};

	// Remove a class from a semester
	const removeClass = (semesterId: string, classId: string) => {
		setSemesters(
			semesters.map((semester) =>
				semester.id === semesterId
					? {
							...semester,
							classes: semester.classes.filter((cls) => cls.id !== classId),
					  }
					: semester
			)
		);
	};

	// Remove a semester
	const removeSemester = (semesterId: string) => {
		setSemesters(semesters.filter((semester) => semester.id !== semesterId));
		if (activeSemester === semesterId && semesters.length > 1) {
			setActiveSemester(
				semesters[0].id !== semesterId ? semesters[0].id : semesters[1].id
			);
		}
	};

	// Toggle sort direction or change sort field
	const handleSort = (field: SortField) => {
		if (field === sortField) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	// Get sort icon for table headers
	const getSortIcon = (field: SortField) => {
		if (field !== sortField)
			return <ArrowDownUp className='inline h-4 w-4 ml-1' />;

		return sortDirection === 'asc' ? (
			<ArrowUp className='inline h-4 w-4 ml-1' />
		) : (
			<ArrowDown className='inline h-4 w-4 ml-1' />
		);
	};

	return (
		<div className='grid gap-6 md:grid-cols-[250px_1fr]'>
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>Semesters</h2>
				<div className='space-y-2'>
					{semesters.map((semester) => (
						<Button
							key={semester.id}
							variant={activeSemester === semester.id ? 'default' : 'outline'}
							className='w-full justify-between group'
							style={{ cursor: 'pointer' }}
							onClick={() => setActiveSemester(semester.id)}
						>
							<span>{semester.name}</span>
							{semesters.length > 1 && (
								<Button
									variant='ghost'
									size='icon'
									className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
									style={{ cursor: 'pointer' }}
									onClick={(e) => {
										e.stopPropagation();
										removeSemester(semester.id);
									}}
								>
									<Trash2 className='h-4 w-4' />
									<span className='sr-only'>Remove</span>
								</Button>
							)}
						</Button>
					))}
				</div>

				<div className='pt-4 border-t'>
					<h3 className='text-sm font-medium mb-2'>Add New Semester</h3>
					<div className='flex gap-2'>
						<Input
							placeholder='Semester Name'
							value={newSemesterName}
							onChange={(e) => setNewSemesterName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									addSemester();
								}
							}}
						/>
						<Button
							size='icon'
							onClick={addSemester}
							style={{ cursor: 'pointer' }}
						>
							<Plus className='h-4 w-4' />
							<span className='sr-only'>Add</span>
						</Button>
					</div>
				</div>
			</div>

			<div>
				{semesters.map(
					(semester) =>
						semester.id === activeSemester && (
							<Card key={semester.id}>
								<CardHeader>
									<CardTitle
										className='flex justify-between items-center'
										style={{ fontWeight: 700, fontSize: '1.7rem' }}
									>
										{semester.name}
										<span className='text-base font-normal'>
											Semester GPA:{' '}
											{formatGPA(calculateSemesterGPA(semester.classes))}
										</span>
									</CardTitle>
									<CardDescription>
										Add your classes and grades for this semester
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										{semester.classes.length > 0 ? (
											<div className='border rounded-md overflow-hidden'>
												<table className='w-full'>
													<thead>
														<tr className='bg-muted/50'>
															<th
																className='text-left p-3 cursor-pointer hover:bg-muted/80 w-48'
																onClick={() => handleSort('code')}
															>
																Code {getSortIcon('code')}
															</th>
															<th
																className='text-left p-3 cursor-pointer hover:bg-muted/80'
																onClick={() => handleSort('name')}
															>
																Class Name {getSortIcon('name')}
															</th>
															<th
																className='text-center p-3 cursor-pointer hover:bg-muted/80'
																onClick={() => handleSort('grade')}
															>
																Grade {getSortIcon('grade')}
															</th>
															<th
																className='text-center p-3 cursor-pointer hover:bg-muted/80'
																onClick={() => handleSort('weight')}
															>
																Credits {getSortIcon('weight')}
															</th>
															<th className='text-center p-3'>Actions</th>
														</tr>
													</thead>
													<tbody>
														{getSortedClasses(
															semester.classes,
															sortField,
															sortDirection
														).map((cls) => (
															<tr key={cls.id} className='border-t'>
																<td className='p-3'>
																	<Badge variant='secondary'>{cls.code}</Badge>
																</td>
																<td className='p-3'>{cls.name}</td>
																<td className='p-3 text-center'>{cls.grade}</td>
																<td className='p-3 text-center'>
																	{cls.weight}
																</td>
																<td className='p-3 text-center'>
																	<div className='flex justify-center gap-2'>
																		<Button
																			variant='ghost'
																			size='icon'
																			style={{ cursor: 'pointer' }}
																			onClick={() =>
																				openEditDialog(semester.id, cls.id)
																			}
																		>
																			<Edit className='h-4 w-4' />
																			<span className='sr-only'>Edit</span>
																		</Button>
																		<Button
																			variant='ghost'
																			size='icon'
																			style={{ cursor: 'pointer' }}
																			onClick={() =>
																				removeClass(semester.id, cls.id)
																			}
																		>
																			<Trash2 className='h-4 w-4' />
																			<span className='sr-only'>Remove</span>
																		</Button>
																	</div>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										) : (
											<div className='text-center py-8 text-muted-foreground'>
												No classes added yet. Add your first class below.
											</div>
										)}

										<div className='grid gap-4 pt-4 border-t'>
											<h3
												className='font-medium'
												style={{ fontWeight: 'bold' }}
											>
												Add New Class
											</h3>
											<div className='grid gap-4 sm:grid-cols-5'>
												<div className='sm:col-span-1'>
													<Label
														htmlFor='class-code'
														style={{
															fontWeight: 'bold',
															marginBottom: '0.5rem',
														}}
													>
														Class Code
													</Label>
													<Input
														id='class-code'
														placeholder='e.g. PSYC 1101'
														value={newClassCode}
														onChange={(e) => setNewClassCode(e.target.value)}
													/>
												</div>
												<div className='sm:col-span-2'>
													<Label
														htmlFor='class-name'
														style={{
															fontWeight: 'bold',
															marginBottom: '0.5rem',
														}}
													>
														Class Name
													</Label>
													<Input
														id='class-name'
														placeholder='e.g. Intro to Psychology'
														value={newClassName}
														onChange={(e) => setNewClassName(e.target.value)}
													/>
												</div>
												<div>
													<Label
														htmlFor='grade'
														style={{
															fontWeight: 'bold',
															marginBottom: '0.5rem',
														}}
													>
														Grade
													</Label>
													<Select
														value={newGrade}
														onValueChange={(value) =>
															setNewGrade(value as Grade)
														}
													>
														<SelectTrigger
															id='grade'
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
												<div>
													<Label
														htmlFor='credits'
														style={{
															fontWeight: 'bold',
															marginBottom: '0.5rem',
														}}
													>
														Credits
													</Label>
													<Select
														value={newWeight.toString()}
														onValueChange={(value) =>
															setNewWeight(Number.parseInt(value))
														}
													>
														<SelectTrigger
															id='credits'
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
										</div>
									</div>
								</CardContent>
								<CardFooter className='flex justify-end'>
									<Button
										onClick={() => addClass(semester.id)}
										style={{ cursor: 'pointer' }}
									>
										Add Class
									</Button>
								</CardFooter>
							</Card>
						)
				)}
			</div>
		</div>
	);
}

export default Semesters;
