import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NumberParam, useQueryParam } from "use-query-params";
import Pagination from "./Pagination";

interface IProps {
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
  }[];
  data: any[];
  defaultSortColumn?: string;
  defaultSortDirection?: string;
  clickable?: boolean;
  onRowClick?: (rowNumber: number) => void;
  pagination?: boolean;
  onSort: (sortColumn: string, sortDirection: string) => void;
}

const SortableTable = ({
  columns,
  data,
  pagination,
  onSort,
  onRowClick,
  defaultSortColumn,
  defaultSortDirection = "asc",
}: IProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(
    defaultSortColumn || null
  );
  const [sortDirection, setSortDirection] =
    useState<string>(defaultSortDirection);
  const [paginatedData, setPaginatedData] = useState(
    pagination ? data.slice(0, 10) : data
  );
  const [page, setPage] = useQueryParam("page", NumberParam);

  useEffect(() => {
    if (!page && pagination) {
      setPage(1);
    }
  }, [page]);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    setPaginatedData(data.slice((page || 1) * 10 - 10, (page || 1) * 10));
  }, [data, page]);

  useEffect(() => {
    if (sortColumn) {
      onSort(sortColumn, sortDirection);
    }
  }, [sortColumn, sortDirection]);

  return (
    <>
      <table className="w-full rounded-table table-bg-gradient">
        <thead className="mb-2">
          {columns.map((column) => {
            return (
              <th
                onClick={() => column.sortable && handleSort(column.key)}
                className=""
              >
                <div className="flex gap-2 float-right">
                  {column.label}
                  {sortColumn === column.key && column.sortable && (
                    <span>
                      {sortDirection === "asc" ? (
                        <FontAwesomeIcon icon={faSortUp} />
                      ) : (
                        <FontAwesomeIcon icon={faSortDown} />
                      )}
                    </span>
                  )}
                  {sortColumn !== column.key && column.sortable && (
                    <span>
                      <FontAwesomeIcon icon={faSort} />
                    </span>
                  )}
                </div>
              </th>
            );
          })}
        </thead>
        <tbody>
          {paginatedData.map((row, index) => {
            return (
              <tr
                className="text-right"
                onClick={() => onRowClick && onRowClick(index)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((column) => {
                  return <td>{row[column.key]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          page={page || 1}
          totalItems={data.length}
          onChangePage={(page) => setPage(page)}
        />
      )}
    </>
  );
};

export default SortableTable;
