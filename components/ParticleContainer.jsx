import { useCallback, useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";

// Dynamically import particles to reduce bundle size and improve initial load
const Particles = dynamic(() => import("@tsparticles/react"), {
    ssr: false,
    loading: () => null,
});

import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesContainer = () => {
    const [init, setInit] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            /* you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            starting from v2 you can add only the features you need reducing the bundle size
            */
            // await loadFull(engine);
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = useCallback(async () => { }, []);

    return (
        <>
            {init && <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={{
                    fullScreen: {
                        enable: true,
                    },
                    fpsLimit: 60, // Reduced from 120 for better performance
                    background: {
                        color: "transparent",
                    },
                    interactivity: {
                        detectsOn: "window",
                        events: {
                            onClick: {
                                enable: false,
                            },
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                            resize: {
                                enable: true,
                                delay: 0.5,
                            },
                        },
                        modes: {
                            repulse: {
                                distance: 60, // Reduced distance for better performance
                                duration: 0.2, // Reduced duration
                                factor: 100,
                                speed: 1,
                                maxSpeed: 50,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#e68e2e",
                        },
                        links: {
                            color: "#f5d393",
                            distance: 120, // Reduced from 150
                            enable: true,
                            opacity: 0.3, // Reduced opacity
                            width: 0.5, // Thinner lines
                        },
                        collisions: {
                            enable: false, // Disabled for better performance
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "out", // Changed from bounce for better performance
                            },
                            random: false,
                            speed: 0.5, // Reduced speed
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 1000, // Increased area to reduce density
                            },
                            value: 80, // Reduced from 150 particles
                        },
                        opacity: {
                            value: 0.4, // Reduced opacity
                            animation: {
                                enable: false, // Disabled animation
                            },
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 5 }, // Reduced max size
                            animation: {
                                enable: false, // Disabled size animation
                            },
                        },
                    },
                    detectRetina: true,
                }}
            />
            }
        </>
    )
}

export default memo(ParticlesContainer)
