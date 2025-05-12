import {
	getGPA,
	getTotalCredits,
	getSemesterCount,
	getCourseCount,
} from '@/lib/utils';
import { Settings } from 'lucide-react';
import { Button } from './ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from './ui/card';
import type { Semester } from '@/lib/types';

function TopCard(props: {
	semesters: Semester[];
	setIsSettingsOpen: (isOpen: boolean) => void;
}) {
	return (
		<Card className='mb-8' style={{ textAlign: 'left' }}>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<div>
					<CardTitle style={{ fontWeight: 700, fontSize: '1.7rem' }}>
						Overall GPA
					</CardTitle>
					<CardDescription>
						Your cumulative GPA across all semesters
					</CardDescription>
				</div>
				<div>
					<Button
						variant='outline'
						onClick={() => props.setIsSettingsOpen(true)}
						style={{ cursor: 'pointer' }}
					>
						<Settings />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className='flex justify-between items-center'>
					<div>
						<p className='text-4xl font-bold'>{getGPA(props.semesters)}</p>
						<p className='text-sm text-muted-foreground'>
							Total Credits: {getTotalCredits(props.semesters)}
						</p>
					</div>
					<div className='text-right'>
						<p className='text-sm text-muted-foreground'>
							Semesters: {getSemesterCount(props.semesters)}
						</p>
						<p className='text-sm text-muted-foreground'>
							Courses: {getCourseCount(props.semesters)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default TopCard;
