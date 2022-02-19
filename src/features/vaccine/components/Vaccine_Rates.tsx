import React, { useEffect, useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import { styled } from "@styles/stitches.config";

import Space from "@components/Space";
import Column from "@components/Column";
import Skeleton from "@components/Skeleton";

interface VaccineRatesProps {
  first: number;
  second: number;
  third: number;
  boldText?: string | React.ReactNode;
  text?: string;
  size?: "big";
  labelAlignment?: "center";
  labelPosition?: "bottom" | "top";
}

const VaccineRates: React.FC<VaccineRatesProps> = ({
  first,
  second,
  third,
  boldText,
  text,
  size,
  labelAlignment,
  labelPosition = "bottom",
}) => {
  const { t } = useTranslation();

  const [barWidth, setBarWidth] = useState({
    first: 0,
    second: 0,
    third: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setBarWidth({
        first,
        second,
        third,
      });
    }, 50);
  }, []);

  return (
    <Container size={size}>
      {(boldText || text) && (
        <>
          <Label>
            {boldText && <b>{boldText}</b>}
            {text && <span>{text}</span>}
          </Label>
          <BigDivder />
        </>
      )}
      <Column
        css={{
          flex: 1,
          flexDirection: labelPosition === "top" ? "column-reverse" : "column",
        }}
      >
        <BarContainer>
          <FilledBar
            css={{
              width: `${barWidth.first}%`,
              background: "$blue200",
            }}
          />
          <FilledBar
            css={{
              width: `${barWidth.second}%`,
              background: "$blue400",
            }}
          />
          <FilledBar
            css={{
              width: `${barWidth.third}%`,
              background: "$blue500",
            }}
          />
        </BarContainer>
        <Space
          h={{ _: size === "big" ? 12 : 7, md: size === "big" ? 10 : 8 }}
        />
        <LabelContainer alignment={labelAlignment}>
          <StatLabelContainer>
            <StatLabelLegend css={{ background: "$blue500" }} />
            <StatLabelText>
              {t("stat.vaccine.third_dose.shortened")}
              <b>{third.toFixed(1)}%</b>
            </StatLabelText>
          </StatLabelContainer>

          <StatLabelDivider />

          <StatLabelContainer>
            <StatLabelLegend css={{ background: "$blue400" }} />
            <StatLabelText>
              {t("stat.vaccine.second_dose.shortened")}

              <b>{second.toFixed(1)}%</b>
            </StatLabelText>
          </StatLabelContainer>

          <StatLabelDivider />

          <StatLabelContainer>
            <StatLabelLegend css={{ background: "$blue200" }} />
            <StatLabelText>
              {t("stat.vaccine.first_dose.shortened")}

              <b>{first.toFixed(1)}%</b>
            </StatLabelText>
          </StatLabelContainer>
        </LabelContainer>
      </Column>
    </Container>
  );
};

export const VaccineRatesSkeleton = () => (
  <Container
    css={{
      height: rem(56),
      "@md": {
        height: rem(67),
      },
    }}
  >
    <Label>
      <Skeleton w={{ _: 51, md: 59 }} h={{ _: 14, md: 16 }} />
      <Space h={6} />
      <Skeleton h={{ _: 12, md: 14 }} />
    </Label>
    <BigDivder />

    <Column css={{ width: "100%" }}>
      <Space h={{ _: 0, md: 4 }} />
      <Skeleton w={"100%"} h={{ _: 10, md: 14 }} />
      <Space h={{ _: 10, md: 10 }} />
      <LabelContainer>
        <StatLabelContainer>
          <StatLabelLegend css={{ background: "$grayA200" }} />
          <StatLabelText>
            <Skeleton w={{ _: 50, md: 60 }} h={{ _: 12, md: 14 }} />
            <Space w={6} />
            <Skeleton w={{ _: 30, md: 40 }} h={{ _: 12, md: 14 }} />
          </StatLabelText>
        </StatLabelContainer>

        <StatLabelDivider />

        <StatLabelContainer>
          <StatLabelLegend css={{ background: "$grayA200" }} />
          <StatLabelText>
            <Skeleton w={{ _: 50, md: 60 }} h={{ _: 12, md: 14 }} />
            <Space w={6} />
            <Skeleton w={{ _: 30, md: 40 }} h={{ _: 12, md: 14 }} />
          </StatLabelText>
        </StatLabelContainer>
      </LabelContainer>
    </Column>
  </Container>
);

