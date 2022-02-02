import React, { useEffect, useMemo, useRef, useState } from "react";

import { rem } from "polished";

import useApi from "@hooks/useApi";
import { dayjs, isInTimeRange, isNotInTimeRange } from "@utils/date-util";
import DomesticApi from "@apis/domestic-api";
import { numberWithCommas } from "@utils/number-util";
import { css, styled } from "@styles/stitches.config";

import { Modal } from "@components/Modal";
import { InstagramIconBox, TwitterIconBox } from "@components/SnsIconBox";

const ConfirmedCasesModal: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data } = useApi(DomesticApi.live, { suspense: false });

  const skipInterval = useRef(false);
  const intervalId = useRef<ReturnType<typeof setInterval>>();

  const title = useMemo(() => {
    const date = dayjs().subtract(12, "hour");
    return date.format("M월 D일");
  }, []);

  useEffect(() => {
    const intervalFunc = () => {
      console.log(1);
      if (isInTimeRange("09:00:00", "23:00:00")) {
        if (openModal === true) setOpenModal(false);
      } else {
        if (openModal === false) {
          if (skipInterval.current === false) {
            setOpenModal(true);
            skipInterval.current = true;
          }
        }
      }
    };

    intervalFunc();
    intervalId.current = setInterval(intervalFunc, 5000);

    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

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
      confirmText="닫기"
      title={title}
    >
      <Wrapper>
        <Text>최소수치</Text>
        <Cases>{numberWithCommas(data.live.today)}</Cases>
        <SnsContainer>
          <SnsIcons>
            <TwitterIconBox type="profile" />
            <InstagramIconBox />
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
  "&:after": {
    content: "명",
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
