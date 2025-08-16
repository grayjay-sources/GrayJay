
const PLATFORM = "GODRESOURCE";

var config = {};

// Global variables

let grChannels = []
let grLatestVideos = []
const grDefaultThumbnail = "https://www.godresource.com/Images/Logos/GRLogo.jpg"
const grChannelApi = "https://api.godresource.com/api/Channels/"
const grChannelUrl = "https://new.godresource.com/c/"
const grVideoUrl = "https://new.godresource.com/video/"

// function to convert video object to PlatformVideo class
function grVideoToPlatformVideo(v) {
    if (v.type === "Video") {
        return new PlatformVideo({
            id          : new PlatformID(PLATFORM, v.id, config.id),
            name        : v.title ?? "Stream started at " + (new Date(v.streamDateCreated)).toLocaleString(),
            thumbnails  : new Thumbnails([new Thumbnail(v.thumbnail,0)]),
            author      : grGetPlatformAuthorLink(v.channelStreamName, v.channelName),
            datetime    : Math.round((new Date(v.streamDateCreated)).getTime() / 1000),
            url         : v.streamUrl,
            shareUrl    : grVideoUrl + v.streamUrlKey,
            duration    : 0,
            viewCount   : v.views,
            isLive      : v.isLive
        })
    }
}

// function to get the channel details from name
function grGetChannel(channelStreamName) {
    return grChannels.find((c) => c.channelStreamName === channelStreamName)
}

// function to return PlatformChannel object from name
function grGetPlatformChannel(channelStreamName) {
    const channel = grGetChannel(channelStreamName)
    if (channel) {
        return new PlatformChannel({
            id: new PlatformID(PLATFORM, channelStreamName, config.id),
            name: channel.name,
            thumbnail: grDefaultThumbnail,
            banner: null,
            subscribers: 0,
            description: 0,
            url: grChannelUrl + channelStreamName,
            links: {}
        });
    }
}

// function to return PlatformAuthorLink object from name
function grGetPlatformAuthorLink(channelStreamName, channelName) {
    return new PlatformAuthorLink(
        new PlatformID(PLATFORM, channelStreamName, config.id), 
        channelName, 
        grChannelUrl + channelStreamName, 
        grDefaultThumbnail
    );
}



//Plugin Enabled/Started
source.enable = function (conf) {
    
    //Store Config
    config = conf ?? {}
    
    /*Initialise home page and channel list
    const grGetChannels = async () => {
      const response = await fetch(grChannelApi);
      const json = await response.json();
      return json
    }
    grGetChannels().then(
        function(value) {
            if (value.error) {
                throwException('error',value.error)
            } else {
                grChannels = value.channels
                grChannels.forEach(function(e) {
                    grLatestVideos = grLatestVideos.concat(e.streams)
                })
            }
        },
        function(error) {
            throwException('error',error)
        }
    )*/
    const response = http.GET(grChannelApi, {});
    if (response.code != 200) {
        log("Failed to get video detail", response);
        return null;
    }
    const obj = JSON.parse(response.body);
    if (obj.error) {
        log("God Resource error:", obj.error);
        return null;
    }
    grChannels = obj.channels
    grChannels.forEach((c) => grLatestVideos = grLatestVideos.concat(c.streams))
}

source.getHome = function() {
    /**
     * @param continuationToken: any?
     * @returns: VideoPager
     */
    
    const videos = grLatestVideos.map((v) => grVideoToPlatformVideo(v))
    return new grHomeVideoPager(videos, false);
}

source.searchSuggestions = function(query) {
    /**
     * @param query: string
     * @returns: string[]
     */

    const suggestions = []; //The suggestions for a specific search query
    return suggestions;
}

source.getSearchCapabilities = function() {
    return {
        types: [Type.Feed.Mixed],
        sorts: [Type.Order.Chronological, "streamDateCreated"],
        filters: [
            {
                id: "date",
                name: "Date",
                isMultiSelect: false,
                filters: [
                    { id: Type.Date.Today, name: "Last 24 hours", value: "today" },
                    { id: Type.Date.LastWeek, name: "Last week", value: "thisweek" },
                    { id: Type.Date.LastMonth, name: "Last month", value: "thismonth" },
                    { id: Type.Date.LastYear, name: "Last year", value: "thisyear" }
                ]
            },
        ]
    };
}

source.search = function (query, type, order, filters, continuationToken) {
    /**
     * @param query: string
     * @param type: string
     * @param order: string
     * @param filters: Map<string, Array<string>>
     * @param continuationToken: any?
     * @returns: VideoPager
     */
    const videos = []; // The results (PlatformVideo)
    const hasMore = false; // Are there more pages?
    const context = { query: query, type: type, order: order, filters: filters, continuationToken: continuationToken }; // Relevant data for the next page
    return new grSearchVideoPager(videos, hasMore, context);
}

source.getSearchChannelContentsCapabilities = function () {
    //This is an example of how to return search capabilities on a channel like available sorts, filters and which feed types are available (see source.js for more details)
    return {
        types: [Type.Feed.Mixed],
        sorts: [Type.Order.Chronological],
        filters: []
    };
}

