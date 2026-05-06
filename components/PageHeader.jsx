import React from 'react'
import { motion } from "framer-motion";

const PageHeader = ({ badge, header, subheader, desc }) => {
    return (
        <div className="relative pt-4 pb-4 text-center overflow-hidden">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.44 }}>
                <span className="inline-block px-4 py-1 rounded-full border border-accent/30 text-accent text-[10px] uppercase tracking-[0.22em] mb-4">
                    {badge}
                </span>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">{header} <span className="text-accent">{subheader}</span></h1>
                <p className="text-white/40 text-sm max-w-sm mx-auto">
                    {desc}
                </p>
            </motion.div>
        </div>
    )
}

export default PageHeader