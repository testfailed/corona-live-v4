import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { styled } from "@styles/stitches.config";
import { rem } from "polished";

interface Props {
  content: React.ReactNode;
  show?: boolean;
  onChange: (show: boolean) => void;
}

const Tooltip: React.FC<Props> = ({ children, content, show, onChange }) => {
  return (
    <TooltipPrimitive.Root
      defaultOpen={false}
      open={show}
      onOpenChange={onChange}
    >
      <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
      <Content sideOffset={5} side="top" align="end" style={{ zIndex: 10 }}>
        {content}
        <Arrow />
      </Content>
    </TooltipPrimitive.Root>
  );
};

const Content = styled(TooltipPrimitive.Content, {
  body3: true,
  fontWeight: 700,
  borderRadius: rem(6),
  paddingX: rem(14),
  paddingY: rem(8),

  lineHeight: 1,
  background: "$gray900",
  color: "$white",

  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
});

const Arrow = styled(TooltipPrimitive.Arrow, {
  fill: "$gray900",
  transform: `translate(${rem(-2)},${rem(-2)}) scaleY(1.4)`,
});

export default Tooltip;