source.searchChannelContents = function (url, query, type, order, filters, continuationToken) {
    /**
     * @param url: string
     * @param query: string
     * @param type: string
     * @param order: string
     * @param filters: Map<string, Array<string>>
     * @param continuationToken: any?
     * @returns: VideoPager
     */

    const videos = []; // The results (PlatformVideo)
    const hasMore = false; // Are there more pages?
    const context = { channelUrl: channelUrl, query: query, type: type, order: order, filters: filters, continuationToken: continuationToken }; // Relevant data for the next page
    return new grSearchChannelVideoPager(videos, hasMore, context);
}

source.searchChannels = function (query, continuationToken) {
    /**
     * @param query: string
     * @param continuationToken: any?
     * @returns: ChannelPager
     */
    
    const channels = grChannels.filter((c)=>c.name.toLowerCase().indexOf(query.toLowerCase())>0)
    return new grChannelPager(channels.map((c) => grGetPlatformChannel(c.channelStreamName)),false)
    //return new grChannelPager(channels.map((c) => grGetPlatformAuthorLink(c.channelStreamName, c.channelName)),false)
}

source.isChannelUrl = function(url) {
    return url.startsWith(grChannelUrl);
}

source.getChannel = function(url) {
	const tokens = url.split('/');
	const handle = tokens[tokens.length - 1];
    return grGetPlatformChannel(handle)
}

source.getChannelContents = function(url, type, order, filters, continuationToken) {
    /**
     * @param url: string
     * @param type: string
     * @param order: string
     * @param filters: Map<string, Array<string>>
     * @param continuationToken: any?
     * @returns: VideoPager
     */
    
    //Get the channel
	const tokens = url.split('/');
	const handle = tokens[tokens.length - 1];
    
    //Initially only show the videos from home page
    console.log(continuationToken)
    let minStreamId = null
    if (continuationToken) {
        console.log('a')
        if (continuationToken.minStreamId) {
            console.log('b')
            minStreamId = continuationToken.minStreamId
        }
    }
    console.log('c')
    if (!minStreamId) {
        console.log('d')
        const channel = grGetChannel(handle)
        const videos = channel.streams.map((v) => grVideoToPlatformVideo(v))
        const hasMore = videos.count === 10; //Max shown on home page (assume this means there is more)
        const context = { 
            url     : url,
            type    : type, 
            order   : order, 
            filters : filters, 
            continuationToken: {
                minStreamId : Math.min.apply(Math,videos.map((v) => parseInt(v.streamId)))
            }
        }
        return new grChannelVideoPager(videos, hasMore, context);
    }
    console.log('e')

    
    //Then fetch all on continuation
    const res = http.GET(grChannelApi + handle, {});
	if (res.code != 200) {
		log("Failed to get videos", res);
		return new VideoPager([], false);
	}
    const channel = JSON.parse(res.body);
    if (channel.error) {
        log("God Resource error:", channel.error);
        return new VideoPager([], false);
    }
    
    //Return
    const videos = channel.streams.filter((v) => v.streamId < continuationToken.minStreamId).map((v) => grVideoToPlatformVideo(v))
    const hasMore = false; // Are there more pages?
    const context = { 
        url     : url,
        type    : type, 
        order   : order, 
        filters : filters, 
        continuationToken: {
            minStreamId : 0
        }
    };
    return new grChannelVideoPager(videos, hasMore, context);
}

source.isContentDetailsUrl = function(url) {
    /**
     * @param url: string
     * @returns: boolean
     */

    return REGEX_DETAILS_URL.test(url);
}

source.getContentDetails = function(url) {
    /**
     * @param url: string
     * @returns: PlatformVideoDetails
     */

    return new PlatformVideoDetails({
        //... see source.js for more details
    });
}

source.getComments = function (url, continuationToken) {
    /**
     * @param url: string
     * @param continuationToken: any?
     * @returns: CommentPager
     */

    const comments = []; // The results (Comment)
    const hasMore = false; // Are there more pages?
    const context = { url: url, continuationToken: continuationToken }; // Relevant data for the next page
    return new grCommentPager(comments, hasMore, context);

}
source.getSubComments = function (comment) {
    /**
     * @param comment: Comment
     * @returns: grCommentPager
     */

    if (typeof comment === 'string') {
        comment = JSON.parse(comment);
    }

    return getCommentsPager(comment.context.claimId, comment.context.claimId, 1, false, comment.context.commentId);
}

class grCommentPager extends CommentPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }

    nextPage() {
        return source.getComments(this.context.url, this.context.continuationToken);
    }
}

class grHomeVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.getHome(this.context.continuationToken);
    }
}

class grSearchVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.search(this.context.query, this.context.type, this.context.order, this.context.filters, this.context.continuationToken);
    }
}

class grSearchChannelVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.searchChannelContents(this.context.channelUrl, this.context.query, this.context.type, this.context.order, this.context.filters, this.context.continuationToken);
    }
}

class grChannelPager extends ChannelPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.searchChannels(this.context.query, this.context.continuationToken);
    }
}

class grChannelVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.getChannelContents(this.context.url, this.context.type, this.context.order, this.context.filters, this.context.continuationToken);
    }
}
