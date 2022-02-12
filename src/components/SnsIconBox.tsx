import React from "react";

import { rem } from "polished";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { styled, theme } from "@styles/stitches.config";

import {
  EMAIL,
  INSTA_SNS_URL,
  TWITTER_SNS_URL,
  TWITTER_URL,
  WEB_URL,
} from "@constants/constants";
import { useTimeoutState } from "@hooks/useTimeoutState";
import { fadeInUp } from "@styles/animations/fade-animation";

import LinkIcon from "./icon/Icon_Link";
import EmailIcon from "./icon/Icon_Email";
import CheckIcon from "./icon/Icon_Check";
import TwitterIcon from "./icon/Icon_Twitter";
import InstagramIcon from "./icon/Icon_Instagram";

const IconBox = styled("a", {
  width: rem(34),
  height: rem(34),
  borderRadius: rem(8),
  marginX: rem(8),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

type SnsType = "profile" | "share";

export const TwitterIconBox: React.FC<{ type: SnsType }> = ({ type }) => (
  <IconBox
    css={{ background: "$sky100" }}
    href={type === "share" ? TWITTER_URL : TWITTER_SNS_URL}
    target="_blank"
  >
    <TwitterIcon size={14} stroke={theme.colors.sky500} />
  </IconBox>
);

export const LinkIconBox: React.FC = () => {
  const [copied, setCopied] = useTimeoutState(false, 1000);
  return (
    <CopyToClipboard
      text={WEB_URL}
      onCopy={() => {
        setCopied(true);
      }}
    >
      <IconBox css={{ background: "$gray300" }}>
        {copied ? (
          <IconContainer key={"copied"}>
            <CheckIcon size={18} />
          </IconContainer>
        ) : (
          <IconContainer key={"not-copied"}>
            <LinkIcon size={14} />
          </IconContainer>
        )}
      </IconBox>
    </CopyToClipboard>
  );
};

export const EmailIconBox: React.FC = () => {
  const [copied, setCopied] = useTimeoutState(false, 1000);
  return (
    <CopyToClipboard
      text={EMAIL}
      onCopy={() => {
        setCopied(true);
      }}
    >
      <IconBox css={{ background: "$gray300" }}>
        {copied ? (
          <IconContainer key={"copied"}>
            <CheckIcon size={18} />
          </IconContainer>
        ) : (
          <IconContainer key={"not-copied"}>
            <EmailIcon size={18} />
          </IconContainer>
        )}
      </IconBox>
    </CopyToClipboard>
  );
};

const IconContainer = styled("div", {
  centered: true,
  animation: `${fadeInUp} 350ms`,
});

export const InstagramIconBox: React.FC = () => (
  <IconBox
    css={{ background: "$pink100" }}
    href={INSTA_SNS_URL}
    target="_blank"
  >
    <InstagramIcon size={14} />
  </IconBox>
);
