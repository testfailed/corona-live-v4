import React, { useMemo, useRef, useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";
import { dayjs, isInTimeRange } from "@utils/date-util";
import DomesticApi from "@features/domestic/domestic-api";
import { numberWithCommas } from "@utils/number-util";
import { css, styled } from "@styles/stitches.config";

import { Modal } from "@components/Modal";
import {
  InstagramIconButton,
  TwitterIconButton,
} from "@components/FooterIconButtons";
import { useInterval } from "@hooks/useInterval";

const ConfirmedCasesModal: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data } = useApi(DomesticApi.live, { suspense: false });
  const skipInterval = useRef(false);

  const { t } = useTranslation();

  const title = useMemo(() => {
    const date = dayjs().subtract(12, "hour");
    return date.format("M월 D일");
  }, []);

  useInterval(
    () => {
      if (isInTimeRange("09:00:00", "22:00:00")) {
        if (openModal === true) setOpenModal(false);
      } else {
        if (openModal === false) {
          if (skipInterval.current === false) {
            setOpenModal(true);
            skipInterval.current = true;
          }
        }
      }
    },
    5000,
    []
  );

  if (!data) return <></>;

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      className={css({
        padding: rem(16),
        width: "85%",
        maxWidth: rem(300),
        "@md": { width: rem(300) },
      })}
      onConfrim={(close) => close()}
      confirmText={t("close")}
      title={title}
    >
      <Wrapper>
        <Text>{t("confirmed_modal.text")}</Text>
        <Cases>
          {numberWithCommas(data.live.today)}
          <span>{t("stat.unit")}</span>
        </Cases>

        <SnsContainer>
          <SnsIcons>
            <TwitterIconButton />
            <InstagramIconButton />
          </SnsIcons>
        </SnsContainer>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled("div", {
  columnCenteredX: true,
  paddingTop: rem(6),
  paddingBottom: rem(6),
});

const Text = styled("div", {
  body3: true,

  opacity: 0.8,
  letterSpacing: rem(1),
});

const Cases = styled("div", {
  heading1: true,
  justifyContent: "center",

  "& span": {
    fontWeight: 300,
  },
});

const SnsContainer = styled("div", {
  columnCenteredX: true,
  paddingTop: rem(16),
  paddingBottom: rem(24),
});

const SnsIcons = styled("div", {
  row: true,
  marginTop: rem(6),
});

export default ConfirmedCasesModal;