const Label = styled("div", {
  caption1: true,
  columnCenteredX: true,

  wordBreak: "keep-all",
  flexShrink: 0,
  whiteSpace: "nowrap",

  "& >b": {
    body3: true,

    marginBottom: rem(1),
    fontWeight: 700,
  },

  "@md": {
    body2: true,
    minWidth: "none",
    maxWidth: "none",

    "& >b": {
      marginBottom: rem(1),
      subtitle3: true,
    },
  },
});

const BigDivder = styled("div", {
  width: rem(1),
  background: "rgba($gray900rgb, 0.15)",
  height: rem(26),
  marginX: rem(16),

  "@md": {
    height: rem(32),
    marginX: rem(18),
  },
});

const LabelContainer = styled("div", {
  rowCenteredY: true,

  variants: {
    alignment: {
      center: {
        justifyContent: "center",
      },
    },
  },
});
const StatLabelDivider = styled("div", {
  width: rem(1),
  height: rem(8),
  marginX: rem(6),
});

const StatLabelText = styled("div", {
  rowCenteredY: true,
  body3: true,

  "& > b": {
    paddingLeft: rem(4),

    fontWeight: 700,
    color: "$gray900",
  },

  "@md": {
    body2: true,

    "& > b": {
      subtitle3: true,
    },
  },
});

const StatLabelLegend = styled("div", {
  size: rem(6),
  borderRadius: rem(2),
  marginRight: rem(6),

  "@md": {
    size: rem(8),
    borderRadius: rem(3),
  },
});

const StatLabelContainer = styled("div", {
  rowCentered: true,
  wordBreak: "keep-all",

  "@md": {
    top: rem(12),
  },
});

const BarContainer = styled("div", {
  position: "relative",
  width: "100%",
  height: rem(9),
  background: "rgba($gray900rgb,0.08)",

  "&, & > div": {
    borderRadius: rem(4),
  },

  "@md": {
    height: rem(10),

    "&, & > div": {
      borderRadius: rem(5),
    },
  },
});

const FilledBar = styled("div", {
  position: "absolute",
  height: "100%",
  left: 0,
  top: 0,
  bottom: 0,
  width: "0%",
  transition: "350ms",
});

const Container = styled("div", {
  rowCenteredY: true,
  width: "100%",
  paddingY: rem(10),
  paddingX: rem(16),

  "&:last-of-type": {
    marginBottom: rem(0),
  },

  "@md": {
    paddingY: rem(14),
    paddingX: rem(24),
  },

  variants: {
    size: {
      big: {
        paddingTop: rem(14),

        [`& ${BarContainer}, ${FilledBar}`]: {
          height: rem(11),
          borderRadius: rem(6),
        },

        [`& ${StatLabelLegend}`]: {
          size: rem(10),
          borderRadius: rem(4),
        },

        [`& ${StatLabelText}`]: {
          body1: true,
        },

        "@md": {
          paddingTop: rem(16),

          [`& ${BarContainer}, ${FilledBar}`]: {
            height: rem(14),
            borderRadius: rem(6),
          },

          [`& ${StatLabelLegend}`]: {
            size: rem(11),
            borderRadius: rem(5),
          },

          [`& ${StatLabelText}`]: {
            body1: true,

            "& > b": {
              body1: true,
            },
          },
        },
      },
    },
  },
});

export default VaccineRates;
