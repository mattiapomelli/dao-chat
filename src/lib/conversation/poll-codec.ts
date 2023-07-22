import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentTypePollKey = new ContentTypeId({
  authorityId: "daochat.org",
  typeId: "poll",
  versionMajor: 1,
  versionMinor: 0,
});

interface PollContent {
  id: string; // Unique identifier for this poll, used to identify the poll in the poll votes
  title: string; // Title of the poll
  body: string; // Body of the poll
  choices: string[]; // List of possible choices for the poll
  start: number; // Timestamp of when the poll starts
  end: number; // Timestamp of when the poll ends
  appId: string; // Unique identifier for the app that the poll is for (e.g. Snapshot)
  metadata?: {
    // Custom metadata for the poll, specific to the app
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
