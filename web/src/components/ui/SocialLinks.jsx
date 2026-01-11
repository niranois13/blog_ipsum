import Facebook from "../../assets/facebook.svg?react";
import X from "../../assets/x.svg?react";
import Instagram from "../../assets/instagram.svg?react";
import Pinterest from "../../assets/pinterest.svg?react";
import Discord from "../../assets/discord.svg?react";
import Github from "../../assets/github.svg?react";

export default function SocialLinks() {
    return (
        <div
            className="
            bg-dark
            w-full
            flex justify-evenly items-center
            "
        >
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="my-1 w-5 h-5 fill-current text-light hover:text-accent" />
            </a>

            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <X className="my-1 w-5 h-5 fill-current text-light hover:text-accent" />
            </a>

            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="my-1 w-5 h-5 fill-current text-light hover:text-accent" />
            </a>

            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <Pinterest className="my-1 w-5 h-5 fill-current text-light hover:text-accent" />
            </a>

            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <Discord className="my-1 w-5 h-5 fill-current text-light hover:text-accent" />
            </a>

            <a href="https://github.com/niranois13" target="_blank" rel="noopener noreferrer">
                <Github className="my-1 w-5 h-5 fill-current text-light hover:text-accent" />
            </a>
        </div>
    );
}
