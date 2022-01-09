import React, { useEffect, useMemo, useRef, useState } from "react";

import { rem } from "polished";

import useApi from "@hooks/useApi";
import { HOUR } from "@constants/constants";
import { numberWithCommas } from "@utils/number-util";
import { css, styled } from "@styles/stitches.config";

import { Modal } from "@components/Modal";
import { InstagramIconBox, TwitterIconBox } from "@components/SnsIconBox";
import DomesticApi from "@apis/domestic-api";

const FinalCasesModal: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data } = useApi(DomesticApi.live, { suspense: false });

  const skipInterval = useRef(false);

  const title = useMemo(() => {
    const date = new Date();
    const currentDate = new Date(date.getTime() - 12 * HOUR);
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    return `${month}월 ${day}일`;
  }, []);

  useEffect(() => {
    let intervalId;
    const intervalFunc = () => {
      const currentHours = new Date().getHours();
      if (currentHours >= 23 || currentHours < 9) {
        if (openModal === false) {
          if (skipInterval.current === false) {
            setOpenModal(true);
            skipInterval.current = true;
          }
        }
      } else {
        if (openModal === true) setOpenModal(false);
      }
    };

    intervalFunc();
    intervalId = setInterval(intervalFunc, 5000);

    return () => {
      clearInterval(intervalId);
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
          {/* <Text>SNS로 보기</Text> */}
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

export default FinalCasesModal;
