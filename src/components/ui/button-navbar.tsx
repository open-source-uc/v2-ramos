interface ButtonProps {
  text: string;
  url: string;
}

export default function ButtonNavbar({ text, url }: ButtonProps) {
  return (
    <a
      href={url}
      className="bg-background text-input border-border hover:bg-primary-foreground hover:text-primary hover:border-primary inline-block rounded-lg border-1 px-4 py-1.5 text-center text-xs transition-colors duration-200"
    >
      {text}
    </a>
  );
}