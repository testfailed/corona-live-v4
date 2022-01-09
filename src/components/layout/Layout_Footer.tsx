import React from "react";

import Section from "@components/Section";
import { styled } from "@styles/stitches.config";
import { rem } from "polished";
import {
  EmailIconBox,
  InstagramIconBox,
  TwitterIconBox,
} from "@components/SnsIconBox";
import Space from "@components/Space";
import DonationIcon from "@components/icon/Icon_Donation";
import DonationModalTrigger from "@components/modal/Modal_Donation";

const LayoutFooter: React.FC = (props) => {
  return (
    <Section css={{ margin: 0 }}>
      <Wrapper className="user-select">
        <Space h={24} />

        <SubText>서버비용 후원</SubText>
        <Text>
          이용하시는데 불편함이 없도록 광고 없이 운영을 하고 있어요.<br></br>
          서버비용 충당후 후원금이 남을시 코로나19 관련 단체에 기부 할
          예정이에요.
        </Text>

        <DonationModalTrigger>
          <DonateButton>
            <DonationIcon size={8} />
            <span>후원하기</span>
          </DonateButton>
        </DonationModalTrigger>

        <Space h={42} />

        <SnsContainer>
          <TwitterIconBox type="profile" />
          <InstagramIconBox />
          <EmailIconBox />
        </SnsContainer>

        <Space h={32} />

        <Text>
          본사이트에서 제공하는 실시간 확진자수는 민간이 취합한 집계이므로
          <br />
          공식적인 근거 자료로 활용될수 없고, 해당 정보 사용/공유로 인해
          <br />
          발생된 문제의 책임은 전적으로 사용자에게 있어요.
          <br />
        </Text>

        <Space h={32} />

        <InfoText>
          <div>
            BY<b>CHINCHILLA</b>
          </div>
        </InfoText>

        <Space h={24} />
      </Wrapper>
    </Section>
  );
};

const Wrapper = styled("div", {
  columnCenteredX: true,
  padding: rem(16),
});

const SubText = styled("div", {
  body3: true,

  marginBottom: rem(10),
  marginTop: rem(10),
  opacity: 0.9,
  fontWeight: 500,
});

const Text = styled("div", {
  body3: true,
  textAlign: "center",
  justifyContent: "center",

  opacity: 0.8,
  lineHeight: rem(20),
  wordBreak: "keep-all",
});

const SnsContainer = styled("div", {
  rowCenteredY: true,
  marginBottom: rem(16),
});

const InfoText = styled("div", {
  // rowCenteredY: true,
  columnCentered: true,
  "& span": {
    caption1: true,

    marginBottom: rem(4),
  },
  "& div": {
    rowCenteredY: true,
    caption1: true,
    color: "$gray800",

    paddingX: rem(12),
    paddingY: rem(4),
    borderRadius: rem(16),
    transform: "scaleY(0.9)",

    "& b": {
      marginLeft: rem(4),
      fontWeight: 700,
    },
  },
});

const Email = styled("a", {
  body3: true,

  color: "$color",
});

const DonateButton = styled("button", {
  rowCenteredY: true,
  width: "auto",
  marginTop: rem(16),
  background: "$shadowBackground1",
  boxShadow: "$elevation2",
  border: `${rem(1)} solid $donationButtonBorder`,
  body3: true,

  paddingX: rem(16),
  paddingY: rem(8),
  borderRadius: rem(8),
  alignItems: "center",
  cursor: "pointer",
  color: "$gray900",

  "& > span": {
    marginLeft: rem(6),
    marginTop: rem(1),
  },
});

export default LayoutFooter;
