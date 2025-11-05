// GrayJay Plugin Type Definitions
// These are the core types provided by the GrayJay platform

declare const source: any;
declare const http: any;
declare const bridge: any;
declare const domParser: any;
declare const console: Console;

declare class VideoPager {
  hasMore(): boolean;
  nextPage(): PlatformVideo[];
}

declare class ChannelPager {
  hasMore(): boolean;
  nextPage(): PlatformChannel[];
}

declare class PlaylistPager {
  hasMore(): boolean;
  nextPage(): PlatformPlaylist[];
}

declare class CommentPager {
  hasMore(): boolean;
  nextPage(): Comment[];
}

interface PlatformVideo {
  id: string;
  name: string;
  thumbnails: Thumbnails;
  author: PlatformAuthorLink;
  uploadDate: number;
  duration: number;
  viewCount: number;
  url: string;
  isLive: boolean;
}

interface PlatformVideoDetails extends PlatformVideo {
  description: string;
  video: VideoSourceDescriptor;
  live?: VideoSourceDescriptor;
  rating: RatingLikes;
  subtitles: string[];
}

interface PlatformChannel {
  id: string;
  name: string;
  thumbnail: string;
  banner: string;
  subscribers: number;
  description: string;
  url: string;
}

interface PlatformAuthorLink {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

interface PlatformPlaylist {
  id: string;
  name: string;
  author: PlatformAuthorLink;
  videoCount: number;
  thumbnail: string;
  url: string;
}

interface PlatformPlaylistDetails extends PlatformPlaylist {
  contents: VideoPager;
}

interface Comment {
  contextUrl: string;
  author: PlatformAuthorLink;
  message: string;
  rating: RatingLikes;
  date: number;
  replyCount: number;
  context: any;
}

interface Thumbnails {
  sources: Thumbnail[];
}

interface Thumbnail {
  width: number;
  height: number;
  url: string;
}

interface VideoSourceDescriptor {
  isUnMuxed: boolean;
  videoSources: VideoUrlSource[];
  audioSources: AudioUrlSource[];
}

interface VideoUrlSource {
  width: number;
  height: number;
  container: string;
  codec: string;
  name: string;
  bitrate: number;
  duration: number;
  url: string;
}

interface AudioUrlSource {
  name: string;
  bitrate: number;
  container: string;
  codecs: string;
  duration: number;
  url: string;
  language: string;
}

interface RatingLikes {
  type: number;
  likes: number;
  dislikes?: number;
}

interface ResultCapabilities {
  types: string[];
  sorts: string[];
  filters: any[];
}

declare namespace Type {
  namespace Feed {
    const Mixed: string;
    const Videos: string;
    const Streams: string;
    const Channels: string;
    const Playlists: string;
  }
  
  namespace Order {
    const Chronological: string;
    const Alphabetical: string;
  }
}

declare class ScriptException extends Error {
  constructor(message: string);
}

interface Console {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}
