import { Typography } from "antd";

const TextField = ({
  value = "",
  prefix,
  copyable = false,
  onEmpty = "n/a",
}: {
  value: string | String;
  prefix?: any;
  copyable?: boolean;
  onEmpty?: "none" | "n/a";
}) => {
  return (
    <div style={{ display: "flex" }}>
      <Typography.Text>
        {prefix}{" "}
        {value ? (
          value
        ) : (
          <Typography.Text type="secondary">{onEmpty}</Typography.Text>
        )}
      </Typography.Text>
      {copyable && <Typography.Text copyable={{ text: value.toString() }} />}
    </div>
  );
};

export default TextField;
