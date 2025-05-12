import { GraduationCap } from 'lucide-react';

function Titlebar() {
	return (
		<div className='navbar'>
			<GraduationCap size={50} />
			<h1 className='navbar-title'>GPA Calculator</h1>
		</div>
	);
}

export default Titlebar;
