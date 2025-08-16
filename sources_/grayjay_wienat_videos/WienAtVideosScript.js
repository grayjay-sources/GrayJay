const PLATFORM = "Stadt Wien";
const VIDEO_PAGER_SIZE = 20;
const BASE_SEARCH_INPUT = {
	"filter": [
		{
			"fieldName": "kategorie",
			"values": [
				"Video"
			]
		}
	],
	"filterSuggestions": [
		"kategorie",
		"collection"
	],
	"from": 0,
	"languages": [
		"de"
	],
	"query": "www.wien.gv.at",
	"sort": [
		{
			"fieldname": "creation_date",
			"order": "desc"
		}
	],
	"size": VIDEO_PAGER_SIZE
};
const ROOT_URI = "https://www.wien.gv.at/";
const FILTER_TAG_ID = "tag";
const FILTER_DATE_ID = "date";
const FILTER_DATE_TODAY = "today";
const FILTER_DATE_LAST_WEEK = "week";
const FILTER_DATE_LAST_MONTH = "month";
const FILTER_DATE_LAST_YEAR = "year";
const FILTER_TAG_MITSCHRIFT = "Mitschrift";
const FILTER_TAG_AKTUELL = "Aktuelle Videos";
const FILTER_TAG_KANÄLE = "wien.at TV Kanäle";
const FILTER_TAG_SOZIAL = "wien.at in den sozialen Medien";
const CHANNEL_PATH = "video/Kanaele/";
const REGEX_DETAILS_URL = new RegExp(ROOT_URI + "video\/(\d*)(\/.*?)?");
const CAPTION_PATH_PRE = "video/assets/videos"
const wienAtVideoRoot = "https://www.wien.gv.at/video/";    // TODO wozu

// https://www.wien.gv.at/search?client=wien&tlen=250&ulang=de&oe=UTF-8&ie=UTF-8&getfields=*&entsp=a__wiengesamt&site=wiengesamt&wc=200&wc_mc=1&q=video+inmeta:gsaentity_Kategorie%3DVideo&dnavs=inmeta:gsaentity_Kategorie%3DVideo&access=p&entqr=3&entqrm=0&ud=1&proxystylesheet=rss&sort=&num=4
// sort=gx_date_dt+desc
//index_timestamp creation_date

var config = {};

// Called when the plugin is enabled/started 
source.enable = function (conf) {
    /**
     * @param conf: SourceV8PluginConfig - the SomeConfig.js
     */
    config = conf ?? {};
}

// Called before the plugin is disabled/stopped 
source.disable = function() { }

// Provide a string that is passed to enable for quicker startup of multiple instances
source.saveState = function() { }

// Gets the HomeFeed of the platform
source.getHome = function() {
    /**
     * @returns: VideoPager
     */
    var pager = new SearchPagerVideos(null);
    pager.nextPage();
    return pager;
}

// Gets search suggestions for a given query
source.searchSuggestions = function(query) {
    /**
     * @param query: string - Query to complete suggestions for
     * @returns: string[]
     */
    return wienAtSuggest(query);
}

// Gets capabilities this plugin has for search contents
source.getSearchCapabilities = function() {
    return {
		types: [ Type.Feed.Videos, Type.Feed.Streams, Type.Feed.Mixed ],
		sorts: [ Type.Order.Chronological ],
		filters: [
            {
                id: FILTER_TAG_ID,
                name: "Mit Tag",
                isMultiSelect: true,
                filters: [  // name is ignored, but can't be null or undefined
                    { id: "Mitschrift", name: "", value: FILTER_TAG_MITSCHRIFT },
                    { id: "Aktuelle Videos", name: "", value: FILTER_TAG_AKTUELL },
                    { id: "TV Kanäle", name: "", value: FILTER_TAG_KANÄLE },
                    { id: "Sozialen Medien", name: "", value: FILTER_TAG_SOZIAL }
                ]
            }
		]
	};

    // TODO: Figure out how to query for this
    //{
    //	id: FILTER_DATE_ID,
    //	name: "Zeitpunkt",
    //	isMultiSelect: false,
    //	filters: [
    //		{ id: Type.Date.Today, name: "Heute", value: FILTER_DATE_TODAY },
    //		{ id: Type.Date.LastWeek, name: "Bis zu einer Woche", value: FILTER_DATE_LAST_WEEK },
    //		{ id: Type.Date.LastMonth, name: "Bis zu einem Monat", value: FILTER_DATE_LAST_MONTH },
    //		{ id: Type.Date.LastYear, name: "Bis zu einem Jahr", value: FILTER_DATE_LAST_YEAR }
    //	]
    //},
}

