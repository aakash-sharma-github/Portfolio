import React from 'react';

const StatusBadge = ({ status, size = 'sm' }) => {
    // Define status colors and labels with modern glassmorphism styling
    const statusConfig = {
        'completed': {
            bgColor: 'bg-green-500/15',
            textColor: 'text-green-400',
            borderColor: 'border-green-400/25',
            shadowColor: 'shadow-green-500/10',
            dotColor: 'bg-green-400',
            label: 'Completed'
        },
        'in-progress': {
            bgColor: 'bg-yellow-500/15',
            textColor: 'text-yellow-400',
            borderColor: 'border-yellow-400/25',
            shadowColor: 'shadow-yellow-500/10',
            dotColor: 'bg-yellow-400',
            label: 'In Progress'
        },
        'archived': {
            bgColor: 'bg-gray-500/15',
            textColor: 'text-gray-400',
            borderColor: 'border-gray-400/25',
            shadowColor: 'shadow-gray-500/10',
            dotColor: 'bg-gray-400',
            label: 'Archived'
        }
    };

    // Define sizes
    const sizeConfig = {
        'xs': {
            container: 'px-2 py-0.5 text-xs',
            dot: 'w-1.5 h-1.5'
        },
        'sm': {
            container: 'px-2.5 py-1 text-xs',
            dot: 'w-2 h-2'
        },
        'md': {
            container: 'px-3 py-1.5 text-sm',
            dot: 'w-2.5 h-2.5'
        },
        'lg': {
            container: 'px-4 py-2 text-base',
            dot: 'w-3 h-3'
        }
    };

    // Get config for current status
    const config = statusConfig[status] || statusConfig['completed'];
    const sizeClass = sizeConfig[size] || sizeConfig['sm'];

    return (
        <span 
            className={`
                inline-flex items-center gap-2
                ${config.bgColor} 
                ${config.textColor} 
                ${config.borderColor}
                ${config.shadowColor}
                ${sizeClass.container}
                rounded-full 
                border
                backdrop-blur-sm
                font-medium 
                capitalize
                whitespace-nowrap
                transition-all duration-300
                hover:scale-105
                hover:shadow-lg
                ${config.shadowColor}
            `}
        >
            {/* Status indicator dot */}
            <span 
                className={`
                    ${config.dotColor} 
                    ${sizeClass.dot} 
                    rounded-full 
                    animate-pulse
                `}
            />
            {config.label}
        </span>
    );
};

export default StatusBadge;
