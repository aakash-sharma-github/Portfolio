import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.

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
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: false,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                            resize: true,
                        },
                        modes: {
                            push: {
                                quantity: 500,
                            },
                            repulse: {
                                distance: 80,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#e68e2e",
                        },
                        links: {
                            color: "#f5d393",
                            distance: 150,
                            enable: true,
                            opacity: 0.5,
                            width: 1,
                        },
                        collisions: {
                            enable: true,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 0.8,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 150,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 10 },
                        },
                    },
                    detectRetina: true,
                }}
            />
            }
        </>
    )
}

export default ParticlesContainer