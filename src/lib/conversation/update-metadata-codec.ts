import { ContentCodec, ContentTypeId, EncodedContent } from "@xmtp/xmtp-js";

export const ContentUpdateMetadataKey = new ContentTypeId({
  authorityId: "daochat.org",
  typeId: "updateMetadata",
  versionMajor: 1,
  versionMinor: 0,
});

interface UpdateMetadataContent {
  metadata?: {
    // Metadata for the group chat
    [key: string]: string;
  };
}

export class UpdateMetadataCodec
  implements ContentCodec<UpdateMetadataContent>
{
  get contentType() {
    return ContentUpdateMetadataKey;
  }

  encode(content: UpdateMetadataContent): EncodedContent {
    return {
      type: ContentUpdateMetadataKey,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    };
  }

  decode(encodedContent: EncodedContent): UpdateMetadataContent {
    const json = new TextDecoder().decode(encodedContent.content);
    return JSON.parse(json);
  }
}
