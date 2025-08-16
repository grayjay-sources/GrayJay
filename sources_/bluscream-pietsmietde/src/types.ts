//#region custom types
export type Settings = {
    readonly yt_proxy_server: number
    readonly merge_yt_metrics: boolean
    readonly use_yt_proxy: boolean
}
export type State = {
    readonly cachedChannels: {
        readonly [key: string]: ChannelResponse
    }
}
export type PietsmietDESource = Required<Omit<Source<
    { readonly [key: string]: string },
    string,
    FeedType,
    SearchTypes,
    ChannelContentsTypeCapabilities,
    Settings
>,
    "searchSuggestions"
    | "getSubComments"
    | "getLiveChatWindow"
    | "searchChannelContents"
    | "getContentRecommendations"
    | "getChannelContents"
    | "getChannelCapabilities"
    | "searchChannels"
    | "searchPlaylists"
    | "getChannelPlaylists"
    | "getPlaybackTracker"
    | "getUserPlaylists"
    | "getUserSubscriptions"
>>
export type SearchTypes = typeof Type.Feed.Videos
export type ChannelContentsTypeCapabilities = typeof Type.Feed.Videos
export type CommentContext = {
    readonly commentId: string
}
//#endregion

//#region json types
type ChannelResponse = {
    readonly title: string
    readonly first_video?: {
        readonly thumbnail: {
            readonly variations: {
                readonly url: string
            }[]
        }
    }
    readonly followings_count: number
    readonly description: string
}
export type HomeResponse = {
    readonly data: Video[]
}
export type VideoResponse = {
    readonly video: Video
}
type Video = {
    readonly id: string
    readonly title: string
    readonly thumbnail: {
        readonly variations: {
            readonly url: string
            readonly height: number
        }[]
    }
    readonly channels: {
        readonly url_slug: string
        readonly id: number
        readonly title: string
    }[]
    readonly publish_date: string
    readonly duration: number
    readonly url: string
    readonly short_url: string
    readonly likes_count: number
    readonly description: string
    readonly comments_count: number
}
export type StreamResponse = {
    readonly options: {
        readonly tracks: {
            readonly sources: {
                readonly hls: {
                    readonly src: string
                }
                readonly dash: {
                    readonly src: string
                }
                readonly mp4: {
                    readonly src: string
                    readonly type?: string
                }
            }
            readonly full_title: string
            readonly main: boolean
        }[]
    }
}
export type YoutubeResponse = {
    readonly "youtube-data": {
        readonly items: {
            readonly id: string
            readonly statistics: {
                readonly viewCount: string
                readonly likeCount: string
                readonly commentCount: string
            }
        }[]
    }
    readonly "youtube-dislike": {
        readonly dislikes: number
    }
    readonly "youtube-transcripts"?: {
        readonly [key: string]: {
            readonly url: string
            readonly is_generated: boolean
            readonly is_translatable: boolean
        }
    }
}
export type CommentResponse = {
    readonly data: {
        readonly user: {
            readonly name: string
            readonly url_slug: string
            readonly avatar?: {
                readonly variations: {
                    readonly url: string
                }[]
            }
        }
        readonly text: string
        readonly created_at: string
        readonly count_replies: number
        readonly likes_count: number
        readonly dislikes_count: number
        readonly id: string
    }[]
    readonly meta: {
        readonly current_page: number
        readonly last_page: number
    }
}
//#endregion
