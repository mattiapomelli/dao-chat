import { Button } from "@components/basic/button";
import { useCreateAttestation } from "@lib/eas/use-create-attestation";

export default function EasPage() {
  const { mutate: createAttestation } = useCreateAttestation({
    onSuccess(attestationUid) {
      console.log(
        "link",
        `https://sepolia.easscan.org/offchain/attestation/view/${attestationUid}`,
      );
    },
  });

  const onCreateAttestation = async () => {
    createAttestation();
  };

  return (
    <div>
      <Button onClick={onCreateAttestation}>Create Attestation</Button>
    </div>
  );
}
