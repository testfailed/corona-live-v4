import React, { useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useTimeoutState } from "@hooks/useTimeoutState";
import { KAKAOPAY_URL, TOSS_URL } from "@constants/constants";
import { css, styled, theme } from "@styles/stitches.config";
import { fadeInUp } from "@styles/animations/fade-animation";

import Space from "@components/Space";
import Column from "@components/Column";
import { Modal } from "@components/Modal";
import TossIcon from "@components/icon/Icon_Toss";
import CheckIcon from "@components/icon/Icon_Check";
import KakaoPayIcon from "@components/icon/Icon_KakaoPay";

const DonationModalTrigger: React.FC = ({ children }) => {
  const { t } = useTranslation();

  const [copied, setCopied] = useTimeoutState(false, 1000);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  return (
    <Modal
      className={css({
        width: "85%",
        maxWidth: rem(300),
        padding: rem(16),
        background: "$white",

        "@md": { width: rem(300) },
      })}
      confirmText={t("close")}
      onConfrim={(closeModal) => {
        closeModal();
      }}
      onOpenChange={(isOpen) => {
        if (isOpen === false) {
          setIsAnimationEnabled(false);
        }
      }}
      title={t("donation_modal.title")}
      triggerNode={children}
    >
      <Wrapper>
        <SubText> {t("donation_modal.bank_account")} </SubText>
        <Container>
          <BankAccounInfo>
            {t("donation_modal.kakaobank")} | 홍준서
          </BankAccounInfo>
          <CopyToClipboard text={3333188178788} onCopy={() => setCopied(true)}>
            <BankAccoutContainer
              onClick={() => {
                setIsAnimationEnabled(true);
              }}
            >
              <BankAccountNumber>3333-18-8178788</BankAccountNumber>

              <BankAccountCopyButton animation={isAnimationEnabled}>
                {copied ? (
                  <span key={"copied"}>
                    <CheckIcon size={16} fill={theme.colors.gray600} />
                  </span>
                ) : (
                  <span key={"not-copied"}>{t("copy")}</span>
                )}
              </BankAccountCopyButton>
            </BankAccoutContainer>
          </CopyToClipboard>
        </Container>

        <Space h={16} />

        <PayContainer>
          <Column centeredX>
            <SubText>{t("donation_modal.kakaopay")}</SubText>
            <IconContainer href={KAKAOPAY_URL} target="_blank">
              <KakaoPayIcon style={{ transform: `translateY(${rem(1)})` }} />
            </IconContainer>
          </Column>
          <Column centeredX>
            <SubText>{t("donation_modal.toss")}</SubText>
            <IconContainer href={TOSS_URL} target="_blank">
              <TossIcon />
            </IconContainer>
          </Column>
        </PayContainer>
        <Space h={24} />
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled("div", {
  columnCenteredX: true,
});

const SubText = styled("div", {
  body3: true,

  opacity: 0.8,
  marginBottom: rem(6),
});

const Container = styled("div", {
  borderRadius: rem(8),
  boxShadow: "$elevation2",
  border: `${rem(1)} solid rgba($gray900rgb, 0.15)`,
  paddingX: rem(12),
  paddingY: rem(6),
  background: "$shadowBackground1",
});

const IconContainer = styled("a", {
  borderRadius: rem(8),
  boxShadow: "$elevation2",
  border: `${rem(1)} solid rgba($gray900rgb, 0.15)`,
  paddingX: rem(12),
  background: "$shadowBackground1",

  centered: true,
  minHeight: rem(36),
  maxHeight: rem(36),
});

const PayContainer = styled("div", {
  rowCenteredY: true,
  justifyContent: "space-evenly",
  width: "100%",
});

const BankAccounInfo = styled("div", {
  caption1: true,

  opacity: 0.8,
});

const BankAccoutContainer = styled("div", {
  rowCenteredY: true,
  cursor: "pointer",
});

const BankAccountNumber = styled("div", {
  subtitle1: true,
});

const BankAccountCopyButton = styled("div", {
  marginLeft: rem(8),
  background: "$gray100",
  border: `${rem(1)} solid $donationButtonBorder`,
  body3: true,

  fontWeight: 500,
  paddingX: rem(8),
  borderRadius: rem(4),
  paddingY: rem(1.5),
  overflow: "hidden",

  "& span": {
    minWidth: rem(20),
    maxWidth: rem(20),
    minHeight: rem(20),
    maxHeight: rem(20),
    wordBreak: "keep-all",
    centered: true,
  },

  variants: {
    animation: {
      true: {
        "& span": {
          animation: `${fadeInUp} 350ms`,
        },
      },
    },
  },
});

export default DonationModalTrigger;
