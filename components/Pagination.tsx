import {
  faArrowLeftLong,
  faArrowRight,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  page: number;
  onChangePage: (page: number) => void;
  totalItems: number;
  itemsPerPage?: number;
}

const Pagination = ({
  page,
  onChangePage,
  totalItems,
  itemsPerPage = 10,
}: IProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-end">
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          onClick={() => onChangePage(page - 1)}
          disabled={page === 1}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            className="w-3.5 h-3.5 me-2 rtl:rotate-180"
          />
          Prev
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => onChangePage(page + 1)}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <FontAwesomeIcon
            icon={faArrowRightLong}
            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
          />
        </button>
      </div>
      <span className="text-sm text-gray-700 mt-2">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {page * itemsPerPage - (itemsPerPage - 1)}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {page * itemsPerPage > totalItems ? totalItems : page * 10}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems}
        </span>{" "}
        Entries
      </span>
    </div>
  );
};

export default Pagination;
