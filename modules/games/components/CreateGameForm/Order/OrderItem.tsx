import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { Identifier } from "dnd-core";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { StatItem } from "./StatItem";
import { statTypeLabelMap } from "modules/stats";

interface Props {
  index: number;
  stat: StatItem;
  moveStat: (dragIndex: number, hoverIndex: number) => void;
}

const OrderItem: React.FC<Props> = ({ index, stat, moveStat }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{}, drop] = useDrop<StatItem, void, { handlerId: Identifier | null }>({
    accept: "stat",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: StatItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      moveStat(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "stat",
    item: () => {
      return { id: stat.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <Accordion ref={ref} sx={{ opacity }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography>{stat.name}</Typography>
          <Chip label={statTypeLabelMap[stat.statType]} />
        </Stack>
      </AccordionSummary>
      {stat.details && <AccordionDetails>{stat.details}</AccordionDetails>}
    </Accordion>
  );
};

export default OrderItem;
