import AuthButton from "../ui/AuthButton";
import SocialLinks from "../ui/SocialLinks";
import { useAuth } from "../../context/AuthContext";
import { FolderOpenDot, MessageCircleCode } from "lucide-react";
import AdminButton from "../ui/AdminButton";

export default function Header() {
    const { isLoggedIn } = useAuth();

    return (
        <header>
            <div
                className="
            bg-primary
            grid grid-cols-3 items-center
            h-[7vh]
            sm:h-[6vh]
            md:h-[7vh]
            lg:h-[9vh]"
            >
                <div className="justify-self-start pl-10">
                    {isLoggedIn && (
                        <div className="flex gap-6">
                            <AdminButton
                                Icon={FolderOpenDot}
                                IconSize={24}
                                buttonText="Manage Articles"
                                linkTo="/admin/articles/"
                                divClassName="text-light font-sans font-bold"
                                txtClassName="sr-only md:not-sr-only"
                            />
                            <AdminButton
                                Icon={MessageCircleCode}
                                IconSize={24}
                                buttonText="Manage Comments"
                                onClick="/admin/comments/"
                                divClassName="text-light font-sans font-bold"
                                txtClassName="sr-only md:not-sr-only"
                            />
                        </div>
                    )}
                </div>

                <h1
                    className="
                        justify-self-center
                        font-serif
                        lg:text-4xl md:text-2xl text-xl
                        text-light
                    "
                >
                    <a href="/">Blogem Ipsum</a>
                </h1>

                <div className="justify-self-end pr-10">
                    <AuthButton />
                </div>
            </div>

            <SocialLinks />
        </header>
    );
}
