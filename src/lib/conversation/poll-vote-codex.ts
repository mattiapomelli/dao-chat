import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentTypeVotePollKey = new ContentTypeId({
  authorityId: "daochat.org",
  typeId: "pollVote",
  versionMajor: 1,
  versionMinor: 0,
});

interface PollVoteContent {
  pollId: string; // Unique identifier for the poll that this vote is for
  voteIndex: number; // Index of the choice that the user voted for
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
