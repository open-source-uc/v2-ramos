interface ButtonProps {
    text: string;
    url: string;
}

export default function ButtonNavbar({ text, url }: ButtonProps) {
    return (
        <a 
            href={url} 
            className="inline-block px-4 py-1.5 bg-background-elements text-xs text-foreground-muted-dark border-1 border-foreground-muted-dark hover:bg-primary-light hover:text-primary hover:border-primary rounded-lg transition-colors duration-200 text-center"
        >
            {text}
        </a>
    );
}