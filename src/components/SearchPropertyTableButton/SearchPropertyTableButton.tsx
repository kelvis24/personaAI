import { Button, Drawer } from "antd";
import React from "react";
// import { useSubmit } from "react-router-dom";

/**
 * TODO Add search filters. Decide for API filters vs column filters
 * @returns 
 */
const SearchPropertyTableButton = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  // const submit = useSubmit();

  // const handleFormSubmit = (formValues: any) => {
  //   submit({ payload: "" }, { method: "GET" });
  // };

  return (
    <>
      <Button type="primary" onClick={toggleDrawer}>
        Search Property
      </Button>
      <Drawer open={drawerOpen}></Drawer>
    </>
  );
};

export default SearchPropertyTableButton;
