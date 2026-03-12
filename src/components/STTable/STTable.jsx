
import { Table, Pagination } from "antd";
import React, { useState, useEffect, useMemo } from "react";

const SGSTable = ({
  data = [],
  columns = [],
  rowKey = "id",
  pagination = { pageSize: 10 },
  scroll = { x: "max-content" },
  onChange,
  ...rest
}) => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10);
  const [sortConfig, setSortConfig] = useState(null);

  // Reset to page 1 whenever the data changes (e.g. after search/filter)
  useEffect(() => {
    setCurrent(1);
  }, [data]);

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleTableChange = (paginationInfo, filters, sorter, extra) => {
    setSortConfig(sorter);
    if (onChange) {
      onChange(paginationInfo, filters, sorter, extra);
    }
  };

  // Sort the data before paginating it
  const processedData = useMemo(() => {
    let sorted = [...data];
    if (sortConfig && sortConfig.order && sortConfig.column?.sorter) {
      sorted.sort((a, b) => {
        const result = typeof sortConfig.column.sorter === "function"
          ? sortConfig.column.sorter(a, b)
          : 0;
        return sortConfig.order === "descend" ? -result : result;
      });
    }
    return sorted;
  }, [data, sortConfig]);

  const paginatedData = pagination === false 
    ? processedData
    : processedData.slice(
        (current - 1) * pageSize,
        current * pageSize
      );

  return (
    <Table
      size="small"
      bordered
      rowKey={rowKey}
      dataSource={paginatedData}
      columns={columns}
      pagination={false}
      scroll={scroll}
      onChange={handleTableChange}
      footer={
        pagination === false 
          ? undefined 
          : () => (
        <div className="flex justify-between items-center text-sm text-gray-600 px-3 py-2">
          <span>Total {data.length} items</span>

          <Pagination
            current={current}
            total={data.length}
            pageSize={pageSize}
            showSizeChanger
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            size="small"
          />
        </div>
      )}
      {...rest}
    />
  );
};

export default SGSTable;
