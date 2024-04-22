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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortDirection, setSortDirection] =
    useState<string>(defaultSortDirection);
  const [paginatedData, setPaginatedData] = useState(
    pagination ? data.slice(0, itemsPerPage) : data
  );
  const [page, setPage] = useQueryParam("page", NumberParam);

  useEffect(() => {
    if (!page && pagination) {
      setPage(1);
    }
  }, [page, pagination]);

  const handleSort = (key: string) => {
    let newSortDirection;
    const newSortColumn = key;
    if (sortColumn === key) {
      newSortDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newSortDirection);
    } else {
      newSortDirection = "asc";
      setSortColumn(key);
      setSortDirection("asc");
    }
    if (newSortColumn && newSortDirection) {
      onSort(newSortColumn, newSortDirection);
    }
  };

  useEffect(() => {
    setPaginatedData(
      data.slice(
        (page || 1) * itemsPerPage - itemsPerPage,
        (page || 1) * itemsPerPage
      )
    );
  }, [data, page, itemsPerPage]);

  // useEffect(() => {
  //   if (sortColumn) {
  //     onSort(sortColumn, sortDirection);
  //   }
  // }, [sortColumn, sortDirection, onSort]);

  return (
    <>
      <div className="w-full flex items-center justify-end gap-2 mb-3">
        <label className="text-sm">Items per page</label>
        <select
          className="rounded-md border border-gray-300 p-1"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(parseInt(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <table className="w-full rounded-table table-bg-gradient">
        <thead className="mb-2">
          {columns.map((column) => {
            return (
              <th
                key={`head-column-${column.key}`}
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
                key={`sortable-row-${index}`}
                onClick={() => onRowClick && onRowClick(index)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((column) => {
                  return (
                    <td key={`column-${column.key}`}>{row[column.key]}</td>
                  );
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
          itemsPerPage={itemsPerPage}
          onChangePage={(page) => setPage(page)}
        />
      )}
    </>
  );
};

export default SortableTable;
