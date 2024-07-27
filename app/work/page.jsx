'use client'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation';
import { BsArrowUpRight, BsGithub } from 'react-icons/bs'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import Link from 'next/link'
import Image from 'next/image'
import SliderBtn from '@/components/SliderBtn';

const projects = [
    {
        num: '01',
        category: 'Web Development',
        title: 'Personal Portfolio',
        description:
            'A personal portfolio website that showcases my skills and projects. Built using Next.js, Tailwind CSS, and Framer Motion.',
        stack: [
            {
                name: 'HTML 5'
            },
            {
                name: 'Tailwind CSS'
            },
            {
                name: 'Next.js'
            },
            {
                name: 'Framer Motion'
            },
        ],
        image: '/images/portfolio_01.png',
        live: '',
        github: ''
    },
    {
        num: '02',
        category: 'Web Development',
        title: 'Personal Portfolio',
        description:
            'A personal portfolio website that showcases my skills and projects. Built using Next.js, Tailwind CSS, and Framer Motion. Hosted on Netlify.',
        stack: [
            {
                name: 'HTML 5'
            },
            {
                name: 'Tailwind CSS'
            },
            {
                name: 'Next.js'
            },
            {
                name: 'Framer Motion'
            },
        ],
        image: '/images/portfolio_02.png',
        live: 'https://aakash-sharma-github.netlify.app/',
        github: 'https://github.com/aakash-sharma-github/Portfolio_Website.git'
    },
    {
        num: '03',
        category: 'Full Stack Development',
        title: 'Esewa and Khalti Payment Gateway',
        description:
            'A web application that allows users to pay using Khalti and Esewa. Built using React.js, Node.js, Tailwind CSS, and MongoDB.',
        stack: [
            {
                name: 'HTML 5'
            },
            {
                name: 'Tailwind CSS'
            },
            {
                name: 'React.js'
            },
            {
                name: 'Node.js'
            },
            {
                name: 'MongoDB'
            },
        ],
        image: '/images/esewa_khalti.webp',
        live: '',
        github: [
            {
                frontend: 'https://github.com/aakash-sharma-github/esewa_khalti_frontend.git',
            },
            {
                backend: 'https://github.com/aakash-sharma-github/esewa_khalti_backend.git',
            }
        ]
    },
    {
        num: '04',
        category: 'Full Stack Development',
        title: 'NEWS Portal',
        description:
            'A news portal website that allows users to read and comment on news. Built using React.js, Node.js, and MySQL. ',
        stack: [
            {
                name: 'HTML 5'
            },
            {
                name: 'SCSS'
            },
            {
                name: 'React.js'
            },
            {
                name: 'Node.js'
            },
            {
                name: 'MySQL'
            }
        ],
        image: '/images/news_portal.png',
        live: '',
        github: 'https://github.com/aakash-sharma-github/NEWS_Portal.git'
    },
    {
        num: '05',
        category: 'Web Development',
        title: 'WeMeet',
        description:
            'A web application that allows users to create and join meetings.  Built using React.js, Firebase, and zegocloud.',
        stack: [
            {
                name: 'HTML 5'
            },
            {
                name: 'Elastic UI'
            },
            {
                name: 'React.js'
            },
            {
                name: 'Firebase'
            },
            {
                name: 'zegocloud'
            }
        ],
        image: '/images/wemeet.png',
        live: '',
        github: 'https://github.com/aakash-sharma-github/WeMeet.git'
    },
    {
        num: '06',
        category: 'Web Development',
        title: 'Books_Management',
        description:
            'A web application that allows users to read books, download books, and manage their library. Built using React.js, Django, and MySQL.',
        stack: [
            {
                name: 'HTML 5'
            },
            {
                name: 'Tailwind CSS'
            },
            {
                name: 'React.js'
            },
            {
                name: 'Django/Python'
            },
            {
                name: 'MySQL'
            },
        ],
        image: '/images/book.png',
        live: '',
        github: 'https://github.com/aakash-sharma-github/Books_Management.git'
    },
    {
        num: '07',
        category: 'Web Development',
        title: 'Studyffy Admin Panel',
        description:
            'A web application that allows admin to assign online classes timing, make announcements for teachers, register new teachers and view all teachers. Built using React.js, Node.js, and MongoDB.',
        stack: [
            {
                name: 'HTML 5'
            },
            {
                name: 'Tailwind CSS'
            },
            {
                name: 'React.js'
            },
            {
                name: 'Node.js'
            },
            {
                name: 'MongoDB'
            },
        ],
        image: '/images/studyffy.png',
        live: 'https://studyffy.netlify.app/',
        github: [
            {
                frontend: 'https://github.com/aakash-sharma-github/studffy-frontend.git',
            },
            {
                backend: 'https://github.com/aakash-sharma-github/studffy-backend.git'
            }
        ]
    },

]

