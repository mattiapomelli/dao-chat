import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentTypeVotePollKey = new ContentTypeId({
  authorityId: "daochat.org",
  typeId: "pollVote",
  versionMajor: 1,
  versionMinor: 0,
});

interface PollVoteContent {
  pollId: string;
  voteIndex: number;
}

export class PollVoteCodec implements ContentCodec<PollVoteContent> {
  get contentType() {
    return ContentTypeVotePollKey;
  }

  encode(content: PollVoteContent): EncodedContent {
    return {
      type: ContentTypeVotePollKey,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    };
  }

  decode(encodedContent: EncodedContent): PollVoteContent {
    const json = new TextDecoder().decode(encodedContent.content);
    return JSON.parse(json);
  }
}
