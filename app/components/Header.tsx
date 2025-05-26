import Image from 'next/image';
import ButtonNavbar from './new-ui/ButtonNavbar';

export default function Header() {
    return (
        <header className="flex items-center w-full py-8 space-between tablet:space-x-8">
            <Image src="assets/UC_Logo_Big.svg" alt="UC Logo" width={200} height={200} className="h-20 w-auto tablet:hidden" />
            <Image src="assets/UC_Logo_Small.svg" alt="UC Logo" width={200} height={200} className="h-20 w-auto hidden tablet:block" />

            <nav className="hidden space-y-3 w-full tablet:block">
                <ul className="flex space-x-4 border-b border-foreground-muted-dark w-full py-2">
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
                <div className="flex w-full space-x-2">
                    <ButtonNavbar text="MIS CURSOS FAVORITOS" url="/404" />
                    <ButtonNavbar text="MIS RESEÑAS" url="/404" />
                    <ButtonNavbar text="ORGANIZACIONES QUE SIGO" url="/404" />
                </div>
            </nav>
        </header>
    );
}