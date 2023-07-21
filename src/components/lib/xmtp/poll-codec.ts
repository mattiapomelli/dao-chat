import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentTypePollKey = new ContentTypeId({
  authorityId: "daochat.org",
  typeId: "poll",
  versionMajor: 1,
  versionMinor: 0,
});

interface PollContent {
  question: string;
  options: string[];
  metadata?: {
    [key: string]: string;
  };
}

export class PollCodec implements ContentCodec<PollContent> {
  get contentType() {
    return ContentTypePollKey;
  }

  encode(content: PollContent): EncodedContent {
    return {
      type: ContentTypePollKey,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    };
  }

  decode(encodedContent: EncodedContent): PollContent {
    const json = new TextDecoder().decode(encodedContent.content);
    return JSON.parse(json);
  }
}
