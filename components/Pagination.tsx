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
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
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
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "opacity-50 cursor-not-allowed hover:bg-surface/50 hover:text-gray-400" : ""}
            >
                <FaChevronLeft className="w-3 h-3" />
            </Button>

            {generatePageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                    <Button
                        key={index}
                        variant="secondary"
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center p-0 ${currentPage === page ? "bg-primary text-black" : ""}`}
                    >
                        {page}
                    </Button>
                ) : (
                    <span key={index} className="text-gray-400 px-2">...</span>
                )
            ))}

            <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed hover:bg-surface/50 hover:text-gray-400" : ""}
            >
                <FaChevronRight className="w-3 h-3" />
            </Button>
        </div>
    );
}