// Searches for contents on the platform
source.search = function (query, type, order, filters, channelId) {
    /**
     * @param query: string - Query that search results should match
     * @param type: string - (optional) Type of contents to get from search
     * @param order: string - (optional) Order in which contents should be returned
     * @param filters: Map<string, Array<string>> - (optional) Filters to apply on contents
     * @param channelId: any? - (optional) Channel id to search in 
     * @returns: VideoPager
     */
    filters = fixParam(filters);

    var tags = filters[FILTER_TAG_ID];
    // order TODO?

    var pager = new SearchPagerVideos(query, tags);
    pager.nextPage();
    return pager;
}

// Gets capabilities this plugin has for search videos
source.getSearchChannelContentsCapabilities = function () {
	return {
		types: [],
		sorts: [],
		filters: []
	};
}

// Searches for videos on the platform
source.searchChannelContents = function (channelUrl, query, type, order, filters, continuationToken) {
    /**
     * @param channelUrl: string - Channel url to search
     * @param query: string - Query that search results should match
     * @param type: string - (optional) Type of contents to get from search
     * @param order: string - (optional) Order in which contents should be returned
     * @param filters: Map<string, Array<string>> - (optional) Filters to apply on contents
     * @param continuationToken: any?
     * @returns: VideoPager
     */

    // Not yet supported
    return new SearchPagerEmpty();
}

// Searches for channels on the platform
source.searchChannels = function (query, continuationToken) {
    /**
     * @param query: string
     * @param continuationToken: any?
     * @returns: ChannelPager
     */

    // Not yet supported
    return new SearchPagerEmpty();
}

// Validates if a channel url is for this platform 
source.isChannelUrl = function(url) {
    /**
     * @param url: string
     * @returns: boolean
     */

	return url.indexOf(ROOT_URI + CHANNEL_PATH) == 0;
}

// Gets a channel by its url
source.getChannel = function(url) {
    // Not yet supported
    return null;

	//return new PlatformChannel({
		//... see source.js for more details
	//});
}

// Gets contents of a channel (reverse chronological order)
source.getChannelContents = function(url, type, order, filters, continuationToken) {
    /**
     * @param url: string - A channel url (this platform)
     * @param type: string - (optional) Type of contents to get from channel
     * @param order: string - (optional) Order in which contents should be returned 
     * @param filters: Map<string, Array<string>> - (optional) Filters to apply on contents
     * @returns: VideoPager
     */

    // Not yet supported
    return new SearchPagerEmpty();
}

// Validates if an content url is for this platform
source.isContentDetailsUrl = function(url) {
    /**
     * @param url: string - A content url (May not be your platform)
     * @returns: boolean
     */

	return REGEX_DETAILS_URL.test(url);
}

