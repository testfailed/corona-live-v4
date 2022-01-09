import React, { useEffect, useState } from "react";

import { rem } from "polished";

import useApi from "@hooks/useApi";
import CommonApi from "@apis/common-api";
import { css, styled } from "@styles/stitches.config";
import { useLocalStorage } from "@hooks/useLocalStorage";

import { Modal } from "@components/Modal";

const AnnouncementModal: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [lastAnnouncementAt, setLastAnnouncementAt] = useLocalStorage(
    "last-announcement-at"
  );

  const { data } = useApi(CommonApi.announcement, {
    suspense: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (data && lastAnnouncementAt !== data?.date) {
      setOpenModal(true);
    }
  }, [data]);

  if (!data?.content?.length) return <></>;

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      className={css({
        width: "85%",
        padding: rem(16),
        maxWidth: rem(300),
        "@md": { width: rem(300) },
      })}
      onConfrim={(close) => {
        setLastAnnouncementAt(data.date);
        close();
      }}
      confirmText="닫기"
      title="공지"
    >
      <Wrapper>
        <Text
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        />
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled("div", {
  alignItems: "center",
  marginBottom: rem(16),
});

const Text = styled("p", {
  marginBottom: rem(10),
  lineHeight: rem(24),
  body3: true,

  wordBreak: "keep-all",
  textAlign: "center",

  "& > strong": {
    fontWeight: 500,
  },

  "& > span": {
    caption2: true,
    opacity: 0.6,
  },

  "& > br": {
    content: "",
    display: "block",
    marginTop: rem(12),
  },
});

export default AnnouncementModal;
