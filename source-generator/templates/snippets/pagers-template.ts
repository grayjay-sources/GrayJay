// Pager classes handle pagination for different content types

export class {{PLATFORM_PASCAL}}VideoPager extends VideoPager {
  cb: Function;
  
  constructor(
    results: PlatformVideo[],
    hasMore: boolean,
    context: any,
    cb: Function,
  ) {
    super(results, hasMore, context);
    this.cb = cb;
  }
  
  nextPage() {
    this.context.page += 1;
    return this.cb(this.context);
  }
}

export class {{PLATFORM_PASCAL}}ChannelPager extends ChannelPager {
  cb: Function;
  
  constructor(
    results: PlatformChannel[],
    hasMore: boolean,
    context: any,
    cb: Function,
  ) {
    super(results, hasMore, context);
    this.cb = cb;
  }
  
  nextPage() {
    this.context.page += 1;
    return this.cb(this.context);
  }
}

export class {{PLATFORM_PASCAL}}SearchPager extends VideoPager {
  cb: Function;
  
  constructor(
    results: PlatformVideo[],
    hasMore: boolean,
    params: any,
    page: number,
    cb: Function,
  ) {
    super(results, hasMore, { params, page });
    this.cb = cb;
  }
  
  nextPage() {
    this.context.page += 1;
    
    const opts = {
      query: this.context.params.query,
      type: this.context.params.type,
      order: this.context.params.order,
      filters: this.context.params.filters,
      page: this.context.page,
    };
    
    return this.cb(opts);
  }
}
