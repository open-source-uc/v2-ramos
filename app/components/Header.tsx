import Image from 'next/image';

export default function Header() {
    return (
        <header className="flex items-center justify-between p-8">
            <Image src="assets/UC_Logo_Big.svg" alt="UC Logo" width={200} height={200} className="h-20 w-auto tablet:hidden" />
            <Image src="assets/UC_Logo_Small.svg" alt="UC Logo" width={200} height={200} className="h-20 w-auto hidden tablet:block" />

            <nav className="hidden tablet:block">
                <ul className="flex space-x-4">
                <li>
                    <a href="/" className="hover:text-gray-400">
                    Home
                    </a>
                </li>
                <li>
                    <a href="/about" className="hover:text-gray-400">
                    About
                    </a>
                </li>
                <li>
                    <a href="/contact" className="hover:text-gray-400">
                    Contact
                    </a>
                </li>
                </ul>
            </nav>
        </header>
    );
}