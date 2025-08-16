
// Global variables
let grChannels = []
let grLatestVideos = []
let defaultThumbnail = "https://www.godresource.com/Images/Logos/GRLogo.jpg"

//Plugin Enabled
source.enable = function (conf) {
    /**
     * @param conf: SourceV8PluginConfig (the SomeConfig.js)
     */
     
    //maybe load the channels up here to global variable??
    //Assume this method calls when app is loaded on startup?
    const grGetChannels = async () => {
      const response = await fetch('https://api.godresource.com/api/Channels');
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
                    e.streams = null
                })
            }
        },
        function(error) {
            throwException('error',error)
        }
    )
}

source.getHome = function(continuationToken) {
    /**
     * @param continuationToken: any?
     * @returns: VideoPager
     */
    
    const videos = []; // The results (PlatformVideo)
    grLatestVideos.forEach(function(e) {
        if (e.type === "Video") {
            videos.push(new PlatformVideo({
                id          : new PlatformID(), //PlatformID
                name        : e.title ?? "Stream started at " + (new Date(e.streamDateCreated)).toLocaleString(),
                thumbnails  : new Thumbnail(e.thumbnail),
                author      : new PlatformAuthorLink(new PlatformID(), e.channelName, "https://new.godresource.com/c/" + e.channelStreamName, defaultThumbnail),
                datetime    : (new Date(e.streamDateCreated)).getTime(),
                url         : e.streamUrl,
                shareUrl    : "https://new.godresource.com/video/" + e.streamUrlKey,
                duration    : -1,
                viewCount   : e.views,
                isLive      : e.isLive
            }))
        }
    })
    
    const hasMore = false; // Are there more pages?
    const context = { continuationToken: continuationToken }; // Relevant data for the next page
    return new SomeHomeVideoPager(videos, hasMore, context);
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
    //This is an example of how to return search capabilities like available sorts, filters and which feed types are available (see source.js for more details) 
    return {
        types: [Type.Feed.Mixed],
        sorts: [Type.Order.Chronological, "^release_time"],
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
    return new SomeSearchVideoPager(videos, hasMore, context);
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
    return new SomeSearchChannelVideoPager(videos, hasMore, context);
}

source.searchChannels = function (query, continuationToken) {
    /**
     * @param query: string
     * @param continuationToken: any?
     * @returns: ChannelPager
     */

    const channels = []; // The results (PlatformChannel)
    const hasMore = false; // Are there more pages?
    const context = { query: query, continuationToken: continuationToken }; // Relevant data for the next page
    return new SomeChannelPager(channels, hasMore, context);
}

source.isChannelUrl = function(url) {
    /**
     * @param url: string
     * @returns: boolean
     */
    
    //Valid domain
    let u = new URL(url)
    if (u.host != 'new.godresource.com') {
        return false
    }
    
    //Valid Channels
    switch (u.pathname) {
        case '/c/faithfulword': break;
        case '/c/stedfast': break;
        case '/c/redhot': break;
        case '/c/timcooper': break;
        case '/c/verity': break;
        case '/c/baptistbias': break;
        case '/c/documentaries': break;
        default:
            return false;
    }
    
    //Valid
    return true
}

function grBuildChannelObj(id,name,description,thumbnail,banner,subscribers,urlAlternatives,links) {
    return {
        id              : id            ?? '',
        name            : name          ?? '',
        thumbnail       : thumbnail     ?? '',
        banner          : banner        ?? '',
        subscribers     : subscribers   ?? 0,
        description     : description   ?? '',
        url             : 'https://new.godresource.com/c/' + name,
        urlAlternatives : urlAlternatives ?? [],
        links           : links ?? {}
    }
}

source.getChannel = function(url) {
    
    //All Channels
    let channels = {
        stedfast        : grBuildChannelObj('5' , 'stedfast'        , 'Stedfast Baptist Church'),
        redhot          : grBuildChannelObj('6' , 'redhot'          , 'Red Hot Preaching Conference'),
        timcooper       : grBuildChannelObj('7' , 'timcooper'       , 'Tim Cooper'),
        faithfulword    : grBuildChannelObj('8' , 'faithfulword'    , 'Faithful Word Baptist Church'),
        verity          : grBuildChannelObj('9' , 'verity'          , 'Verity Baptist Church'),
        baptistbias     : grBuildChannelObj('11', 'baptistbias'     , 'Baptist Bias'),
        documentaries   : grBuildChannelObj('12', 'documentaries'   , 'Documentaries'),
    }

    // Select by url
    let u = new URL(url)
    let channel = channels[u.pathname.split('/').at(-1)]
    
    // Return
    return new PlatformChannel(channel);
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

    const videos = []; // The results (PlatformVideo)
    const hasMore = false; // Are there more pages?
    const context = { url: url, query: query, type: type, order: order, filters: filters, continuationToken: continuationToken }; // Relevant data for the next page
    return new SomeChannelVideoPager(videos, hasMore, context);
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
    return new SomeCommentPager(comments, hasMore, context);

}
source.getSubComments = function (comment) {
    /**
     * @param comment: Comment
     * @returns: SomeCommentPager
     */

    if (typeof comment === 'string') {
        comment = JSON.parse(comment);
    }

    return getCommentsPager(comment.context.claimId, comment.context.claimId, 1, false, comment.context.commentId);
}

class SomeCommentPager extends CommentPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }

    nextPage() {
        return source.getComments(this.context.url, this.context.continuationToken);
    }
}

class SomeHomeVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.getHome(this.context.continuationToken);
    }
}

class SomeSearchVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.search(this.context.query, this.context.type, this.context.order, this.context.filters, this.context.continuationToken);
    }
}

class SomeSearchChannelVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.searchChannelContents(this.context.channelUrl, this.context.query, this.context.type, this.context.order, this.context.filters, this.context.continuationToken);
    }
}

class SomeChannelPager extends ChannelPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.searchChannelContents(this.context.query, this.context.continuationToken);
    }
}

class SomeChannelVideoPager extends VideoPager {
    constructor(results, hasMore, context) {
        super(results, hasMore, context);
    }
    
    nextPage() {
        return source.getChannelContents(this.context.url, this.context.type, this.context.order, this.context.filters, this.context.continuationToken);
    }
}
