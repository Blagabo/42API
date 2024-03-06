'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	DropdownItem,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	Avatar,
	Button,
} from '@nextui-org/react';
import { UserIcon } from './icons/UserIcon';

function AppNavbar() {
	const session = useSession().data;

	return (
		<Navbar className='p-2'>
			<NavbarBrand>
				<Link href='/'>
					<h1 className='font-bold text-white text-2xl'>42 API</h1>
				</Link>
			</NavbarBrand>
			<NavbarContent className='hidden sm:flex gap-4' justify='center'>
				<NavbarItem>
					<Link color='foreground' href='/whitenova'>
						WhiteNova
					</Link>
				</NavbarItem>
			</NavbarContent>

			{!session ? (
				<NavbarContent as='div' justify='end'>
					<NavbarItem>
						<Button
							onClick={() => signIn()}
							variant='bordered'
							startContent={<UserIcon />}
						>
							Sign in
						</Button>
					</NavbarItem>
				</NavbarContent>
			) : (
				<NavbarContent as='div' justify='end'>
					<Dropdown placement='bottom'>
						<DropdownTrigger>
							<Avatar
								isBordered
								className='transition-transform'
								name={session?.user?.name}
								size='md'
								radius='sm'
								src={session?.user?.image}
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label='Profile Actions' variant='flat'>
							<DropdownItem key='profile' className='h-8 gap-2'>
								<p className='font-semibold'>
									Signed in as: {session.user.login}
								</p>
							</DropdownItem>
							<DropdownItem
								onClick={() => signOut()}
								key='logout'
								color='danger'
							>
								Log Out
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			)}
		</Navbar>
	);
}

export default AppNavbar;