//  Gets content details by its url 
source.getContentDetails = function(url) {
    /**
     * @param url: string - A content url (this platform)
     * @returns: PlatformVideoDetails
     */

    if (!REGEX_DETAILS_URL.test(url))
        throw new ScriptException("Unsupported URI " + url);

    const respVideoPage = http.GET(url, {});

    if (respVideoPage.code >= 300)
        throw new ScriptException("Failed to get video with code " + respVideoPage.code + "\n" + respVideoPage.body);

    var videoPageDocument = domParser.parseFromString(respVideoPage.body); // new DOMParser().parseFromString(respVideoPage.body, "text/html");
    var id = url.match(REGEX_DETAILS_URL)[1];
    var videoAreaFactsNode = videoPageDocument.getElementById("videoAreaFacts");
    var metaNodes = Array.from(videoPageDocument.getElementsByTagName("meta"));

    //var name = videoAreaFactsNode.getElementsByTagName("h1")[0].innerText;
    var thumbnail = getContentByProperty(metaNodes, "og:image");
    var videoAreaFactsNode = videoPageDocument.getElementById("videoAreaFacts");
    //var längeCopyrightNodes = videoAreaFactsNode.getElementsByTagName("p")[1].childNodes;
    //var copyrightText = längeCopyrightNodes[längeCopyrightNodes.length - 1].textContent.trim();
    var copyrightText = videoAreaFactsNode.getElementsByTagName("p")[1].innerHTML.match(/\<strong\>Copyright\:\<\/strong\>\s(.*)/)[1];
    var date = dateToPlatformTimestamp(new Date(getContentByName(metaNodes, "date")));
    var duration = parseInt(getContentByName(metaNodes, "vie:player:duration"));
    var description = getContentByName(metaNodes,"description");
    var width = parseInt(getContentByName(metaNodes,"vie:image:width"));
    var height = parseInt(getContentByName(metaNodes,"vie:image:height"));
    var stream = getContentByName(metaNodes,"twitter:player:stream");
    var mediaType = getContentByName(metaNodes,"twitter:player:stream:content_type");

    //throw new ScriptException(videoPageDocument.getElementsByClassName("vAPOutContainer")[0].getElementsByTagName("script")[0].innerHTML);
    var videoInfoScript = videoPageDocument.getElementsByClassName("vAPOutContainer")[0].getElementsByTagName("script")[0].innerHTML;
    //var id = videoInfoScript.match(/vMId\:\"(\d+)\"/)[1];
    var smilFile = videoInfoScript.match(/vSmilFile\:\"(.+)\"/)[1];
    var vM3u8File = videoInfoScript.match(/vM3u8File\:\"(.+)\"/)[1];
    var vFile = videoInfoScript.match(/vFile\:\"(.+)\"/)[1];
    var vImage = videoInfoScript.match(/vImage\:\"(.+)\"/)[1];
    var name = videoInfoScript.match(/vTitle\:\"(.+)\"/)[1];
    var vTrackMatch = videoInfoScript.match(/vTrack\:\"(.+)\"/);
    var vTrack = vTrackMatch ? vTrackMatch[1] : null;
    var subtitles = []; // TODO    

	return new PlatformVideoDetails({
		id: new PlatformID(PLATFORM, id, config.id),
        name: name,
        thumbnails: new Thumbnails([new Thumbnail(thumbnail, 0)]),
        author: new PlatformAuthorLink(new PlatformID(PLATFORM, null, config.id), copyrightText, null, null),
        datetime: date,
        duration: duration,
        viewCount: null,
        url: url,
        shareUrl: url,
        isLive: false,
        description: description,
        rating: null,
        video: new VideoSourceDescriptor([
            new VideoUrlSource({
                name: "Original",
                url: stream ?? "what",
                width: width,
                height: height,
                duration: duration,
                container: mediaType
            })
        ]),
        subtitles: subtitles
	});
}

// Gets comments for a content by its url
source.getComments = function (url) {
    /**
     * @param url: string - A content url (this platform)
     * @returns: CommentPager
     */

    // Not supported
    return new CommentPagerEmpty();
}

// Gets live events for a livestream
source.getLiveEvents = function (url) {
    /**
     * @param url: string - Url of live stream
     * @returns: PlatformVideoDetails
     */

    // Not yet supported
    return null;
}

// Gets replies for a given comment
source.getSubComments = function (comment) {
    /**
     * @param comment: Comment
     * @returns: SomeCommentPager
     */

    // Not supported
    return new CommentPagerEmpty();
}

// Stadt Wien Videos pager, makes search requests and can fetch next results
class SearchPagerVideos extends VideoPager {
    constructor(searchStr, tags = null, results = [], size = VIDEO_PAGER_SIZE, channelId = null, sortBy = null) {
		super(results, true);
        this.context = {
            totalElements: 0,
            from: -1,
            size: size,
            searchStr: searchStr,
            tags: tags,
            channelId: channelId,   // TODO
            sortBy: sortBy          // TODO
        };
	}
	
	nextPage() {
        var from = this.context.from == -1 ? 0 : this.context.from + this.context.size;
        var searchResults = wienAtSearchVideo(this.context.searchStr, from, this.context.size, this.context.tags, this.context.channelId, this.context.sortBy);
		        
		this.results = searchResults.platformVideos;
        this.context.totalElements = searchResults.totalElements;
        this.context.from = searchResults.from;
        this.context.size = searchResults.size;

        this.hasMore = searchResults.totalElements > searchResults.from + searchResults.size;		
		return this;
	}
}

// Empty VideoPager
class SearchPagerEmpty extends VideoPager {
    constructor() {
        super([], false);
    }
    nextPage() { }
}

// Empty CommentPager
class CommentPagerEmpty extends CommentPager {
    constructor() {
        super([], false);
    }

    nextPage() { }
}

// Search Stadt Wien Videos
function wienAtSearchVideo(query, from, size, tags, channelId, sortBy) {
    var input = { ...BASE_SEARCH_INPUT };
    if (query)
        input.query = query;
    if (from)
        input.from = from;
    if (size)
        input.size = size;
    if (tags)
    {
        input.filter.push({
            fieldName: "subtitles",
            values: tags
        });
    }

    const respSearch = http.POST(ROOT_URI + "sucheapi", JSON.stringify(input), {
		"Content-Type": "application/json" 
	});

    if (respSearch.code >= 300)
        throw new ScriptException("Failed to search with code " + respSearch.code + "\n" + respSearch.body);

    const responseBody = JSON.parse(respSearch.body);
    return {
        platformVideos: responseBody.hits.map((x)=> wienAtSearchHitToPlatformVideo(x)),
        totalElements: responseBody.totalElements,
        from: responseBody.from,
        size: responseBody.size
    }
}

// Suggest search terms
function wienAtSuggest(query) {
    if (!query)
        return [];

    // TODO: Also evaluate older (?) method
    // suggest?max_matches=5&site=video&client=video&token=TEST => BEWARE returns string[]!
    var uri = ROOT_URI + "sucheapi/autosuggest?q=" + encodeURIComponent(query) + "&l=de";
    const respSuggest = http.GET(uri, {});

    if (respSuggest.code >= 300)
        throw new ScriptException("Failed to suggest with code " + respSuggest.code + "\n" + respSuggest.body);

    const responseBody = JSON.parse(respSuggest.body);
    return responseBody.suggestions;
}

// Convert a Stadt Wien Video Search Hit zu a PlatformVideo
function wienAtSearchHitToPlatformVideo(hit) {
    var thumbnail = hit.html_meta_tags.filter(function(tag) { return tag.property == "og:image"})[0].content;
    var duration = parseInt(
        hit.html_meta_tags.filter(function(tag) { return tag.name == "vie:player:duration"})[0].content);
    var videofile = hit.html_meta_tags.filter(function(tag) { return tag.name == "twitter:player:stream"})[0].content;
    var id = hit.link.match(REGEX_DETAILS_URL)[1];

    return new PlatformVideo({
		id: new PlatformID(PLATFORM, id, config.id),
		name: hit.content_title,
		thumbnails: new Thumbnails([new Thumbnail(thumbnail, 0)]),
		author: new PlatformAuthorLink(new PlatformID(PLATFORM, null, config.id), null, null, null),
		datetime: dateToPlatformTimestamp(new Date(hit.creation_date)),
		duration: duration,
		viewCount: -1,
		url: hit.link,
		shareUrl: hit.link,
		isLive: false
	});
}

// Convert a JavaScript Date to a Unix Timestamp, which is expected for Grayjay
function dateToPlatformTimestamp(date){
    return Math.floor(date.getTime() / 1000);
}

// Fixes string values to objects for developer interface testing, as input values are always strings there
function fixParam(value) {
    if (typeof value === 'string')
        return JSON.parse(value);
    return value;
}

function getContentByProperty(nodes, property) {
    return nodes.filter(function(node) { return node.getAttribute("property") == property; })[0].getAttribute("content");
}

function getContentByName(nodes, name) {
    return nodes.filter(function(node) { return node.getAttribute("name") == name; })[0].getAttribute("content");
}