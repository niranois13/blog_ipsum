import { Link } from "react-router-dom";
import AuthButton from "../ui/AuthButton";
import SocialLinks from "../ui/SocialLinks";

export default function Footer() {
    return (
        <footer className="bg-primary flex flex-col gap-2 py-1 justify-center items-center">
            <div className="flex justify-around items-center">
                <div className="flex gap-10 invisible">
                    <AuthButton />
                </div>
                <h1
                    className="
                            font-serif lg:text-4xl md:text-2xl text-xl text-light
                            "
                >
                    Blogem Ipsum
                </h1>
                <div className="flex gap-10 md:invisible">
                    <AuthButton />
                </div>
            </div>
            <Link to="/privacy" className="text-light text-sm hover:underline">
                Cookies and privacy policies
            </Link>
            <SocialLinks />
        </footer>
    );
}
