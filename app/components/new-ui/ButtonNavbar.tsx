interface ButtonProps {
    text: string;
    url: string;
}

export default function ButtonNavbar({ text, url }: ButtonProps) {
    return (
        <a 
            href={url} 
            className="inline-block px-4 py-1.5 bg-card text-xs text-foreground-muted-dark border-1 border-primary hover:bg- hover:text-[var(--primary-foreground)] rounded-lg transition-colors duration-200 text-center"
        >
            {text}
        </a>
    );
}