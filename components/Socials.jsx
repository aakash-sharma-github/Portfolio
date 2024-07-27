import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
    {
        icon: <FaGithub />,
        path: "https://github.com/aakash-sharma-github"
    },
    {
        icon: <FaLinkedin />,
        path: "https://www.linkedin.com/in/aakash-sharma-918447178/"
    },
    {
        icon: <FaInstagram />,
        path: "https://www.instagram.com/mr.sky__56/"
    },
    {
        icon: <FaFacebook />,
        path: "https://www.facebook.com/profile.php?id=100047117551153"
    },
    {
        icon: <FaDiscord />,
        path: "https://discord.gg/BDRfU57A"
    },
    {
        icon: <FaXTwitter />,
        path: "https://x.com/mrsky__56"
    }
]
const Socials = ({ containerStyles, iconStyles }) => {
    return (
        <div className={containerStyles}>
            {socialLinks.map((item, index) => {
                return (
                    <Link
                        key={index}
                        href={item.path}
                        className={iconStyles}
                    >
                        {item.icon}
                    </Link>
                )
            })}
        </div>
    )
}

export default Socials