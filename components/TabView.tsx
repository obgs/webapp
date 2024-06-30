"use client";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import React, { Children, PropsWithChildren, useState } from "react";

interface Props {
  values: string[];
  labels: string[];
}

const TabView: React.FC<PropsWithChildren<Props>> = ({
  values,
  labels,
  children,
}) => {
  const [tab, setTab] = useState(values?.[0] || "");

  if (values.length !== labels.length) {
    throw new Error("Values and labels must have the same length");
  }
  if (values.length !== Children.count(children)) {
    throw new Error("Values and children must have the same length");
  }
  if (values.length === 0) {
    throw new Error("Values and labels must have at least one item");
  }

  return (
    <TabContext value={tab}>
      <TabList onChange={(_, t) => setTab(t)}>
        {labels.map((label, i) => (
          <Tab key={values[i]} label={label} value={values[i]} />
        ))}
      </TabList>
      {Children.map(children, (child, i) => (
        <TabPanel key={values[i]} value={values[i]}>
          {child}
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default TabView;
