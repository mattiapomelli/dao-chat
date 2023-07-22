import { useQuery } from "@airstack/airstack-react";
import { Popover } from "@headlessui/react";
import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import cx from "classnames";
import { gql } from "graphql-request";
import Blockies from "react-blockies";

import { Address } from "@components/address";
import { useXmtp } from "@providers/xmtp-provider";
import { AIRSTACK_SOCIALS } from "@utils/constants";

import { EasMessage } from "./eas-message";
import { Poll } from "./poll";

const querySocialProfile = gql`
  query WalletSocials($address: Identity!) {
    Wallet(input: { identity: $address, blockchain: ethereum }) {
      socials {
        dappName
        profileName
      }
      primaryDomain {
        name
      }
      domains {
        name
      }
    }
  }
`;

interface MessageProps {
  conversation: Conversation;
  message: DecodedMessage;
  allMessages: DecodedMessage[];
  onVote?(): void;
}

const supportedContentTypes = ["poll", "text", "EasAttestation"];

export const Message = ({
  allMessages,
  message,
  conversation,
  onVote,
}: MessageProps) => {
  const { userAddress } = useXmtp();
  const { data: socialProfile } = useQuery(
    querySocialProfile,
    {
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", //address,
    },
    { cache: false },
  );

  const isSender = message.senderAddress === userAddress;

  if (!supportedContentTypes.includes(message.contentType.typeId)) return null;

  console.log("Profile:", socialProfile);

  return (
    <div className={cx("flex", "max-w-[400px]", isSender ? "ml-auto" : "")}>
      <div className="rounded-box bg-base-300 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Popover className="relative">
            <Popover.Button className="flex gap-2">
              <Blockies
                data-testid="avatar"
                seed={message.senderAddress}
                scale={4}
                size={6}
                className="rounded-full"
              />
              <Address
                address={message.senderAddress as `0x${string}`}
                className="font-bold"
              />
            </Popover.Button>
            <Popover.Panel className="absolute z-10 rounded border-2 bg-white px-14 py-7 shadow">
              <div className="space-y-4 text-center">
                <Blockies
                  data-testid="avatar"
                  seed={message.senderAddress}
                  scale={4}
                  size={25}
                  className="m-auto rounded-full"
                />
                <div>
                  {socialProfile &&
                    // @ts-ignore
                    socialProfile.Wallet.socials.map((social) => (
                      <p
                        key={social.dappName}
                        className="flex items-center gap-1"
                      >
                        <img
                          // @ts-ignore
                          src={AIRSTACK_SOCIALS[social.dappName].icon}
                          className="h-5"
                        />
                        <a
                          // @ts-ignore
                          href={`${AIRSTACK_SOCIALS[social.dappName].url}${
                            social.profileName
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {social.dappName}
                          {social.profileName}
                        </a>
                      </p>
                    ))}
                  {socialProfile && socialProfile.Wallet.primaryDomain && (
                    <p className="flex items-center gap-1">
                      <img src="/ENS.jpeg" className="h-5" />
                      <a
                        href={`https://app.ens.domains/${socialProfile.Wallet.primaryDomain.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {socialProfile.Wallet.primaryDomain.name}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Popover>
        </div>
        {message.contentType.typeId === "poll" && (
          <Poll
            message={message}
            conversation={conversation}
            allMessages={allMessages}
            onVote={onVote}
          />
        )}
        {message.contentType.typeId === "EasAttestation" && (
          <EasMessage attestationUid={message.content.attestationUid} />
        )}
        {message.contentType.typeId === "text" && <p>{message.content}</p>}
      </div>
    </div>
  );
};
