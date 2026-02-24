import Button from "@/components/ui/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination(props: PaginationProps) {
    const { currentPage, totalPages, onPageChange } = props;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 1; i <= 2; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 1) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1.5 sm:px-4 sm:py-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed hover:bg-surface/50 hover:text-gray-400" : ""}`}
            >
                <FaChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>

            {generatePageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                    <Button
                        key={index}
                        variant="secondary"
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center p-0 text-sm sm:text-base ${currentPage === page ? "bg-primary text-black" : ""}`}
                    >
                        {page}
                    </Button>
                ) : (
                    <span key={index} className="text-gray-400 px-1 sm:px-2 text-sm">...</span>
                )
            ))}

            <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`!px-2 !py-1.5 sm:!px-4 sm:!py-2 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed hover:bg-surface/50 hover:text-gray-400" : ""}`}
            >
                <FaChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
        </div>
    );
}