const work = () => {
    const [project, setProject] = useState(projects[0])

    const handleSlideChange = (swiper) => {
        // get current slide index
        const index = swiper.activeIndex;
        // update project state with current slide index
        setProject(projects[index]);
    }
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: {
                    delay: 1,
                    duration: 0.4,
                    ease: "easeIn"
                }
            }}
            className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0"
        >
            <div className="container mx-auto">
                <div className="flex flex-col xl:flex-row xl:gap-[16px]">
                    <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
                        <div className="flex flex-col gap-[16px] h-[50%]">

                            {/* outline num */}
                            <div className="text-5xl leading-none font-bold text-transparent text-outline">
                                {project.num}
                            </div>

                            {/* project category */}
                            <h2 className="text-[42px] font-semibold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
                                {project.category}
                            </h2>

                            {/* project title */}
                            <h3 className="text-[30px] font-medium leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
                                {project.title}
                            </h3>

                            {/* project description */}
                            <p className="text-white/60">
                                {project.description}
                            </p>

                            {/* stack */}
                            <ul className="flex gap-4">
                                {project.stack.map((item, index) => (
                                    <li
                                        key={index}
                                        className="text-xl text-accent"
                                    >
                                        {item.name}
                                        {/* remove the last comma */}
                                        {index !== project.stack.length - 1 && ","}
                                    </li>
                                ))}

                            </ul>

                            {/* border */}
                            <div className="border border-white/20"></div>

                            {/* button   */}
                            <div className="flex items-center gap-4">
                                {/* live project btn */}
                                {project.live ? (
                                    <Link href={project.live} target="_blank">
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger className="w-[40px] h-[40px] rounded-full bg-white/5 flex justify-center items-center group" >
                                                    <BsArrowUpRight className="text-white text-xl group-hover:text-accent" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Live</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Link>
                                ) : (
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger className="w-[40px] h-[40px] rounded-full bg-white/5 flex justify-center items-center group" >
                                                <BsArrowUpRight className="text-white text-xl group-hover:text-accent" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Not Live</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                {/* github repository link */}
                                {Array.isArray(project.github) && project.github.length === 2 ? (
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger className="w-[40px] h-[40px] rounded-full bg-white/5 flex justify-center items-center group" >
                                                <BsGithub className="text-white text-xl group-hover:text-accent" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="flex flex-row gap-4">
                                                    <Link href={project.github[0].frontend} target="_blank">
                                                        <p>Frontend</p>
                                                    </Link>
                                                    <Link href={project.github[1].backend} target="_blank">
                                                        <p>Backend</p>
                                                    </Link>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <Link href={project.github} target="_blank">
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger className="w-[40px] h-[40px] rounded-full bg-white/5 flex justify-center items-center group" >
                                                    <BsGithub className="text-white text-xl group-hover:text-accent" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Github Repository</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full xl:w-[50%]">
                        <Swiper
                            spaceBetween={30}
                            slidesPerView={1}
                            className="xl:h-[520px] mb-12"
                            autoplay={{
                                delay: 4500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,

                            }}
                            navigation={true}
                            modules={[Autoplay, Navigation]}
                            onSlideChange={handleSlideChange}
                        >
                            {projects.map((item, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="w-full"
                                >
                                    <div className="h-[460px] relative group flex justify-center items-center rounded-xl bg-pink-50/20">
                                        {/* overlay */}
                                        <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10 rounded-xl" />

                                        {/* image */}
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={item.image}
                                                alt={project.num}
                                                fill
                                                className="object-cover rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                            {/* slider button */}
                            {/* <SliderBtn
                                containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
                                btnStyles="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] rounded-full flex justify-center items-center transition-all"
                            /> */}
                        </Swiper>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default work
