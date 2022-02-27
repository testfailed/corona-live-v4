import React from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import { styled } from "@styles/stitches.config";

import {
  EmailIconButton,
  GithubIconButton,
  InstagramIconButton,
  TwitterIconButton,
} from "@components/FooterIconButtons";
import Space from "@components/Space";
import DonationIcon from "@components/icon/Icon_Donation";
import DonationModalTrigger from "@components/modal/Modal_Donation";

interface Props {
  simplified?: boolean;
}

const LayoutFooter: React.FC<Props> = ({ simplified }) => {
  const { t } = useTranslation("");

  return (
    <Wrapper className="user-select" css={simplified && { padding: 0 }}>
      <Space h={simplified ? 12 : 24} />

      {simplified ? (
        <></>
      ) : (
        <>
          <SubText>{t("footer.donate_title")}</SubText>
          <Text
            style={{ whiteSpace: "nowrap" }}
            dangerouslySetInnerHTML={{ __html: t("footer.donate_message.lb") }}
          />
          <DonationModalTrigger>
            <DonateButton>
              <DonationIcon size={8} />
              <span>{t("donate")}</span>
            </DonateButton>
          </DonationModalTrigger>
          <Space h={42} />
        </>
      )}

      <SnsContainer>
        <GithubIconButton />
        <TwitterIconButton />
        <InstagramIconButton />
        <EmailIconButton />
      </SnsContainer>

      {simplified ? (
        <Space h={12} />
      ) : (
        <>
          <Space h={32} />
          <Text
            style={simplified ? {} : { whiteSpace: "nowrap" }}
            dangerouslySetInnerHTML={{
              __html: t("footer.important_message.lb"),
            }}
          />
          <Space h={36} />
        </>
      )}
      <InfoText dangerouslySetInnerHTML={{ __html: t("footer.info_text") }} />

      {simplified ? <Space h={24} /> : <Space h={32} />}
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  columnCenteredX: true,
  paddingY: rem(16),
  paddingX: rem(2),
});

const SubText = styled("div", {
  body3: true,

  marginBottom: rem(10),
  marginTop: rem(10),
  opacity: 0.9,
  fontWeight: 500,

  whiteSpace: "nowrap",
});

const Text = styled("div", {
  body3: true,
  textAlign: "center",
  justifyContent: "center",

  opacity: 0.8,
  lineHeight: rem(22),
  wordBreak: "keep-all",
});

const SnsContainer = styled("div", {
  rowCenteredY: true,
  marginBottom: rem(16),
});

const InfoText = styled("div", {
  rowCenteredY: true,
  caption1: true,
  paddingX: rem(12),
  paddingY: rem(4),
  borderRadius: rem(16),
  transform: "scaleY(0.95)",
  color: "$gray700",
  whiteSpace: "nowrap",

  "& b": {
    marginLeft: rem(4),
    fontWeight: 700,
    color: "$gray800",
  },
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
