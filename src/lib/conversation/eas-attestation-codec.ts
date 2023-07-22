import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentTypeEasAttestationKey = new ContentTypeId({
  authorityId: "daochat.org",
  typeId: "EasAttestation",
  versionMajor: 1,
  versionMinor: 0,
});

interface EasAttestationContent {
  attestationUid: string;
}

export class EasAttestationCodec
  implements ContentCodec<EasAttestationContent>
{
  get contentType() {
    return ContentTypeEasAttestationKey;
  }

  encode(content: EasAttestationContent): EncodedContent {
    return {
      type: ContentTypeEasAttestationKey,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    };
  }

  decode(encodedContent: EncodedContent): EasAttestationContent {
    const json = new TextDecoder().decode(encodedContent.content);
    return JSON.parse(json);
  }
}
