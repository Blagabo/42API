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
	Divider,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from '@nextui-org/react';
import { UserIcon } from './icons/UserIcon';
import { useState } from 'react';
import Image from 'next/image';

function AppNavbar() {
	const session = useSession().data;
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menuItems = ['whitenova'];

	return (
		<>
			<Navbar onMenuOpenChange={setIsMenuOpen} className='p-2'>
				<NavbarContent>
					<NavbarMenuToggle
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
						className='sm:hidden'
					/>
					<NavbarBrand>
						<Link href='/'>
							<h1 className='font-bold text-white text-2xl'>42 API</h1>
						</Link>
					</NavbarBrand>
				</NavbarContent>
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
								<Image
									className='w-[50px] h-[50px] rounded-full border-2 border-gray-400'
									width={50}
									height={50}
									src={session?.user?.image.versions.medium}
									alt='User Image'
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
				<NavbarMenu className='py-6'>
					{menuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								color='foreground'
								className='w-full'
								href={`/${item}`}
								size='lg'
							>
								{item}
							</Link>
						</NavbarMenuItem>
					))}
				</NavbarMenu>
			</Navbar>
			<Divider orientation='horizontal' />
		</>
	);
}

export default AppNavbar;
