import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Generate page numbers to show
    const getVisiblePages = () => {
        if (totalPages <= 5) return pages;

        if (currentPage <= 3) return [...pages.slice(0, 5), '...', totalPages];

        if (currentPage >= totalPages - 2) {
            return [1, '...', ...pages.slice(totalPages - 5)];
        }

        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages
        ];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-white hover:bg-accent/20'
                    }`}
                aria-label="Previous page"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            {visiblePages.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-4 py-2 text-gray-400">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                    ? 'bg-accent text-white'
                                    : 'text-white hover:bg-accent/20'
                                }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-white hover:bg-accent/20'
                    }`}
                aria-label="Next page"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination; 