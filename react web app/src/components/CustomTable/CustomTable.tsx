import type { TableProps } from "antd/es/table";
import { Card, Table } from "antd";

const CustomTable = ({
  tableHeaders,
  tableProps,
}: {
  tableHeaders: any;
  tableProps: TableProps<any>;
}) => {
  return (
    <Card
      bodyStyle={{ display: "block", border: "1px grey", overflow: "scroll" }}
    >
      <div style={{ marginBottom: "2rem" }}> {tableHeaders}</div>
      <Table
        bordered
        scroll={{ x: 1300 }}
        {...tableProps}
        // pagination={{ pageSize: 50 }}
        // scroll={{ y: 240 }}
      />
    </Card>
  );
};
export default CustomTable;
