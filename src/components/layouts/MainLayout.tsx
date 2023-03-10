import React, { Fragment, useContext } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, Bars4Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from '../../utils/supabaseClient';
import { UserInfoContext } from '../../utils/user-context';

const navigationLoggedIn = [
    { name: 'Activities', href: '/activities' },
    { name: 'Categories', href: '/categories' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Test Layout', href: '/test-layout' },
];

const navigationGuest = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Test Layout', href: '/test-layout' },
];
const userNavigationLoggedIn = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Change Password', href: '/change-password' },
    { name: 'Settings', href: '/settings' },
];
const userNavigationGuest = [
    { name: 'Log In', href: '/login' },
    { name: 'Register', href: '/register' },
    { name: 'Forgot Password', href: '/forgot-password' },
];

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

const footerNavigation = [
    {
        name: 'Facebook',
        href: '#',
        icon: (props: any) => (
            <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: '#',
        icon: (props: any) => (
            <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
    {
        name: 'Twitter',
        href: '#',
        icon: (props: any) => (
            <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
        ),
    },
    {
        name: 'GitHub',
        href: '#',
        icon: (props: any) => (
            <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
    {
        name: 'Dribbble',
        href: '#',
        icon: (props: any) => (
            <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
]

type Props = {
    heading?: string;
};
export default function MainLayout({ heading }: Props) {
    const location = useLocation()
    const pathname = location.pathname
    const navigate = useNavigate()

    const { session } = useContext(UserInfoContext)

    interface IDisplayUser {
        name?: string | null;
        email: string;
        imageUrl?: string | null
    }
    let displayUser: IDisplayUser | null = null

    if (session) {
        displayUser = {
            name: null,
            email: session.user.email!,
            imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
        // if (profile) {
        //     displayUser.name = profile.username
        //     if (profile.avatarUrl) {
        //         displayUser.imageUrl = profile.avatarUrl
        //     }
        // }
    } else {
        displayUser = null
    }

    async function signOutUser() {
        await supabase.auth.signOut();
        navigate('/')
    }
    const navigation = session ? navigationLoggedIn : navigationGuest
    const userNavigation = session ? userNavigationLoggedIn : userNavigationGuest

    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
            {/* <div className="min-h-full "> */}
            {/* <main className="min-h-full bg-gray-100 h-full"> h-full doesn't work*/}
            <div className="bg-gray-100 flex flex-col h-screen ">
                {/* Suresh added sticky top-0 z-50 below */}
                <Disclosure as="nav" className="bg-indigo-600 sticky top-0 z-50">
                    {({ open }) => (
                        <>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-8 w-8 cursor-pointer"
                                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
                                                alt="Workflow"
                                                onClick={(e: any) => { navigate('/') }}
                                            />
                                        </div>
                                        <div className="ml-2 lg:ml-4 cursor-pointer">
                                            <a
                                                className='text-white px-2 py-2 rounded-md text-base font-bold'
                                                aria-current='page'
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { navigate('/') }}

                                            >
                                                Application {heading && (`- ${heading}`)}
                                            </a>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-5 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <a
                                                        key={item.name}
                                                        className={classNames(
                                                            pathname == item.href
                                                                ? 'bg-indigo-700 text-white'
                                                                : 'text-white hover:bg-indigo-500 hover:bg-opacity-75',
                                                            'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                                        )}
                                                        aria-current={pathname == item.href ? 'page' : undefined}
                                                        onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { navigate(item.href) }}

                                                    >
                                                        {item.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block ">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {session && (<button
                                                type="button"
                                                className="bg-indigo-600 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                                            >
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>)}

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="ml-3 relative">
                                                <div>
                                                    <Menu.Button className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                                                        <span className="sr-only">Open displayUser menu</span>
                                                        {session ? <img
                                                            className="h-8 w-8 rounded-full"
                                                            src={displayUser!.imageUrl!}
                                                            alt=""
                                                        /> : <div className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer'>Log In</div>}

                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                        {
                                                            (userNavigation.map((item) => (
                                                                <Menu.Item key={item.name}>
                                                                    {({ active }) => (
                                                                        <a
                                                                            // href={item.href}
                                                                            className={classNames(
                                                                                pathname == item.href ? 'bg-gray-100' : '',
                                                                                'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                                                            )}
                                                                            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { navigate(item.href) }}
                                                                        >
                                                                            {item.name}
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>
                                                            )))
                                                        }
                                                        {session && (<Menu.Item>
                                                            <a
                                                                // href={item.href}
                                                                className='block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                                                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { signOutUser() }}
                                                            >
                                                                Sign Out
                                                            </a>
                                                        </Menu.Item>)}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars4Icon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { navigate(item.href) }}
                                            className={classNames(
                                                pathname == item.href
                                                    ? 'bg-indigo-700 text-white'
                                                    : 'text-white hover:bg-indigo-500 hover:bg-opacity-75',
                                                'block px-3 py-2 rounded-md text-base font-medium cursor-pointer'
                                            )}
                                            aria-current={pathname == item.href ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="pt-4 pb-3 border-t border-indigo-700">
                                    {session ?
                                        (<div className="flex items-center px-5">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={displayUser!.imageUrl!}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium text-white">
                                                    {displayUser!.name}
                                                </div>
                                                <div className="text-sm font-medium text-indigo-300">
                                                    {displayUser!.email}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="ml-auto bg-indigo-600 flex-shrink-0 p-1 border-2 border-transparent rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                                            >
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>) :
                                        null
                                    }
                                    <div className="mt-3 px-2 space-y-1">
                                        {userNavigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                // href="#"
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { navigate(item.href) }}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75 cursor-pointer"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                        {session && (
                                            <Disclosure.Button
                                                as="a"
                                                // href={item.href}
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { signOutUser() }}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75 cursor-pointer"
                                            >
                                                Sign Out
                                            </Disclosure.Button>)
                                        }
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                {/* <main className='flex flex-1 overflow-y-auto'> */}
                {/* Use flex-1 or flex-grow */}
                <main className='flex-grow overflow-y-auto'>
                    {/* <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"> */}
                    <div className="mx-auto max-w-7xl py-4 px-4 marker:sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
                {/* Suresh added sticky bottom-0 hidden md:block*/}
                <footer className="bg-white sticky bottom-0 hidden md:block">
                    {/* <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8"> */}
                    <div className=" mx-auto max-w-7xl py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                        <div className="flex justify-center space-x-6 md:order-2">
                            {footerNavigation.map((item) => (
                                <a key={item.name} href={item.href} className="text-gray-600 hover:text-gray-900">
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                        <div className="mt-8 md:order-1 md:mt-0">
                            <p className="text-center text-base text-gray-600">&copy; 2020 Your Company, Inc. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
