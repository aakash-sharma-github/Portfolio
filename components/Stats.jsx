"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CountUp from "react-countup";


const Stats = () => {
    const [repoCount, setRepoCount] = useState(0);
    const [commitCount, setCommitCount] = useState(0);

    const stats = [
        {
            num: 2,
            text: "Years of experience.",
        },
        {
            num: 6,
            text: "Projects completed.",
        },
        {
            num: 10,
            text: "Technologies Learned.",
        },
        {
            num: repoCount,
            text: "Github Repositories.",
        },
        {
            num: commitCount,
            text: "Github Commits.",
        },
    ]


    useEffect(() => {
        const fetchGitHubStats = async () => {
            try {
                const response = await fetch('/api/github-stats');
                const data = await response.json();

                if (response.ok) {
                    setRepoCount(data.repoCount);
                    setCommitCount(data.totalCommits);
                } else {
                    console.error('Error fetching GitHub stats:', data.error);
                }
            } catch (error) {
                console.error('Error fetching GitHub stats:', error.message);
            }
        };

        fetchGitHubStats();
    }, []);


    return (
        <section className="pt-4 pb-12 xl:pt-0 xl:pb-0">
            <div className="container mx-auto">
                <div className="flex flex-wrap gap-6 max-w[80vw] mx-auto xl:max-w-none">
                    {stats.map((stat, index) => {
                        return (
                            <div
                                className="flex-1 flex gap-4 items-center justify-center xl:justify-start"
                                key={index}
                            >
                                <CountUp
                                    end={stat.num}
                                    duration={5}
                                    delay={0.5}
                                    className="text-4xl xl:text-6xl font-extrabold"
                                />
                                <sup className="text-3xl xl:text-4xl font-extrabold right-[12px] text-accent">+</sup>
                                <p className={`${stat.text.length < 15 ? "max-w-[100px]" : "max-w-[150px]"
                                    } leading-snug text-white/80`}>{stat.text}</p>

                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}

export default Stats