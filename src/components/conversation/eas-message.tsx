import Image from "next/image";

import { EAS_CONFIG } from "@lib/eas/config";

interface EasMessageProps {
  attestationUid: string;
}

export const EasMessage = ({ attestationUid }: EasMessageProps) => {
  return (
    <div>
      <div className="my-4 flex items-center gap-2">
        <Image src={"/eas.png"} width={45} height={45} alt="EAS Logo" />
        <p className="max-w-[180px]">Vote Attestation, powered by EAS</p>
      </div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
        href={`${EAS_CONFIG.baseUrl}/offchain/attestation/view/${attestationUid}`}
      >
        View on EASScan
      </a>
    </div>
  );
};
