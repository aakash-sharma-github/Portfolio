import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
    {
        icon: FaGithub,
        label: "GitHub",
        path: "https://github.com/aakash-sharma-github"
    },
    {
        icon: FaLinkedin,
        label: "LinkedIn",
        path: "https://www.linkedin.com/in/aakash-sharma-918447178/"
    },
    {
        icon: FaInstagram,
        label: "Instagram",
        path: "https://www.instagram.com/mr.sky__56/"
    },
    {
        icon: FaFacebook,
        label: "Facebook",
        path: "https://www.facebook.com/profile.php?id=100047117551153"
    },
    {
        icon: FaDiscord,
        label: "Discord",
        path: "https://discord.gg/BDRfU57A"
    },
    {
        icon: FaXTwitter,
        label: "X",
        path: "https://x.com/mrsky__56"
    }
]
export const Socials = () => {
    return (
        <>
            {socialLinks.map((item, index) => {
                return (
                    <Link
                        key={index}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="w-10 h-10 rounded-xl border border-white/15 flex items-center justify-center
                                 text-white/60 hover:text-accent hover:border-accent/50 hover:bg-accent/8
                                 transition-all duration-200"
                    >
                        <item.icon className="text-base" aria-hidden />
                    </Link>
                )
            })}
        </>
    )
}

export const SocialsContact = () => {
    return (
        <div className="flex gap-3">
            {socialLinks.map((item, index) => {
                return (

                    <Link
                        key={index}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-white/4 border border-white/6 hover:border-accent/30 hover:bg-accent/8 transition-all duration-250 group"
                    >
                        <item.icon className="text-white/45 group-hover:text-accent transition-colors" size={18} />
                        {/* <span className="text-white/30 text-[9px] uppercase tracking-widest group-hover:text-accent/70 transition-colors">{item.label}</span> */}
                    </Link>
                )
            })}
        </div>
    )
}

